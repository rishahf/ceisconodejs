import * as DAO from "../../DAO";
import * as Models from '../../models';
import { helpers, handle_custom_error } from "../../middlewares/index";


export default class listing_module {

    static categories = async (req: any) => {
        try {

            let { _id, search, pagination, limit, language } = req.query;

            let query: any = { is_deleted: false, language: language };
            if (!!_id) { query._id = _id }
            if (!!search) { query.name = { $regex: search, $options: "i" } }

            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit);
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

    static categories_details = async (req: any) => {
        try {

            let { _id } = req.params;
            let query: any = { _id: _id, is_deleted: false }
            let projection = { __v: 0 }
            let options = { lean: true }
            let fetch_data: any = await DAO.get_data(Models.Category, query, projection, options);
            if (fetch_data.length) {
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

    static sub_categories = async (req: any) => {
        try {

            let { _id, category_id, search, pagination, limit,language } = req.query

            let query: any = { is_deleted: false, language: language };
            if (!!_id) { query._id = _id }
            if (!!category_id) { query.category_id = category_id }
            if (!!search) { query.name = { $regex: search, $options: "i" } }

            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit);
            let fetch_data = await DAO.get_data(Models.SubCategory, query, projection, options);
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

    static sub_categories_details = async (req: any) => {
        try {

            let { _id } = req.params;
            let query: any = { _id: _id, is_deleted: false }
            let projection = { __v: 0 }
            let options = { lean: true }
            let fetch_data: any = await DAO.get_data(Models.SubCategory, query, projection, options);
            if (fetch_data.length) {
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

    static sub_subcategories = async (req: any) => {
        try {

            let { _id, subcategory_id, search, pagination, limit , language} = req.query

            let query: any = { is_deleted: false, language: language };
            if (!!_id) { query._id = _id }
            if (!!subcategory_id) { query.subcategory_id = subcategory_id }
            if (!!search) { query.name = { $regex: search, $options: "i" } }

            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit);
            let fetch_data = await DAO.get_data(Models.Sub_subcategories, query, projection, options);
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

    static sub_subcategories_details = async (req: any) => {
        try {

            let { _id } = req.params;
            let query: any = { _id: _id, is_deleted: false }
            let projection = { __v: 0 }
            let options = { lean: true }
            let fetch_data: any = await DAO.get_data(Models.Sub_subcategories, query, projection, options);
            if (fetch_data.length) {
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

    static brands = async (req: any) => {
        try {

            let { _id, search, pagination, limit,language } = req.query;

            let query: any = { is_deleted: false, language: language };
            if (!!_id) { query._id = _id }
            if (!!search) { query.name = { $regex: search, $options: "i" } }

            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit);
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

    static brands_details = async (req: any) => {
        try {

            let { _id } = req.params;
            let query: any = { _id: _id, is_deleted: false }
            let projection = { __v: 0 }
            let options = { lean: true }
            let fetch_data: any = await DAO.get_data(Models.Brands, query, projection, options);
            if (fetch_data.length) {
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

    static nested_data = async (req: any) => {
        try {
            let { language } = req.query;
            let query = { is_deleted: false, language:language }
            let projection = { __v: 0, is_deleted: 0 }
            let options = { lean: true }
            let response: any = await DAO.get_data(Models.Category, query, projection, options)
            let total_count = await DAO.count_data(Models.Category, query)
            if (response.length) {
                await this.retrive_sub_categories(response)
            }
            return {
                total_count: total_count,
                data: response
            }

        }
        catch (err) {
            throw err;
        }
    }

    static retrive_sub_categories = async (categories: any) => {
        try {

            for (let i = 0; i < categories.length; i++) {
                let { _id: category_id } = categories[i];
                let query = { category_id: category_id, is_deleted: false }
                let projection = { __v: 0, is_deleted: 0 }
                let options = { lean: true }
                let sub_categories: any = await DAO.get_data(Models.SubCategory, query, projection, options)
                categories[i].sub_categories = sub_categories
                await this.retrive_sub_sub_categories(sub_categories)
            }

        }
        catch (err) {
            throw err;
        }
    }

    static retrive_sub_sub_categories = async (sub_categories: any) => {
        try {
            if (sub_categories.length) {
                for (let i = 0; i < sub_categories.length; i++) {
                    let { _id: sub_category_id } = sub_categories[i];
                    let query = { subcategory_id: sub_category_id, is_deleted: false }
                    let projection = { __v: 0, is_deleted: 0 }
                    let options = { lean: true }
                    let response: any = await DAO.get_data(Models.Sub_subcategories, query, projection, options)
                    sub_categories[i].sub_subcategories = response
                }
            }
        }
        catch (err) {
            throw err;
        }
    }




}


