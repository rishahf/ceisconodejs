import * as DAO from "../../DAO";
import { Deals_of_the_day, HomePageSections, Deals_Timer } from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";

// admin_deals_of_the_day_module
class admin_dod_module {

    static add_a_deal = async (req: any) => {
        try {

            let {
                image, title, price, category_id, subcategory_id,
                sub_subcategory_id, brand_id, discount,valid_till,language
            } = req.body;

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
            if (!!valid_till) { data_to_save.valid_till = valid_till; }
            if(!!language) { data_to_save.language = language}
            let response = await DAO.save_data(Deals_of_the_day, data_to_save);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static update_a_deal = async (req: any) => {
        try {

            let {
                _id, image, title, price, category_id, subcategory_id,
                sub_subcategory_id, brand_id, discount,valid_till,is_enable,language
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
            if (!!valid_till) { update.valid_till = valid_till }
            if(!!language) { update.language = language}

            let options = { new: true }
            let response = await DAO.find_and_update(Deals_of_the_day, query, update, options);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static list_deals = async (req: any) => {
        try {

            let { _id, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false , language:language}
            if (!!_id) { query._id = _id }

            let projection = { __v: 0, is_deleted : 0 }
            let options = await helpers.set_options(pagination, limit);
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
            let response: any = await DAO.populate_data(Deals_of_the_day, query, projection, options, populate)
            let total_count = await DAO.count_data(Deals_of_the_day, query)
            return {
                total_count: total_count,
                data: response
            }

        }
        catch (err) {
            throw err;
        }
    }

    static detail_deal_of_the_day = async (req: any) => {
        try {

            let { _id } = req.params;

            let query: any = { is_deleted: false }
            if (!!_id) { query._id = _id }

            let projection = { __v: 0, is_deleted : 0 }
            let options = { lean: true }
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
            let response: any = await DAO.populate_data(Deals_of_the_day, query, projection, options, populate)
            if (response.length) {
              return response[0];
            } else {
              throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH");
            }
           

        }
        catch (err) {
            throw err;
        }
    }

    static enable_disable_deals_day= async (req:any) =>{
        try {
            let { is_enable } = req.body
            let query = { is_deleted: false };
            let option = { lean: true };
            let get_Deals:any = await DAO.get_data(Deals_of_the_day,query, {__v:0 }, option)
            let response: any; 

            if(get_Deals.length){
                get_Deals.forEach(async(deals:any) => {
                    let options = { new: true };
                    let update = { is_enable: is_enable };
                    let queery = { _id: deals._id }
                    response = await DAO.find_and_update(Deals_of_the_day, queery, update, options)
                });
            }else{
                throw 'No data found'
            }
          
            let options = { new: true }
            // let response: any = await DAO.find_and_update(Models.Deals, query, update, options)
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

    static delete_a_deal = async (req: any) => {
        try {

            let { _id } = req.params;
            let query = { _id: _id }
            let update = { is_deleted: true }
            let options = { new: true }
            let response: any = await DAO.find_and_update(Deals_of_the_day, query, update, options)
            if (response.is_deleted == true) {
                let message = `Deal Deleted Successfully`;
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

    //add detal timer
    static add_timer_of_deals = async (req: any) => {
        try {

            let { valid_till } = req.body;

            let data_to_save: any = {
              valid_till: valid_till,
              is_active:true,
              created_at: +new Date(),
            };

            let response:any = await DAO.save_data(Deals_Timer, data_to_save);
            await DAO.find_and_update(Deals_Timer,{_id:{$ne:response._id},is_active:true}, {is_active:false},{lean:true})
            return response

        }
        catch (err) {
            throw err;
        }
    }

    //update deal timer
    static update_timer_of_deals = async (req: any) => {
        try {

            let { _id, valid_till, is_active } = req.body;
            if(is_active == true){
                await DAO.find_and_update(Deals_Timer,{is_active: true},{is_active:false},{lean:true})
            }
            let query = { _id: _id }
            let update: any = { updated_at: +new Date() }

            if (!!valid_till) { update.valid_till = valid_till }
            if(!!is_active){ update.is_active = is_active; }

            let options = { new: true }
            let response = await DAO.find_and_update(Deals_Timer, query, update, options);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static get_all_timer_of_deals = async (req: any) => {
        try {
            let { _id, pagination, limit } = req.query;
            let query:any = {}
            
            let projection: any = { __v:0 }
            let options = await helpers.set_options(pagination, limit);
            let response = await DAO.get_data(Deals_Timer, query, projection, options);
            let total_count = await DAO.count_data(Deals_Timer,query)
            // return {
            //     total_count: total_count,
            //     data: response
            // }
            return response

        }
        catch (err) {
            throw err;
        }
    }

     //get deal timer
    static get_timer_of_deals = async (req: any) => {
        try {

            let { _id } = req.params;
            let query = { _id: _id }
            let projection: any = { __v:0 }
            let options = { new: true }
            let response = await DAO.get_data(Deals_Timer, query, projection, options);
            return response[0]

        }
        catch (err) {
            throw err;
        }
    }

     static get_users_timer_of_deals = async (req: any) => {
        try {

            let query = { is_active: true }
            let projection: any = { __v:0 }
            let options = { new: true }
            let response = await DAO.get_data(Deals_Timer, query, projection, options);
            return response[0]

        }
        catch (err) {
            throw err;
        }
    }

}

// user_deals_of_the_day_module
class user_dod_module {

    static user_list_deals = async (req: any) => {
        try {

            let retrive_sections: any = await this.retrive_sections_data()
            if (retrive_sections.length) {
                let { deal_of_the_day } = retrive_sections[0]
                if (deal_of_the_day == true) {
                    let fetch_data = await this.retrive_deals(req)
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

    static retrive_deals = async (req: any) => {
        try {

            let { _id, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false , is_enable:true, language:language}
            if (!!_id) { query._id = _id }

            let projection = { __v: 0, is_deleted : 0 }
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
            let response: any = await DAO.populate_data(Deals_of_the_day, query, projection, options, populate)
            let total_count = await DAO.count_data(Deals_of_the_day, query)
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
    admin_dod_module,
    user_dod_module
}