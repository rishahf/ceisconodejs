import * as DAO from "../../DAO";
import * as Models from "../../models";
import { handle_custom_error, helpers } from "../../middlewares/index";

export default class product_details_module {

    static retrive_unique_number = async (product_id: string) => {
        try {
            let query = { product_id: product_id };
            let total_count = await DAO.count_data(Models.ProductDetails, query);
            let unique_number = Number(total_count) + 1
            return unique_number
        }
        catch (err) {
            throw err;
        }
    }

    static add = async (req: any) => {
        try {

            let { product_id, product_details } = req.body;
            let unique_number = await this.retrive_unique_number(product_id)

            if (product_details.length) {
                for (let i = 0; i < product_details.length; i++) {
                    let { key, value } = product_details[i];
                    let data_to_save: any = {
                        product_id: product_id,
                        key: key,
                        value: value,
                        unique_number: unique_number,
                        updated_at: +new Date(),
                        created_at: +new Date()
                    };
                    let response = await DAO.save_data(Models.ProductDetails, data_to_save)
                    return response
                }
            }
        }
        catch (err) {
            throw err;
        }
    }

    static edit = async (req: any) => {
        try {

            let { _id, product_id, key, value } = req.body;

            let query = { _id: _id }
            let update: any = { updated_at: +new Date() }
            if (!!product_id) { update.product_id = product_id }
            if (!!key) { update.key = key }
            if (!!value) { update.value = value }

            let options = { new: true }
            let response = await DAO.find_and_update(Models.ProductDetails, query, update, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {

            let { _id, product_id, pagination, limit } = req.query;

            let query: any = {}
            if (!!_id) { query._id = _id }
            if (!!product_id) { query.product_id = product_id }

            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit)
            options.sort = { _id: 1 }
            let product_variations = await DAO.get_data(Models.ProductDetails, query, projection, options)
            let total_count = await DAO.count_data(Models.ProductDetails, query)

            let response = {
                total_count: total_count,
                data: product_variations
            }

            return response
        }
        catch (err) {
            throw err;
        }
    }

    static delete = async (req: any) => {
        try {

            let { _id } = req.params;
            let remove_data: any = await DAO.remove_data(Models.ProductDetails, { _id: _id })
            if (remove_data.deletedCount > 0) {
                let data = { message: `Product Details deleted successfully...` };
                return data
            }

        }
        catch (err) {
            throw err;
        }
    }

}