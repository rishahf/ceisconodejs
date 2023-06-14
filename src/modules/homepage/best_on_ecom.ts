import * as DAO from "../../DAO";
import { BestOnEcom, HomePageSections, Coupons} from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";
import moment, { lang } from "moment";

class admin_best_on_ecom {

    static add = async (req: any) => {
        try {

            let { 
                image, title, price, category_id, subcategory_id,
                sub_subcategory_id, brand_id, discount, language } = req.body;
            console.log('req- body ---- ', req.body)

            let data_to_save: any = {
                image: image,
                title: title,
                price: price,
                updated_at: +new Date(),
                created_at: +new Date()
            }
            if (!!category_id) { data_to_save.category_id = category_id }
            if (!!subcategory_id) { data_to_save.subcategory_id = subcategory_id }
            if (!!sub_subcategory_id) { data_to_save.sub_subcategory_id = sub_subcategory_id }
            if (!!brand_id) { data_to_save.brand_id = brand_id }
            if (!!discount) { data_to_save.discount = discount }
            if (!!language) { data_to_save.language = language }

            let response = await DAO.save_data(BestOnEcom, data_to_save);
            console.log('response ----- ', response)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static update = async (req: any) => {
        try {

            let {
                _id, image, title, price, category_id, subcategory_id,
                sub_subcategory_id, brand_id, discount,language
            } = req.body;

            let query = { _id: _id }
            let update: any = { updated_at: +new Date() }

            if (!!image) { update.image = image }
            if (!!title) { update.title = title }
            if (!!price) { update.price = price }
            if (!!category_id) { update.category_id = category_id }
            if (!!subcategory_id) { update.subcategory_id = subcategory_id }
            if (!!sub_subcategory_id) { update.sub_subcategory_id = sub_subcategory_id }
            if (!!brand_id) { update.brand_id = brand_id }
            if (!!discount) { update.discount = discount }
            if (!!language) { update.language = language }

            let options = { new: true }
            let response = await DAO.find_and_update(BestOnEcom, query, update, options);
            return response

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
          let get_Deals: any = await DAO.get_data(BestOnEcom, query,{ __v: 0 },option);
          let response: any;

          if (get_Deals.length) {
            get_Deals.forEach(async (deals: any) => {
              let options = { new: true };
              let update = { is_enable: is_enable };
              let queery = { _id: deals._id };
              response = await DAO.find_and_update(BestOnEcom,queery,update,options);
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

    static list = async (req: any) => {
        try {

            let { _id, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false, language:language }
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
            let response: any = await DAO.populate_data(BestOnEcom, query, projection, options, populate)
            let total_count = await DAO.count_data(BestOnEcom, query)
            return {
                total_count: total_count,
                data: response
            }

        }
        catch (err) {
            throw err;
        }
    }

    static detail = async (req: any) => {
        try {

            let { _id } = req.params;

            let query: any = {_id:_id, is_deleted: false }

            let projection = { __v: 0, is_deleted: 0 }
            let options = { lean: true}
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
            let response: any = await DAO.populate_data(BestOnEcom, query, projection, options, populate)
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
            let response: any = await DAO.find_and_update(BestOnEcom, query, update, options)
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

class user_best_on_ecom {

    static homepageCoupon = async (req: any) => {
        try {

            let current_date = moment().format("YYYY-MM-DD")
            let query = { for_homepage: true, end_date: { $gte: current_date } };
            let projection = { __v: 0, is_deleted: 0 };
            let options = { lean: true }
            let response:any = await DAO.get_data(Coupons,query,projection,options)
            if(response && response.length){
                return response[0];
            }else{
                return []
            }
        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {

            let retrive_sections: any = await this.retrive_sections_data()
            if (retrive_sections.length) {
                let { best_on_ecom } = retrive_sections[0]
                if (best_on_ecom == true) {
                    let fetch_data = await this.retrive_boe(req)
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

    static retrive_boe = async (req: any) => {
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
            let response: any = await DAO.populate_data(BestOnEcom, query, projection, options, populate)
            let total_count = await DAO.count_data(BestOnEcom, query)
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
    admin_best_on_ecom,
    user_best_on_ecom
}