import * as DAO from "../../DAO";
import { FashionDeals, HomePageSections } from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";

class admin_fashion_deals_module {

    static add_fashion_deals = async (req: any) => {
        try {

            let {
                image, title, price, category_id, subcategory_id,
                sub_subcategory_id, brand_id, discount, language
            } = req.body;

            let data_to_save: any = {
                image: image,
                title: title,
                price: price,
                is_enable:true,
                updated_at: +new Date(),
                created_at: +new Date()
            }
            if (!!category_id) { data_to_save.category_id = category_id }
            if (!!subcategory_id) { data_to_save.subcategory_id = subcategory_id }
            if (!!sub_subcategory_id) { data_to_save.sub_subcategory_id = sub_subcategory_id }
            if (!!brand_id) { data_to_save.brand_id = brand_id }
            if (!!discount) { data_to_save.discount = discount }
            if (!!language) { data_to_save.language = language }

            let response = await DAO.save_data(FashionDeals, data_to_save);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static update_fashion_deals = async (req: any) => {
        try {

            let {
                _id, image, title, price, category_id, subcategory_id,
                sub_subcategory_id, brand_id, discount, is_enable,language
            } = req.body;

            let query = { _id: _id }
            let update: any = { updated_at: +new Date() }

            if (!!image) { update.image = image }
            if (!!title) { update.title = title }
            if (!!price) { update.price = price }
            if (is_enable!= undefined || null) {update.is_enable = is_enable}
            if (!!category_id) { update.category_id = category_id }
            if (!!subcategory_id) { update.subcategory_id = subcategory_id }
            if (!!sub_subcategory_id) { update.sub_subcategory_id = sub_subcategory_id }
            if (!!brand_id) { update.brand_id = brand_id }
            if (!!discount) { update.discount = discount }
            if (!!discount) { update.language = language }

            let options = { new: true }
            let response = await DAO.find_and_update(FashionDeals, query, update, options);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static list_fashion_deals = async (req: any) => {
        try {

            let { _id, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false , language:language}
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
            let banners: any = await DAO.populate_data(FashionDeals, query, projection, options, populate)
            let total_count = await DAO.count_data(FashionDeals, query)
            return {
                total_count: total_count,
                data: banners
            }

        }
        catch (err) {
            throw err;
        }
    }

    static en_dis_fashion_deals = async (req: any) => {
        try {
            let { is_enable } = req.body
        let query = { is_deleted: false };
        let option = { lean: true };
        let get_Deals:any = await DAO.get_data(FashionDeals,query, {__v:0 }, option)
        let response: any; 

        if(get_Deals.length){
            get_Deals.forEach(async(deals:any) => {
                let options = { new: true };
                let update = { is_enable: is_enable };
                let queery = { _id: deals._id }
                response = await DAO.find_and_update(FashionDeals, queery, update, options)
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

    static detail_fashion_deals = async (req: any) => {
        try {

            let { _id } = req.params;

            let query: any = { _id:_id,is_deleted: false }

            let projection = { __v: 0, is_deleted: 0 }
            let options = { lean:true}
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
            let fashion_deals: any = await DAO.populate_data(FashionDeals, query, projection, options, populate)
            return fashion_deals[0]

        }
        catch (err) {
            throw err;
        }
    }

    static delete_fashion_deals = async (req: any) => {
        try {

            let { _id } = req.params;
            let query = { _id: _id }
            let update = { is_deleted: true }
            let options = { new: true }
            let response: any = await DAO.find_and_update(FashionDeals, query, update, options)
            if (response.is_deleted == true) {
                let message = `Fashion Deal Deleted Successfully`;
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

class user_fashion_deals_module {

    static user_list_fashion_deals = async (req: any) => {
        try {

            let retrive_sections: any = await this.retrive_sections_data()
            if (retrive_sections.length) {
                let { fashion_deals } = retrive_sections[0]
                if (fashion_deals == true) {
                    let fetch_data = await this.retrive_fashion_deals(req)
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

    static retrive_fashion_deals = async (req: any) => {
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
            let banners: any = await DAO.populate_data(FashionDeals, query, projection, options, populate)
            let total_count = await DAO.count_data(FashionDeals, query)
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
    admin_fashion_deals_module,
    user_fashion_deals_module
}