import * as DAO from "../../DAO";
import * as Models from "../../models";
import { handle_custom_error, helpers } from "../../middlewares/index";
import * as search_products from './search_products';
export default class product_variation_module {

    static add = async (req: any) => {
        try {
            let { product_id_1, product_id_2 } = req.body;
            let options = { lean: true }
            let projection = { __v : 0 }
            let response:any

            // let query:any = { product_id_1:product_id_1, product_id_2:product_id_2 }
            let query = {
            //   $or: [
                // {
                  $and: [{ product_id_1: product_id_1 }, { product_id_2: product_id_2 }],
                // },
                // {
                //   $and: [{ product_id_1: product_id_2 }, { product_id_2: product_id_1 }],
                // },
            //   ],
            };
            
            let get_variants:any = await DAO.get_data(Models.Product_Variations,query,projection,options)
            if(get_variants && get_variants.length){
                throw await handle_custom_error("ALREADY_ADDED_VARIANTS", "ENGLISH");
            }else{
                let data_to_save: any = {
                  product_id_1: product_id_1,
                  product_id_2: product_id_2,
                  created_at: +new Date(),
                };
                let data_to_save2: any = {
                  product_id_1: product_id_2,
                  product_id_2: product_id_1,
                  created_at: +new Date(),
                };
                // await this.add_other_variants(product_id,variants_ids)
                response = await DAO.save_data(Models.Product_Variations,data_to_save);
               await DAO.save_data(Models.Product_Variations,data_to_save2);
                return response;
            }
        }
        catch (err) {
            throw err;
        }
    }

    static add_other_variants = async(product_id:any, variants_ids:any) =>{
        let options = { lean: true };
        let projection = { __v: 0 };
        for(let i = 0; i<variants_ids.length; i++){
            let insert_data:any= { 
                product_id:variants_ids[i],
                variants_ids:product_id
            }
            let query_v:any = { product_id:variants_ids[i] }  
            let getVariant1:any = await DAO.get_data(Models.Product_Variations,query_v, projection,options)
            console.log("getVariant1", getVariant1);
                    
            if(getVariant1 && getVariant1.length){
                let query_v2:any = { product_id:variants_ids[i], variants_ids:{ $nin: product_id }  } 
                let getVariant2:any = await DAO.get_data(Models.Product_Variations,query_v2, projection,options)
                
                if (getVariant2 && getVariant2.length) {
                            let variants_arr: any = getVariant2[i].variants_ids;
                            
                            variants_arr.push(product_id);
                            let update: any = {
                                variants_ids: variants_arr
                            };
                            await DAO.find_and_update(Models.Product_Variations,query_v,update,options)
                }
            }else{
                 await DAO.save_data(Models.Product_Variations, insert_data);
            }
        }
        return
    }

    // static list2 = async (req: any) => {
    //     try {
    //       let { product_id } = req.query;

    //       let query: any = {
    //         $or:[
    //             { product_id_1: product_id }, 
    //             { product_id_2: product_id },
    //         ]
    //       }
    //       let projection = { __v: 0 };
    //       let options = {lean :true}

    //       let populate:any = [
    //         { path:'product_id_1',select:'name images price discount discount_price' },
    //         { path:'product_id_2',select:'name images price discount discount_price' }
    //       ]
    //       let product_variations = await DAO.populate_data(Models.Product_Variations,query,projection,options,populate);
         
    //       let response = product_variations

