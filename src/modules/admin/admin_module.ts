import * as DAO from "../../DAO";
import * as Models from '../../models';
import { helpers, handle_custom_error } from "../../middlewares/index";
import moment from "moment";
import * as Mongoose from 'mongoose';

class category {

    static add = async (req: any) => {
        try {
            let { name, product_type,language } = req.body;
            let design_type: any = product_type == "WEARABLE_PRODUCT" ? 2 : 1;

            let small_caps:any = name.toLowerCase()
            let capt_first = name.charAt(0).toUpperCase() + name.slice(1);

            let query = { name : { $in :[ small_caps, capt_first ]} }
            let get_cat:any = await DAO.get_data(Models.Category,query,{__v:0},{lean:true});

            if(get_cat && get_cat.length){
                console.log('get-cat -- ', language)
                throw await handle_custom_error("CATEGORY_EXIST",language);
            }else {
                let data_to_save = {
                  name: name,
                  design_type: design_type,
                  language:language,
                  updated_at: +new Date(),
                  created_at: +new Date(),
                };
                let response = await DAO.save_data(Models.Category, data_to_save)
                return response;
            }  
        }
        catch (err) {
            throw err;
        }
    }

    static edit = async (req: any) => {
        try {
            let { _id, name, is_deleted, product_type } = req.body;
            console.log('-------- catgeory edit  req-body ---------', req.body)
            let query = { _id: _id }
            let options = { new: true };
            let update: any = { updated_at: +new Date() }
            if (!!name) { update.name = name }
            if (!!product_type) { 
                let design_type: any = product_type == "WEARABLE_PRODUCT" ? 2 : 1;
                update.design_type = design_type; 
            }
            if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
                update.is_deleted = is_deleted
            }
            console.log('---category update ---- ', update)

            let products:any = await DAO.get_data(Models.Products,{category_id:_id},{__v:0},options)
            let response :any;

            if(typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined){
                if(products && products.length){
                    response = await DAO.find_and_update(Models.Category, query, update, options)
                    let data = { message: `Caetgory disabled successfully...` };
                    return data;
                // }else if(typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined){
                }else{
                    let remove_data:any =await DAO.remove_data(Models.Category,query)
                    let get_sub_category:any = await DAO.get_data(Models.SubCategory,{category_id:_id},{__v:0},options)
                    for(let i=0; i< get_sub_category.length; i++){
                        let get_sub_subcategory:any = await DAO.get_data(Models.Sub_subcategories,{subcategory_id:get_sub_category[i]._id},{__v:0},options)
                        for(let k =0; k<get_sub_subcategory.length; k++){
                            await DAO.remove_many(Models.Sub_subcategories, { subcategory_id: get_sub_category[k]._id });
                        }
                        await DAO.remove_many(Models.SubCategory, { category_id: _id });
                    }
                    if (remove_data.deletedCount > 0) {
                        let data = { message: `Category deleted successfully...` };
                        return data;
                    }
                }
            }else {
                response = await DAO.find_and_update(Models.Category, query, update, options)
               let data = { message: `Category updated successfully...` };
               return data;
            }

            // let response = await DAO.find_and_update(Models.Category, query, update, options)
            // return response;
        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {
            let { _id, search, pagination, limit, start_date, end_date,language } = req.query;

            let query: any = { language: language}
            if (!!_id) { query._id = _id }
            if (!!search) { query.name = { $regex: search, $options: "i" } }
            if (start_date != undefined && end_date != undefined) {
                // let set_start_date = moment.utc(start_date,"DD/MM/YYYY").startOf('day').format('x');
                // let set_end_date = moment.utc(end_date,"DD/MM/YYYY").endOf('day').format('x');
                query.$and = [
                    { created_at: { $gte:start_date } },
                    { created_at: { $lte: end_date } }
                ]
            }

            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit);
            let delete_count = await DAO.remove_data(Models.Category, {_id:"649a8cd10e58e1248dced535"});
            let fetch_data = await DAO.get_data(Models.Category, query, projection, options);
            let total_count = await DAO.count_data(Models.Category, query);
            return {
                total_count: total_count,
                data: fetch_data,
            }
        }
        catch (err) {
            throw err;
        }
    }

    static category = async (req: any) => {
        try {
            let { _id } = req.params;

            let query: any = {}
            if (!!_id) { query._id = _id }

            let projection = { __v: 0 }
            let options = { lean:true };
            let fetch_data = await DAO.get_data(Models.Category, query, projection, options);
            return fetch_data[0]
            
        }
        catch (err) {
            throw err;
        }
    }

}

