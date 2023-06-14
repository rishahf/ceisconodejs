import * as DAO from "../../DAO";
import * as Models from '../../models';
import { helpers, handle_custom_error } from "../../middlewares/index";
import moment from "moment";

export default class coupon_module {

    static add = async (req: any) => {
        try {
            let {
                name, description, type, sub_type, start_date, end_date,
                price, percentage, max_discount,applicable_for, product_ids,language
            } = req.body;

            let unique_code = await helpers.genrate_coupon_code()
            let data_to_save : any = {
                name: name,
                code: unique_code,
                type: type,
                sub_type: sub_type,
                start_date: start_date,
                end_date: end_date,
                applicable_for:applicable_for,
                added_by:"ADMIN",
                language:language,
                updated_at: +new Date(),
                created_at: +new Date(),
            }
            let retrive_fees: any = await DAO.get_data(Models.AdminFees, {}, {}, { lean: true })
            let fee_percentage = retrive_fees.length > 0 ? Number(retrive_fees[0].fee_percent) * 10 : 0
            console.log('retrive_fees[0].fee_percent --',Number(retrive_fees[0].fee_percent));
            
            if(type == 'FIXED'){
                if(price>fee_percentage){
                     throw await handle_custom_error("CHECK_COUPON_AMOUNT", "ENGLISH")
                    // throw 'Please enter amount less than or equals 100'
                }
            }else if(type == 'PERCENTAGE'){
                if (percentage>10 || max_discount>100) {
                    throw await handle_custom_error("CHECK_COUPON_AMOUNT", "ENGLISH")
                }
            }
            if(applicable_for == "LIMITED"){
                if(!!product_ids) { data_to_save.product_ids = product_ids}
            }
            if (!!description) { data_to_save.description = description }
            if (!!price) { data_to_save.price = price }
            if (!!percentage) { data_to_save.percentage = percentage }
            if (!!max_discount) { data_to_save.max_discount = max_discount }
            let response = await DAO.save_data(Models.Coupons, data_to_save)
            return response
        }
        catch (err) {
            throw err;
        }
    }

    static edit = async (req: any) => {
        try {

            let {
                _id, name, description, type, sub_type, start_date, end_date,
                price, percentage, max_discount, is_available, is_deleted,applicable_for, product_ids
            } = req.body;
            
            let query = { _id: _id }
            let update: any = { updated_at: +new Date() }
            if (!!name) { update.name = name }
            if (!!type) { update.type = type }
            if (!!description) { update.description = description }
            if (!!sub_type) { update.sub_type = sub_type }
            if (!!start_date) { update.start_date = start_date }
            if (!!end_date) { update.end_date = end_date }
            if (!!price) { update.price = price }
            if (!!percentage) { update.percentage = percentage }
            if (!!max_discount) { update.max_discount = max_discount }
            if (!!applicable_for) { update.applicable_for = applicable_for }
            if(applicable_for == "LIMITED"){
                if (!!product_ids) { update.product_ids = product_ids }
            }else{
                update.product_ids = null;
            }
            if (typeof is_available !== undefined && is_available !== null && is_available !== undefined) {
                update.is_available = is_available
            }
            if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
                update.is_deleted = is_deleted
            }
            let options = { new: true }
            let response = await DAO.find_and_update(Models.Coupons, query, update, options)
            return response;
        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {

            let { search, pagination, limit,language } = req.query;
            let query: any = { is_deleted: false, added_by:"ADMIN" , language:language}
            if (!!search) { query.name = { $regex: search, $options: "i" } }

            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit);
            let fetch_data = await DAO.get_data(Models.Coupons, query, projection, options);
            let total_count = await DAO.count_data(Models.Coupons, query);
            return {
                total_count: total_count,
                data: fetch_data,
            }
        }
        catch (err) {
            throw err;
        }
    }

    static details = async (req: any) => {
        try {

            let { _id } = req.params;
            let query: any = { is_deleted: false }
            if (!!_id) { query._id = _id }

            let projection = { __v: 0 }
            let options = { lean : true }
            let fetch_data : any = await DAO.get_data(Models.Coupons, query, projection, options);
            if(fetch_data.length) {
                return fetch_data[0]
            }
            else {
                throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
            }
        }
        catch (err) {
            throw err;
        }
    }

    
    static delete = async (req: any) => {
        try {

            let { _id } = req.params;
            let remove_data: any = await DAO.remove_data(Models.Coupons, { _id: _id })
            if (remove_data.deletedCount > 0) {
                let data = { message: `Coupon deleted successfully...` };
                return data
            }

        }
        catch (err) {
            throw err;
        }
    }

    static homepage_coupon = async (req: any) => {
        try {
            let { _id } = req.params;
            let { for_homepage } = req.query;

            let current_date = moment().format("YYYY-MM-DD");
            let projection = { __v: 0 };
            let options = { lean: true };
            let query = { _id: _id, end_date: { $gte: current_date }, applicable_for : 'ALL'  };
            let response_data:any = await DAO.get_data(Models.Coupons,query,projection,options)
        
            let update = {
              for_homepage: for_homepage,
            };  

            if(response_data && response_data.length){
                await DAO.find_and_update(Models.Coupons, query, update,options)
                if(for_homepage == true || for_homepage == 'true'){
                    await DAO.find_and_update(Models.Coupons, {for_homepage:true, _id: {$ne: _id}}, {for_homepage:false},options)
                }
                let response = await DAO.get_data(Models.Coupons,query,projection,options)
                return response[0]
            }else{
                throw await handle_custom_error("CANNOT_ADD_THIS_COUPON_TO_HOMEPAGE", "ENGLISH")
            }
        }
        catch (err) {
            throw err;
        }
    }


}