    //       return response;
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }
    static list = async (req: any) => {
        try {
          let { product_id } = req.query;

          let query: any = [
            await search_products.match_product_id_1_2(product_id),
            await search_products.lookup_variants(),
            await search_products.unwind_variant(),
            await search_products.group_variants_data()

          ]
          let projection = { __v: 0 };
          let options = {lean :true}

          let product_variations = await DAO.aggregate_data(Models.Product_Variations,query,options);
          let response = {data:product_variations}

          return response;
        }
        catch (err) {
            throw err;
        }
    }

    static delete = async (req: any) => {
        try {

            let { _id } = req.params;
            let get_variation : any = await DAO.get_data(Models.Product_Variations, { _id: _id },{__v:0},{lean:true})
            if(get_variation && get_variation.length){
                let query = { product_id_1: get_variation[0].product_id_2, product_id_2: get_variation[0].product_id_1 };
                await DAO.remove_data(Models.Product_Variations, query);
                let remove_variation : any = await DAO.remove_data(Models.Product_Variations, { _id: _id })
                if (remove_variation.deletedCount > 0) {
                    let data = { message: `Product Variation deleted successfully...` };
                    return data
                }
            }

        }
        catch (err) {
            throw err;
        }
    }

    static edit = async (req: any) => {
        try {

            let { _id, variants_ids} = req.body;
            let options = { new: true };
            let projection : any = { __v:0 }
            let update: any = { updated_at: +new Date() };
            let query = { _id: _id }

            let other_variants:any = await DAO.get_data(Models.Product_Variations,query,projection,options)
            // let variants_arr:any = other_variants[0].variants_ids;
            // console.log('1 ', variants_arr);
            // console.log('2 ',variants_ids.length)
            
            if (!!variants_ids) {
                for (let i=0; i< variants_ids.length; i++) {
                    console.log("variants_ids ", variants_ids);
                    
                    let other_variants:any = await DAO.get_data(Models.Product_Variations,{product_id:variants_ids[i]},projection,options)
                //   variants_arr.push(variants_ids[i]);
                    console.log("other_variants ", other_variants);
                    
                }
                update.variants_ids = variants_ids;
            }

            let response = await DAO.find_and_update(Models.Product_Variations, query, update, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static add1 = async (req: any) => {
        try {
            let { product_id, variants_ids } = req.body;
            let options = { lean: true }
            let projection = { __v : 0 }
            let response:any

            let query:any = { product_id:product_id, variants_ids:{ $in: variants_ids } }
            let get_variants:any = await DAO.get_data(Models.Product_Variations,query,projection,options)
            console.log('get_var ', get_variants)

            if(get_variants && get_variants.length){
                throw await handle_custom_error("ALREADY_ADDED_VARIANTS", "ENGLISH");
            }

            let query2:any = { product_id:product_id }
            let get_variants2:any = await DAO.get_data(Models.Product_Variations,query2,projection,options)

            if(get_variants2 && get_variants2.length){
                let var_arr:any = get_variants2[0].variants_ids
                for(let i = 0; i<variants_ids.length; i++){
                    var_arr.push(variants_ids[i])
                   
                }
                let update:any = {
                    variants_ids : var_arr
                }
               
                response = await DAO.find_and_update(Models.Product_Variations,query2,update,options)       
                await this.add_other_variants(product_id, variants_ids);                
            }else{
                let data_to_save: any = {
                    product_id: product_id,
                    variants_ids:variants_ids,
                    created_at: +new Date(),
                };
                await this.add_other_variants(product_id,variants_ids)
                response = await DAO.save_data(Models.Product_Variations, data_to_save)
            }
            return response
        }
        catch (err) {
            throw err;
        }
    }

    static list1 = async (req: any) => {
        try {
          let { product_id, pagination, limit } = req.query;

          // let query: any = {}
          // if (!!_id) { query._id = _id }
          // if (!!product_id) { query.product_id = product_id }

          let projection = { __v: 0 };
          let options = await helpers.set_options(pagination, limit);

          let query: any = [
            await search_products.match_product_id(product_id),
            //   await search_products.lookup_variant_head(),
            //   await search_products.unwind_variant_head(),
            await search_products.lookup_variants(),
            await search_products.group_variants_data(),
          ];

          let product_variations = await DAO.aggregate_data(
            Models.Product_Variations,
            query,
            options
          );
          // let total_count = await DAO.count_data(Models.Product_Variations, query)

          // let response = {
          //     // total_count: total_count,
          //     data: product_variations[0]
          // }
          let response = product_variations[0]

          return response;
        }
        catch (err) {
            throw err;
        }
    }

    static delete1 = async (req: any) => {
        try {

            let { _id } = req.params;
            let remove_variation : any = await DAO.remove_data(Models.Product_Variations, { _id: _id })
            if (remove_variation.deletedCount > 0) {
                let data = { message: `Product Variation deleted successfully...` };
                return data
            }

        }
        catch (err) {
            throw err;
        }
    }

    static list_variants_to_add = async (req: any) => {
        try {
            let options = { lean: true };
            let { _id: seller_id } = req.user_data;
            
            let query = [
                await search_products.match_data(seller_id),
                await search_products.lookup_brands(),
                await search_products.unwind_brands(),
                await search_products.lookup_categories(),
                await search_products.unwind_categories(),
                await search_products.lookup_subcategories(),
                await search_products.unwind_subcategories(),
                await search_products.lookup_sub_subcategories(),
                await search_products.unwind_sub_subcategories(),
                await search_products.lookup_seller(),
                await search_products.unwind_seller(),
                await search_products.filter_data(req.query),
                await search_products.group_data(),
                await search_products.sort_data(),
                await search_products.skip_data(req.query),
                await search_products.limit_data(req.query)
            ]
           
            let Products = await DAO.aggregate_data(Models.Products, query, options);

            // if (_id != undefined) {
            //     let get_variants:any = await DAO.get_data(Models.Product_Variations,{product_id:_id}, {__v:0},{lean:true})
            //     console.log('variants ', get_variants[0])
            //     for(let i=0; i<get_variants.length; i++){
            //         console.log(get_variants[i]);
            //     }
                
            // }

            let query_count = [
                await search_products.match_data(seller_id),
                await search_products.lookup_brands(),
                await search_products.unwind_brands(),
                await search_products.lookup_categories(),
                await search_products.unwind_categories(),
                await search_products.lookup_subcategories(),
                await search_products.unwind_subcategories(),
                await search_products.lookup_sub_subcategories(),
                await search_products.unwind_sub_subcategories(),
                await search_products.lookup_seller(),
                await search_products.unwind_seller(),
                await search_products.filter_data(req.query),
                await search_products.group_data(),
                await search_products.sort_data()
            ]
            let CountProducts: any = await DAO.aggregate_data(Models.Products, query_count, options);
            let response = {
                total_count: CountProducts.length,
                data: Products
            };
            return response

        }
        catch (err) {
            throw err;
        }
    }


}