class sub_category {

    static add = async (req: any) => {
        try {
            let { category_id, name ,language} = req.body;
            let query ={$and:[ {name: name} , {category_id:category_id}]}
            let fetch_data : any = await DAO.get_data(Models.SubCategory , query , {__v:0} , {lean:true})
            if (fetch_data && fetch_data.length) {
                console.log('get-cat -- ', language)
                throw await handle_custom_error("CATEGORY_EXIST",language);
            }else{
                let data_to_save = {
                    category_id: category_id,
                    name: name,
                    language:language,
                    updated_at: +new Date(),
                    created_at: +new Date(),
                }
                let response = await DAO.save_data(Models.SubCategory, data_to_save)
                return response;
            }
          
        }
        catch (err) {
            throw err;
        }
    }

    static edit = async (req: any) => {
        try {

            let { _id, name, category_id, is_deleted, language } = req.body;
            console.log('req-body ------ ', req.body)
            let options = { new: true };
            let query = { _id: _id }

            let update: any = { updated_at: +new Date() }
            if (!!name) { update.name = name }
            if (!!category_id) { update.category_id = category_id }
            if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
                update.is_deleted = is_deleted
            }
            if(language){ update.language = language}

            let products:any = await DAO.get_data(Models.Products,{subcategory_id:_id},{__v:0},options)
            if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined && is_deleted != false) {
                if(products && products.length){
                    console.log('--------- 1');
                    
                    await DAO.find_and_update(Models.SubCategory, query, update, options)
                    let data = { message: `Subcategory updated successfully...` };
                    return data;
                }else{
                    console.log("--------- 2");
                    let remove_data:any =await DAO.remove_data(Models.SubCategory,query)
                    let get_sub_category:any = await DAO.get_data(Models.Sub_subcategories,{subcategory_id:_id},{__v:0},options)
                    
                    if(get_sub_category && get_sub_category.length){
                        for(let i=0; i< get_sub_category.length; i++){
                        // let get_sub_subcategory:any = await DAO.get_data(Models.Sub_subcategories,{subcategory_id:get_sub_category[i]._id},{__v:0},options)
                        await DAO.remove_many(Models.Sub_subcategories, { _id: get_sub_category[i]._id });
                       
                    }
                    }
                    if (remove_data.deletedCount > 0) {
                        let data = { message: `Subcategory deleted successfully...` };
                        return data;
                    }
                }
            }else {
                console.log("--------- 3");
                await DAO.find_and_update(Models.SubCategory, query, update, options)
               let data = { message: `Subcategory updated successfully...` };
               return data;
            }

            // let response = await DAO.find_and_update(Models.SubCategory, query, update, options)
            // return response;
        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {

            let { _id, category_id, search, pagination, limit,start_date, end_date,language } = req.query;
            let query: any = { language: language };
            if (!!_id) { query._id = _id }
            if (!!category_id) { query.category_id = category_id }
            if (!!search) { query.name = { $regex: search, $options: "i" } }
            if (start_date != undefined && end_date != undefined) {
                let set_start_date = moment.utc(start_date,"DD/MM/YYYY").startOf('day').format('x');
                let set_end_date = moment.utc(end_date,"DD/MM/YYYY").endOf('day').format('x');
                query.$and = [
                    { created_at: { $gte: start_date } },
                    { created_at: { $lte: end_date } }
                ]
            }
            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit);
            let populate = [{ path: "category_id", select: "name" }];
            let fetch_data = await DAO.populate_data(Models.SubCategory, query, projection, options ,populate);
            let total_count = await DAO.count_data(Models.SubCategory, query);
            return {
                total_count: total_count,
                data: fetch_data,
            }

        }
        catch (err) {
            throw err;
        }
    }

    static subcategory = async (req: any) => {
        try {

            let { _id } = req.params;
            let query: any = { is_deleted: false }
            if (!!_id) { query._id = _id }
           
            let options = { lean: true };
            let projection = { __v: 0 }
            let populate = [{ path: "category_id", select: "name" }];
            let fetch_data = await DAO.populate_data(Models.SubCategory, query, projection, options,populate);
            return fetch_data[0]
            
        }
        catch (err) {
            throw err;
        }
    }

}

