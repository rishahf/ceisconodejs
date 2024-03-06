import * as DAO from "../../DAO";
import { ShopWithUs, HomePageSections } from "../../models";
import * as Models from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";

class admin_shop_with_us {

    static add = async (req: any) => {
        try {

            let { product_id, is_new_arrival } = req.body;

            let data_to_save: any = {
                product_id: product_id,
                is_new_arrival: is_new_arrival,
                updated_at: +new Date(),
            }
            let response = await DAO.save_data(Models.Products, data_to_save);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static update = async (req: any) => {
        try {

            let { product_id, is_new_arrival } = req.body;
            let response = await DAO.find_and_update(Models.Products, { _id: product_id }, { is_new_arrival: is_new_arrival }, { new: true });
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {

            let { _id, pagination, limit, language } = req.query;

            let query: any = { is_new_arrival:true, language: language };
            if (!!_id) { query._id = _id }

            let projection = { __v: 0, is_new_arrival: 1 }
            let options = await helpers.set_options(pagination, limit)
            let populate = [
                {
                    path: 'category_id',
                    select: 'name'
                }
            ]
            let response: any = await DAO.populate_data(Models.Products, query, projection, options, populate)
            let total_count = await DAO.count_data(Models.Products, query)
            return {
                total_count: total_count,
                data: response
            }

        }
        catch (err) {
            throw err;
        }
    }

    static enable_disable = async (req: any) => {
        try {
            let { is_enable } = req.body;
            let query = { is_deleted: false };
            let option = { lean: true };
            let get_Deals: any = await DAO.get_data(ShopWithUs, query, { __v: 0 }, option);
            let response: any;

            if (get_Deals.length) {
                get_Deals.forEach(async (deals: any) => {
                    let options = { new: true };
                    let update = { is_enable: is_enable };
                    let queery = { _id: deals._id };
                    response = await DAO.find_and_update(ShopWithUs, queery, update, options);
                });
            } else {
                throw "No data found";
            }

            if (is_enable == true) {
                let message = `Enabled Successfully`;
                return message;
            } else if (is_enable == false) {
                let message = `Disabled Successfully`;
                return message;
            } else {
                throw await handle_custom_error("SOMETHING_WENT_WRONG", "ENGLISH");
            }
        }
        catch (err) {
            throw err;
        }
    }

    static detail_shop_with_us = async (req: any) => {
        try {

            let { _id } = req.params;

            let query: any = { _id: _id, is_deleted: false }

            let projection = { __v: 0, is_deleted: 0 }
            let options = { lean: true }
            let populate = [
                {
                    path: 'category_id',
                    select: 'name'
                }
            ]
            let response: any = await DAO.populate_data(ShopWithUs, query, projection, options, populate)
            return response[0]


        }
        catch (err) {
            throw err;
        }
    }

    static delete = async (req: any) => {
        try {

            let { _id } = req.params;
            let query = { _id: _id }
            let update = { is_deleted: true }
            let options = { new: true }
            let response: any = await DAO.find_and_update(ShopWithUs, query, update, options)
            if (response.is_deleted == true) {
                let message = `Shop With Us Deleted Successfully`;
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

class user_shop_with_us {

    static list = async (req: any) => {
        try {

            let retrive_sections: any = await this.retrive_sections_data()
            if (retrive_sections.length) {
                let { shop_with_us } = retrive_sections[0]
                if (shop_with_us == true) {
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

            let { _id, pagination, limit, language } = req.query;

            let query: any = { is_deleted: false, is_enable: true, language: language }
            if (!!_id) { query._id = _id }

            let projection = { __v: 0, is_deleted: 0 }
            let options = await helpers.set_options(pagination, limit)
            let populate = [
                {
                    path: 'category_id',
                    select: 'name'
                }
            ]
            let response: any = await DAO.populate_data(ShopWithUs, query, projection, options, populate)
            let total_count = await DAO.count_data(ShopWithUs, query)
            return {
                total_count: total_count,
                data: response
            }

        }
        catch (err) {
            throw err;
        }
    }


}



export {
    admin_shop_with_us,
    user_shop_with_us
}