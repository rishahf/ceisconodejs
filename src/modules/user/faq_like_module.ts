// FaqLikes
import * as DAO from "../../DAO";
import * as Models from '../../models';
import { app_constant } from '../../config/index';
const user_scope = app_constant.scope.user;
import { verify_token, helpers, handle_custom_error } from "../../middlewares/index";


export default class faqlike_module {

    // static like = async (req: any) => {
    //     try {
    //         let { faq_id, language } = req.body;
    //         let { _id: user_id } = req.user_data;
    //         let retrive_data: any = await this.check_likes(faq_id, user_id)
    //         if (retrive_data.length) {
    //             let { type } = retrive_data[0];
    //             if (type == "LIKE") {
    //                 throw await handle_custom_error("FAQ_ALREADY_LIKED", language)
    //             }
    //         }
    //         else {
    //             let data_to_save = {
    //                 faq_id: faq_id,
    //                 user_id: user_id,
    //                 type: "LIKE",
    //                 updated_at: +new Date(),
    //                 created_at: +new Date()
    //             }
    //             let response = await DAO.save_data(Models.FaqLikes, data_to_save)
    //             return response
    //         }
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    // static dislike = async (req: any) => {
    //     try {
    //         let { faq_id, language } = req.body;
    //         let { _id: user_id } = req.user_data;
    //         let retrive_data: any = await this.check_likes(faq_id, user_id)
    //         if (retrive_data.length) {
    //             let { type } = retrive_data[0];
    //             if (type == "DISLIKE") {
    //                 throw await handle_custom_error("FAQ_ALREADY_DISLIKED", language)
    //             }
    //         }
    //         else {
    //             let data_to_save = {
    //                 faq_id: faq_id,
    //                 user_id: user_id,
    //                 type: "DISLIKE",
    //                 updated_at: +new Date(),
    //                 created_at: +new Date()
    //             }
    //             let response = await DAO.save_data(Models.FaqLikes, data_to_save)
    //             return response
    //         }
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    static like_dislike = async (req: any) => {
        try {

            let { faq_id, type: input_type, language } = req.body;
            let { _id: user_id } = req.user_data;
            let retrive_data: any = await this.check_likes(faq_id, user_id)
            if (retrive_data.length) {
                let { _id, type } = retrive_data[0];
                if (input_type == type) {
                    if (input_type == "LIKE") {
                        throw await handle_custom_error("FAQ_ALREADY_LIKED", language)
                    }
                    if (input_type == "DISLIKE") {
                        throw await handle_custom_error("FAQ_ALREADY_DISLIKED", language)
                    }
                }
                else {
                    let query = { _id: _id }
                    let update = { type: input_type, updated_at: +new Date() }
                    let options = { new: true }
                    let response = await DAO.find_and_update(Models.FaqLikes, query, update, options)
                    return response
                }
            }
            else {
                let data_to_save = {
                    faq_id: faq_id,
                    user_id: user_id,
                    type: input_type,
                    updated_at: +new Date(),
                    created_at: +new Date()
                }
                let response = await DAO.save_data(Models.FaqLikes, data_to_save)
                return response
            }
        }
        catch (err) {
            throw err;
        }
    }

    static check_likes = async (faq_id: string, user_id: string) => {
        try {
            let query = { faq_id: faq_id, user_id: user_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let response = await DAO.get_data(Models.FaqLikes, query, projection, options)
            return response
        }
        catch (err) {
            throw err;
        }
    }

    static fetch_token_data = async (token: string) => {
        try {

            let language = "ENGLISH";
            let token_data: any = await verify_token(token, user_scope, language)
            if (token_data) {
                let { user_id } = token_data
                return user_id
            }
            else {
                throw await handle_custom_error('UNAUTHORIZED', language)
            }
        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {
            let { token } = req.headers;
            let { product_id, pagination, limit,language } = req.query;
            let user_id = token != undefined ? await this.fetch_token_data(token) : null;
            let product = await DAO.get_data(Models.Products, { _id: product_id }, {}, { lean: true })
            let { parent_id } = product[0]
            let query: any = { product_id: product_id, language: language}
            if (!!parent_id) {
                query = { product_id: parent_id , language: language}
            }
            // let query = { product_id: product_id, language: language };
            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit);

            let populate: any = [{ path: "seller_id", select: "name" }];
            let product_faqs: any = await DAO.populate_data(Models.FaqsProducts, query, projection, options,populate)
            
            let total_count = await DAO.count_data(Models.FaqsProducts, query)
            if (product_faqs.length) {
                for (let i = 0; i < product_faqs.length; i++) {
                    
                    let { _id } = product_faqs[i]
                    let total_likes = await this.get_total_likes(_id, "LIKE")
                    let total_dislikes = await this.get_total_likes(_id, "DISLIKE")
                    let like_status = await this.like_dislike_status(_id, user_id, "LIKE")
                    let dislike_status = await this.like_dislike_status(_id, user_id, "DISLIKE")
                    
                    product_faqs[i].total_likes = total_likes
                    product_faqs[i].total_dislikes = total_dislikes
                    product_faqs[i].is_liked = like_status
                    product_faqs[i].is_disliked = dislike_status
                }
            }
            return {
                total_count : total_count,
                data : product_faqs
            }
        }
        catch (err) {
            throw err;
        }
    }

    static get_total_likes = async(faq_id : string, type : string) => {
        try {
            let query = { faq_id : faq_id, type : type }
            let total_count = await DAO.count_data(Models.FaqLikes, query)
            return total_count
        }
        catch(err) {
            throw err;
        }
    }

    static like_dislike_status = async(faq_id : string, user_id : string, type : string) => {
        try {
            let query = { faq_id : faq_id, user_id : user_id, type : type }
            let projection = { __v: 0 }
            let options = { lean: true }
            let retrive_data : any = await DAO.get_data(Models.FaqLikes, query, projection, options)
            let is_liked = retrive_data.length > 0 ? true : false;
            return is_liked;
        }
        catch(err) {
            throw err;
        }
    }

}