class sub_sub_category {

    static add = async (req: any) => {
        try {
            let { subcategory_id, name,language } = req.body;
            let query ={$and:[ {name: name} , {subcategory_id:subcategory_id}]}
            let fetch_data : any = await DAO.get_data(Models.Sub_subcategories , query , {__v:0} , {lean:true})
            if (fetch_data && fetch_data.length) {
                console.log('get-cat -- ', language)
                throw await handle_custom_error("CATEGORY_EXIST",language);
            }else{
            let data_to_save = {
                subcategory_id: subcategory_id,
                name: name,
                language:language,
                updated_at: +new Date(),
                created_at: +new Date(),
            }
            let response = await DAO.save_data(Models.Sub_subcategories, data_to_save)
            return response;
        }
    }
        catch (err) {
            throw err;
        }
    }

    static edit = async (req: any) => {
        try {

            let { _id, name, subcategory_id, is_deleted,language } = req.body;

            let query = { _id: _id }

            let update: any = { updated_at: +new Date() }
            if (!!name) { update.name = name }
            if (!!subcategory_id) { update.subcategory_id = subcategory_id }
            if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
                update.is_deleted = is_deleted
            }
            if(!!language) { update.language = language }

            let options = { new: true }
            let response = await DAO.find_and_update(Models.Sub_subcategories, query, update, options)
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {
            let { _id, subcategory_id, search, pagination, limit, start_date, end_date, language } = req.query;

            let query: any = { language: language };
            if (!!_id) { query._id = _id }
            if (!!subcategory_id) { query.subcategory_id = subcategory_id }
            if (!!search) { query.name = { $regex: search, $options: "i" } }
            if (start_date != undefined && end_date != undefined) {
                // let set_start_date = moment.utc(start_date,"DD/MM/YYYY").startOf('day').format('x');
                // let set_end_date = moment.utc(end_date,"DD/MM/YYYY").endOf('day').format('x');
                query.$and = [
                    { created_at: { $gte: start_date } },
                    { created_at: { $lte: end_date } }
                ]
            }

            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit);
            let populate = [{ path: "subcategory_id", select: "name",
            populate: {
                path: "category_id",
                select: "name"
              }
           }];
            let fetch_data = await DAO.populate_data(Models.Sub_subcategories, query, projection, options , populate );
            let total_count = await DAO.count_data(Models.Sub_subcategories, query);
            return {
                total_count: total_count,
                data: fetch_data,
            }
        }
        catch (err) {
            throw err;
        }
    }

     static sub_subcategory = async (req: any) => {
        try {
            let { _id } = req.params;

            let query: any = { is_deleted: false }
            if (!!_id) { query._id = _id }
            let projection = { __v: 0 }
            let options = { lean: true };
            let populate = [
                { 
                    path: "subcategory_id", select: "name" ,
                    populate: [ { path:"category_id" , select:"name",
                     populate: {
                        path: "category_id",
                        select: "name"
                      }}]
                }
            ];
            let fetch_data = await DAO.populate_data(Models.Sub_subcategories, query, projection, options,populate);
            // let total_count = await DAO.count_data(Models.Sub_subcategories, query);
            return  fetch_data[0]
        }
        catch (err) {
            throw err;
        }
    }

}



class brand {

