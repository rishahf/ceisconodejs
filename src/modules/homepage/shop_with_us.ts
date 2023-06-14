import * as DAO from "../../DAO";
import { ShopWithUs, HomePageSections } from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";

class admin_shop_with_us {

    static add = async (req: any) => {
        try {

            let { image, title, price, category_id,language } = req.body;

            let data_to_save: any = {
                image: image,
                title: title,
                price: price,
                is_enable:true,
                updated_at: +new Date(),
                created_at: +new Date()
            }
            if (!!category_id) { data_to_save.category_id = category_id }
            if (!!language) { data_to_save.language = language }

            let response = await DAO.save_data(ShopWithUs, data_to_save);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static update = async (req: any) => {
        try {

            let { _id, image, title, price, category_id, is_enable,language } = req.body;
            
            let query = { _id: _id }
            let update: any = { updated_at: +new Date() }

            if (!!image) { update.image = image }
            if (!!title) { update.title = title }
            if (!!price) { update.price = price }
            if (is_enable!= undefined || null) {update.is_enable = is_enable}
            if (!!category_id) { update.category_id = category_id }
            if (!!language) { update.language = language }
            
            let options = { new: true }
            let response = await DAO.find_and_update(ShopWithUs, query, update, options);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {

            let { _id, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false,language:language };
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

    static enable_disable = async (req: any) => {
        try {
            let { is_enable } = req.body;
          let query = { is_deleted: false };
          let option = { lean: true };
          let get_Deals: any = await DAO.get_data(ShopWithUs, query,{ __v: 0 },option);
          let response: any;

          if (get_Deals.length) {
            get_Deals.forEach(async (deals: any) => {
              let options = { new: true };
              let update = { is_enable: is_enable };
              let queery = { _id: deals._id };
              response = await DAO.find_and_update(ShopWithUs,queery,update,options);
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

            let query: any = { _id:_id,is_deleted: false }

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

            let { _id, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false , is_enable: true, language:language}
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