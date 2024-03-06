import * as DAO from "../../DAO";
import * as express from 'express';
import * as Models from "../../models";
import { handle_return, handle_catch, handle_custom_error, helpers } from "../../middlewares/index";
import * as order_details from "./order_details";

export class product_list_module {

    static details = async (req: any) => {
        try {

            let { _id } = req.query;

            let query = { _id: _id,  }
            let projection = { __v: 0 }
            let options = { lean: true }
            let populate = [
                {
                    path: 'added_by',
                    select: 'name'
                },
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
                }
            ]
            let retrive_data: any = await DAO.populate_data(Models.Products, query, projection, options, populate)
            
            if (retrive_data.length) {
                let { _id: product_id } = retrive_data[0]
                console.log(retrive_data[0],'retrive_data');
                let product_details = await this.retrive_product_details(product_id)
                console.log(product_details,'product_detailsproduct_detailsproduct_details');
                
                let product_services = await this.retrive_product_services(product_id)
                let product_highlights = await this.retrive_product_highlights(product_id)
                let product_variations = await this.retrive_product_variations(product_id)
                let product_faqs = await this.retrive_faq_products(product_id)
                let ratings = await this.retrive_product_ratings(product_id)
                let delivery_locations = await this.retrive_product_locations(product_id)
                
                retrive_data[0].is_new_arrival = true
                retrive_data[0].productdetails = product_details
                retrive_data[0].product_services = product_services
                retrive_data[0].product_highlights = product_highlights
                retrive_data[0].product_variations = product_variations
                retrive_data[0].faqs_products = product_faqs
                retrive_data[0].ratings = ratings
                retrive_data[0].delivery_locations = delivery_locations;
                return retrive_data[0]
            }
            else {
                throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
            }

        }
        catch (err) {
            throw err;
        }
    }

    
    static retrive_product_details = async (product_id: string) => {
        try {

            let query = { product_id: product_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let response = await DAO.get_data(Models.ProductDetails, query, projection, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static retrive_product_services = async (product_id: string) => {
        try {

            let query = { product_id: product_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let response = await DAO.get_data(Models.ProductServices, query, projection, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static retrive_product_highlights = async (product_id: string) => {
        try {

            let query = { product_id: product_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let response = await DAO.get_data(Models.ProductHighlights, query, projection, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static retrive_product_variations = async (product_id: string) => {
        try {

            // let query = { product_id_1: product_id }
            let projection = { __v: 0 }
            let options = { lean: true }
             let query = [
               await order_details.match_variant_product_id(product_id),
               await order_details.lookup_variants(),
               await order_details.unwind_variants(),
               await order_details.group_variants_data(),
             ];

             let response = await DAO.aggregate_data(Models.Product_Variations,query,options);
            // let response = await DAO.get_data(Models.Product_Variations, query, projection, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static retrive_faq_products = async (product_id: string) => {
        try {

            let query = { product_id: product_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let response = await DAO.get_data(Models.FaqsProducts, query, projection, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static retrive_product_ratings = async (product_id: string) => {
        try {

            let query = { product_id: product_id }
            let projection = { __v: 0 }
            let options = { lean: true, sort:{updated_at:-1} }
            let populate = [
                {
                    path : "user_id",
                    select : "profile_pic name"
                }
            ]
            let response = await DAO.populate_data(Models.Reviews, query, projection, options, populate)
            return response

        }
        catch (err) {
            throw err;
        }
    }

     static retrive_product_locations = async (product_id: string) => {
        try {

            let query = { product_id: product_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            
            let response = await DAO.get_data(Models.Delivery_Locations, query, projection, options)
            return response

        }
        catch (err) {
            throw err;
        }
    }

}