    static add = async (req: any) => {
        try {
            let { name,language } = req.body;

            let small_caps:any = name.toLowerCase();
            let capt_first = name.charAt(0).toUpperCase() + name.slice(1);

            let query = { name : { $in :[ small_caps, capt_first ]} }
            let get_brands:any = await DAO.get_data(Models.Brands,query,{__v:0},{lean:true});

            if(get_brands && get_brands.length){
                throw await handle_custom_error("BRAND_EXIST",language);
            }else {
                let data_to_save = {
                  name: name.charAt(0).toUpperCase() + name.slice(1),
                  language: language,
                  updated_at: +new Date(),
                  created_at: +new Date(),
                };
                let response = await DAO.save_data(Models.Brands, data_to_save);
                return response;
            }
        }
        catch (err) {
            throw err;
        }
    }

    static edit = async (req: any) => {
        try {

            let { _id, name, is_deleted, language } = req.body;

            let query = { _id: _id }

            let update: any = { updated_at: +new Date() }
            if (!!name) { update.name = name.charAt(0).toUpperCase() + name.slice(1); }
            if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
                update.is_deleted = is_deleted
            }
            if (!!language) { update.language = language }

            let options = { new: true }
            let response = await DAO.find_and_update(Models.Brands, query, update, options)
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {
            let { _id, search, pagination, limit,start_date,end_date,language } = req.query;

            let query: any = { is_deleted: false,language:language }
            if (!!_id) { query._id = _id }
            if (!!search) { query.name = { $regex: search, $options: "i" } }
            if (start_date != undefined && end_date != undefined) {
                let set_start_date = moment.utc(start_date,"DD/MM/YYYY").startOf('day').format('x');
                let set_end_date = moment.utc(end_date,"DD/MM/YYYY").endOf('day').format('x');
                query.$and = [
                    { created_at: { $gte: set_start_date } },
                    { created_at: { $lte: set_end_date } }
                ]
            }
            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit);
            options.sort = { name: 1 }
            let fetch_data = await DAO.get_data(Models.Brands, query, projection, options);
            let total_count = await DAO.count_data(Models.Brands, query);
            return {
                total_count: total_count,
                data: fetch_data,
            }
        }
        catch (err) {
            throw err;
        }
    }

    static brands = async (req: any) => {
        try {
            let { _id } = req.params;

            let query: any = { is_deleted: false }
            if (!!_id) { query._id = _id }
            let projection = { __v: 0 }
            let options = { lean: true };
            let fetch_data = await DAO.get_data(Models.Brands, query, projection, options);
            return fetch_data[0]
        }
        catch (err) {
            throw err;
        }
    }

}

class fees_module {

    static add = async (req: any) => {
        try {
            let { fee_percent } = req.body;
            let retrive_data: any = await DAO.get_data(Models.AdminFees, {}, {}, { lean: true })
            if (retrive_data.length) {
                return retrive_data[0]
            }
            else {
                let data_to_save = {
                    fee_percent: fee_percent,
                    updated_at: +new Date(),
                    created_at: +new Date(),
                }
                let response = await DAO.save_data(Models.AdminFees, data_to_save)
                return response;
            }
        }
        catch (err) {
            throw err;
        }
    }

    static edit = async (req: any) => {
        try {
            let { fee_percent } = req.body;
            let retrive_data: any = await DAO.get_data(Models.AdminFees, {}, {}, { lean: true })
            if (retrive_data.length) {
                let { _id } = retrive_data[0];
                let query = { _id: _id }
                let update: any = { 
                    fee_percent : fee_percent,
                    updated_at: +new Date() 
                }
                let options = { new: true }
                let response = await DAO.find_and_update(Models.AdminFees, query, update, options)
                return response;
            }
            else {
                throw await handle_custom_error("NO_DATA_FOUND", "ENGLISH")
            }
        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {

            let query: any = {}
            let projection = { __v: 0 }
            let options = { lean: true }
            let fetch_data = await DAO.get_data(Models.AdminFees, query, projection, options);
            let total_count = await DAO.count_data(Models.AdminFees, query);
            return {
                total_count: total_count,
                data: fetch_data[0]
            }

        }
        catch (err) {
            throw err;
        }
    }

}

export {
    category,
    sub_category,
    sub_sub_category,
    brand,
    fees_module
}
