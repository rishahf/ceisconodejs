import * as DAO from "../../DAO";
import { TopDeals, HomePageSections } from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";

class admin_top_deals_module {

    static add_top_deal = async (req: any) => {
        try {

            let {
                image, title, price, category_id, subcategory_id,
                sub_subcategory_id, brand_id, discount, language
            } = req.body;

            // check total deals added
            let query = { is_deleted: false }
            let total_count = await DAO.count_data(TopDeals, query)
            if (total_count < 3) {

                let data_to_save: any = {
                  image: image,
                  title: title,
                  price: price,
                  is_enable: true,
                  updated_at: +new Date(),
                  created_at: +new Date(),
                };
                if (!!category_id) { data_to_save.category_id = category_id }
                if (!!subcategory_id) { data_to_save.subcategory_id = subcategory_id }
                if (!!sub_subcategory_id) { data_to_save.sub_subcategory_id = sub_subcategory_id }
                if (!!brand_id) { data_to_save.brand_id = brand_id }
                if (!!discount) { data_to_save.discount = discount }
                if (!!language) { data_to_save.language = language; }
                
                let response = await DAO.save_data(TopDeals, data_to_save);
                return response
            }
            else {
                throw await handle_custom_error("TOP_DEALS_ADD_ERROR", language)
            }
        }
        catch (err) {
            throw err;
        }
    }

    static update_top_deal = async (req: any) => {
        try {

            let {
                _id, image, title, price, category_id, subcategory_id,
                sub_subcategory_id, brand_id, discount, is_enable
            } = req.body;

            let query = { _id: _id }
            let update: any = { updated_at: +new Date() }

            if (!!image) { update.image = image }
            if (!!title) { update.title = title }
            if (!!price) { update.price = price }
            if (!!category_id) { update.category_id = category_id }
            if (is_enable!= undefined || null) {update.is_enable = is_enable}
            if (!!subcategory_id) { update.subcategory_id = subcategory_id }
            if (!!sub_subcategory_id) { update.sub_subcategory_id = sub_subcategory_id }
            if (!!brand_id) { update.brand_id = brand_id }
            if (!!discount) { update.discount = discount }

            let options = { new: true }
            let response = await DAO.find_and_update(TopDeals, query, update, options);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static list_top_deals = async (req: any) => {
        try {

            let { _id, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false,language:language }
            if (!!_id) { query._id = _id }

            let projection = { __v: 0, is_deleted: 0 }
            let options = await helpers.set_options(pagination, limit)
            let populate = [
                {
                    path: 'category_id',
                    select: 'name'
                },
                {
                    path: 'subcategory_id',
                    select: 'name'
                },
                {
                    path: 'sub_subcategory_id',
                    select: 'name'
                },
                {
                    path: 'brand_id',
                    select: 'name'
                },
            ]
            let banners: any = await DAO.populate_data(TopDeals, query, projection, options, populate)
            let total_count = await DAO.count_data(TopDeals, query)
            return {
                total_count: total_count,
                data: banners
            }

        }
        catch (err) {
            throw err;
        }
    }

    static enable_disable_top_deals = async (req: any) => {
        try {
        let { is_enable } = req.body
        let query = { is_deleted: false };
        let option = { lean: true };
        let get_Deals:any = await DAO.get_data(TopDeals,query, {__v:0 }, option)
        let response: any; 

        if(get_Deals.length){
            get_Deals.forEach(async(deals:any) => {
                let options = { new: true };
                let update = { is_enable: is_enable };
                let queery = { _id: deals._id }
                response = await DAO.find_and_update(TopDeals, queery, update, options)
            });
        }else{
            throw 'No data found'
        }

        if (is_enable == true) {
            let message = `Deals Enabled Successfully`;
            return message
        }else if(is_enable == false){
            let message = `Deals Disabled Successfully`;
            return message;
        }else {
            throw await handle_custom_error("SOMETHING_WENT_WRONG", "ENGLISH")
        }
        }
        catch (err) {
            throw err;
        }
    }

    static detail_top_deals = async (req: any) => {
        try {

            let { _id } = req.params;

            let query: any = { is_deleted: false }
            if (!!_id) { query._id = _id }

            let projection = { __v: 0, is_deleted: 0 }
            let options = {lean:true}
            let populate = [
                {
                    path: 'category_id',
                    select: 'name'
                },
                {
                    path: 'subcategory_id',
                    select: 'name'
                },
                {
                    path: 'sub_subcategory_id',
                    select: 'name'
                },
                {
                    path: 'brand_id',
                    select: 'name'
                },
            ]
            let banners: any = await DAO.populate_data(TopDeals, query, projection, options, populate)
            return banners[0] 
        }
        catch (err) {
            throw err;
        }
    }

    static delete_top_deal = async (req: any) => {
        try {

            let { _id } = req.params;
            let query = { _id: _id }
            let update = { is_deleted: true }
            let options = { new: true }
            let response: any = await DAO.find_and_update(TopDeals, query, update, options)
            if (response.is_deleted == true) {
                let message = `Top Deal Deleted Successfully`;
                return message
            }
            else {
                throw await handle_custom_error("SOMETHING_WENT_WRONG", "ENGLISH")
            }

        }
        catch (err) {
            throw err;
        }
    }

}

class user_top_deals_module {

    static user_list_top_deals = async (req: any) => {
        try {

            let retrive_sections: any = await this.retrive_sections_data()
            if (retrive_sections.length) {
                let { top_deals } = retrive_sections[0]
                if (top_deals == true) {
                    let fetch_data = await this.retrive_data(req)
                    return fetch_data
                }
                else {
                    return {
                        total_count: 0,
                        data: []
                    }
                }
            }

        }
        catch (err) {
            throw err;
        }
    }

    static retrive_sections_data = async () => {
        try {

            let query = {}
            let projection = { __v: 0 }
            let options = { lean: true }
            let response = await DAO.get_data(HomePageSections, query, projection, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static retrive_data = async (req: any) => {
        try {

            let { _id, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false, is_enable:true, language:language }
            if (!!_id) { query._id = _id }

            let projection = { __v: 0, is_deleted: 0 }
            let options = await helpers.set_options(pagination, limit)
            let populate = [
                {
                    path: 'category_id',
                    select: 'name'
                },
                {
                    path: 'subcategory_id',
                    select: 'name'
                },
                {
                    path: 'sub_subcategory_id',
                    select: 'name'
                },
                {
                    path: 'brand_id',
                    select: 'name'
                },
            ]
            let banners: any = await DAO.populate_data(TopDeals, query, projection, options, populate)
            let total_count = await DAO.count_data(TopDeals, query)
            return {
                total_count: total_count,
                data: banners
            }

        }
        catch (err) {
            throw err;
        }
    }

}



export {
    admin_top_deals_module,
    user_top_deals_module
}