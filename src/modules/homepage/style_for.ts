import * as DAO from "../../DAO";
import { StyleFor } from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";

class admin_style_for_module {

    static add_style_for = async (req: any) => {
        try {

            let { name, language } = req.body;

            // check total style for added
            let query = { is_deleted: false }
            let total_count = await DAO.count_data(StyleFor, query)
            if (total_count < 3) {
                let data_to_save: any = {
                    name: name,
                    updated_at: +new Date(),
                    created_at: +new Date()
                }
                if(!!language){ data_to_save.language = language}
                let response = await DAO.save_data(StyleFor, data_to_save);
                return response
            }
            else {
                throw await handle_custom_error("STYLE_FOR_ERROR", language)
            }
        }
        catch (err) {
            throw err;
        }
    }

    static update_style_for = async (req: any) => {
        try {

            let { _id, name, language } = req.body;

            let query = { _id: _id }
            let update: any = { updated_at: +new Date() }
            if (!!name) { update.name = name }
            if (!!language) { update.language = language }

            let options = { new: true }
            let response = await DAO.find_and_update(StyleFor, query, update, options);
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static list_style_for = async (req: any) => {
        try {

            let { _id, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false, language:language }
            if (!!_id) { query._id = _id }

            let projection = { __v: 0, is_deleted: 0 }
            let options = await helpers.set_options(pagination, limit)
            let banners: any = await DAO.get_data(StyleFor, query, projection, options)
            let total_count = await DAO.count_data(StyleFor, query)
           
            return {
                total_count: total_count,
                data: banners
            }

        }
        catch (err) {
            throw err;
        }
    }

    static delete_style_for = async (req: any) => {
        try {

            let { _id } = req.params;
            let query = { _id: _id }
            let update = { is_deleted: true }
            let options = { new: true }
            let response: any = await DAO.find_and_update(StyleFor, query, update, options)
            if (response.is_deleted == true) {
                let message = `Style For Deleted Successfully`;
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

class user_style_for_module {

    static list = async (req: any) => {
        try {

            let { _id, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false,language:language }
            if (!!_id) { query._id = _id }

            let projection = { __v: 0, is_deleted: 0 }
            let options = await helpers.set_options(pagination, limit)
            let retrive_data: any = await DAO.get_data(StyleFor, query, projection, options)
            let total_count = await DAO.count_data(StyleFor, query)
           
            return {
                total_count: total_count,
                data: retrive_data
            }

        }
        catch (err) {
            throw err;
        }
    }


}

export {
    admin_style_for_module,
    user_style_for_module
}