import * as DAO from "../../DAO";
import * as Models from "../../models";
import { handle_custom_error, helpers } from "../../middlewares/index";

export default class product_faq_module {

    static add = async (req: any) => {
        try {
            let { product_id, question, answer } = req.body;
            let { _id: seller_id } = req.user_data;
            let product_info: any = await DAO.get_data(Models.Products, { _id: product_id }, {}, { lean: true })
            let { parent_id } = product_info[0]
            let data_to_save: any = {
                // product_id: product_id,
                seller_id: seller_id,
                question: question,
                answer: answer,
                updated_at: +new Date(),
                created_at: +new Date()
            };
            if (!!parent_id) {
                data_to_save.product_id = parent_id
            } else {
                data_to_save.product_id = product_id
            }
            let response = await DAO.save_data(Models.FaqsProducts, data_to_save)
            return response
        }
        catch (err) {
            throw err;
        }
    }

    static edit = async (req: any) => {
        try {

            let { _id, question, answer } = req.body;

            let query = { _id: _id }
            let update: any = { updated_at: +new Date() }
            if (!!question) { update.question = question }
            if (!!answer) { update.answer = answer }

            let options = { new: true }
            let response = await DAO.find_and_update(Models.FaqsProducts, query, update, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static faq_list = async (req: any) => {
        try {
            let { _id, product_id, pagination, limit } = req.query;
            let query: any = {}
            if (!!_id) { query._id = _id }
            if (!!product_id) {
                let product_info: any = await DAO.get_data(Models.Products, { _id: product_id }, {}, { lean: true })
                let { parent_id } = product_info[0]
                query.product_id = product_id
                if (!!parent_id) {
                    query.product_id = parent_id
                }
            }
            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit)
            let retrive_data = await DAO.get_data(Models.FaqsProducts, query, projection, options)
            let total_count = await DAO.count_data(Models.FaqsProducts, query)

            let response = {
                total_count: total_count,
                data: retrive_data
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
            let remove: any = await DAO.remove_data(Models.FaqsProducts, { _id: _id })
            if (remove.deletedCount > 0) {
                let data = { message: `Product Faq deleted successfully...` };
                return data
            }

        }
        catch (err) {
            throw err;
        }
    }

}
