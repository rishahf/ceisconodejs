import * as DAO from "../../DAO";
import * as Models from "../../models";
import mongoose from 'mongoose';
import { handle_custom_error, helpers } from "../../middlewares/index";

export default class product_highlights_module {

    static add = async (req: any) => {
        try {

            let { product_id, highlights } = req.body;
            if (highlights.length) {
                for (let i = 0; i < highlights.length; i++) {
                    let data_to_save: any = {
                        product_id: product_id,
                        content: highlights[i],
                        updated_at: +new Date(),
                        created_at: +new Date()
                    };
                    let response = await DAO.save_data(Models.ProductHighlights, data_to_save)
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

            let { _id, product_id, content } = req.body;

            let query = { _id: _id }
            let update: any = { updated_at: +new Date() }
            if (!!product_id) { update.product_id = product_id }
            if (!!content) { update.content = content }

            let options = { new: true }
            let response = await DAO.find_and_update(Models.ProductHighlights, query, update, options)
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
            let options = await helpers.set_options(pagination, limit);
            options.sort = { _id: 1 };
            let product_variations = await DAO.get_data(Models.ProductHighlights, query, projection, options)
            let total_count = await DAO.count_data(Models.ProductHighlights, query)

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
            let remove_data: any = await DAO.remove_data(Models.ProductHighlights, { _id: _id })
            if (remove_data.deletedCount > 0) {
                let data = { message: `Product highlights deleted successfully...` };
                return data
            }

        }
        catch (err) {
            throw err;
        }
    }

}