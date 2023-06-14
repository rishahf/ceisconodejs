import * as DAO from "../../DAO";
import * as Models from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";
import mongoose from "mongoose";

export default class search_module {

    static search = async (req: any) => {
        try {

            let products = await this.search_products(req)
            let categories = await this.search_categories(req)
            let sc = await this.search_sub_categories(req)
            let ssc = await this.search_sub_sub_categories(req)
            // let brands = await this.search_brands(req)
            // let merge = [...products, ...categories, ...sc, ...ssc, ...brands]
            let merge = [...products, ...categories, ...sc, ...ssc ];
            return merge

        }
        catch (err) {
            throw err;
        }
    }

    static search_products = async (req: any) => {
        try {

            let { search } = req.query;
            let query = {
                is_deleted:false,
                is_visible:true,
                name: {
                    $regex: search,
                    $options: "i"
                }
            }
            let projection = { name: 1, images:1 }
            let options = { lean: true, sort: { _id: -1 }, limit: 5 }
            let response: any = await DAO.get_data(Models.Products, query, projection, options)

            let products = []
            if (response.length) {
                for (let i = 0; i < response.length; i++) {
                    products.push({
                        _id: response[i]._id,
                        name: response[i].name,
                        image: response[i].images[0],
                        type: "PRODUCTS"
                    })
                }
            }
            return products

        }
        catch (err) {
            throw err;
        }
    }

    static search_categories = async (req: any) => {
        try {

            let { search } = req.query;
            let query = {
            //   is_deleted: false,
              name: {
                $regex: search,
                $options: "i",
              },
            };
            let projection = { name: 1 }
            let options = { lean: true, sort: { _id: -1 }, limit: 5 }
            let response: any = await DAO.get_data(Models.Category, query, projection, options)

            let category = []
            if (response.length) {
                for (let i = 0; i < response.length; i++) {
                    category.push({
                        _id: response[i]._id,
                        name: response[i].name,
                        type: "CATEGORY"
                    })
                }
            }
            return category

        }
        catch (err) {
            throw err;
        }
    }

    static search_sub_categories = async (req: any) => {
        try {

            let { search } = req.query;
            let query = {
            //   is_deleted: false,
              name: {
                $regex: search,
                $options: "i",
              },
            };
            let projection = { name: 1, category_id : 1 }
            let options = { lean: true, sort: { _id: -1 }, limit: 5 }
            // let populate = [
            //     {
            //         path : 'category_id',
            //         select : 'name'
            //     }
            // ]
            let response: any = await DAO.get_data(Models.SubCategory, query, projection, options)

            let subcategory = []
            if (response.length) {
                for (let i = 0; i < response.length; i++) {
                    subcategory.push({
                        _id: response[i]._id,
                        category_id : response[i].category_id,
                        name: response[i].name,
                        type: "SUB_CATEGORY"
                    })
                }
            }
            return subcategory

        }
        catch (err) {
            throw err;
        }
    }

    static search_sub_sub_categories = async (req: any) => {
        try {

            let { search } = req.query;
            let query = {
            //   is_deleted: false,
              name: {
                $regex: search,
                $options: "i",
              },
            };
            let projection = {__v:0 }
            let options = { lean: true, sort: { _id: -1 }, limit: 5 }
            let response: any = await DAO.get_data(Models.Sub_subcategories, query, projection, options)

            let sub_subcategories = []
            if (response.length) {
                for (let i = 0; i < response.length; i++) {
                    let get_cat_id:any = await DAO.get_data(Models.SubCategory,{_id:response[i].subcategory_id},{__v:0},{lean:true})
                    console.log('cat_id - ', get_cat_id);
                    
                    sub_subcategories.push({
                      _id: response[i]._id,
                      name: response[i].name,
                      category_id: get_cat_id[0].category_id,
                      sub_category_id: response[i].subcategory_id,
                      type: "SUB_SUB_CATEGORIES",
                    });
                }
            }
            return sub_subcategories

        }
        catch (err) {
            throw err;
        }
    }

    static search_brands = async (req: any) => {
        try {

            let { search } = req.query;
            let query = {
            //   is_deleted: false,
              name: {
                $regex: search,
                $options: "i",
              },
            };
            console.log('Brand name -- ', req.query)
            let projection = { name: 1 }
            let options = { lean: true, sort: { _id: -1 }, limit: 5 }
            let response: any = await DAO.get_data(Models.Brands, query, projection, options)
            console.log('brand response --  ', response);
            
            let brands = []
            if (response.length) {
                for (let i = 0; i < response.length; i++) {
                    brands.push({
                        _id: response[i]._id,
                        name: response[i].name,
                        type: "BRANDS"
                    })
                }
            }
            return brands

        }
        catch (err) {
            throw err;
        }
    }

    static searchLocation = async(req:any)=>{
        try {
            let { product_id, lat, lng} = req;
            let query:any = [ 
                await this.match_product_id(product_id)
            ]
            let response:any = await DAO.aggregate_data(Models.Delivery_Locations,query,{lean:true})
            if(response.length){
                return response[0];
            }else{
               return 'Delivery not available';
            }
            
        } catch (err) {
          throw err;
        }
    }

    static match_product_id = async (product_id:string) => {
        return {
            $match: {
                product_id: mongoose.Types.ObjectId(product_id)
            }
        }
    }

}
