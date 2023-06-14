import * as DAO from "../../DAO";
import * as express from "express";
import * as Models from "../../models";
import * as user_services from "./user_services";
import * as user_helper from "./user_helper";
import * as email_services from "./email_services";
import { handle_success, handle_catch, handle_custom_error, helpers } from "../../middlewares/index";

export default class cart_module {

    static add = async (req: any) => {
        try {
            let { product_id } = req.body, { _id: user_id } = req.user_data;
            let retrive_data: any = await this.check_cart(product_id, user_id)
            if (retrive_data.length) {
                throw await handle_custom_error("ITEM_ALREAY_EXISTS", "ENGLISH")
            }
            else {
                let product_data = await this.check_quantity(product_id)
                let { quantity } = product_data
                if (quantity < 1) {
                    throw await handle_custom_error("INSUFFICIENT_QUANTITY", "ENGLISH")
                }
                else {
                    let data_to_save = {
                        user_id: user_id,
                        product_id: product_id,
                        quantity: 1,
                        updated_at: +new Date(),
                        created_at: +new Date()
                    }
                    let response = await DAO.save_data(Models.Cart, data_to_save)
                    return response
                }
            }
        }
        catch (err) {
            throw err;
        }
    }

    static check_cart = async (product_id: string, user_id: string) => {
        try {
            let query = { product_id: product_id, user_id: user_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let response = await DAO.get_data(Models.Cart, query, projection, options)
            return response
        }
        catch (err) {
            throw err;
        }
    }

    static check_quantity = async (product_id: string) => {
        try {
            let query = { _id: product_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let response: any = await DAO.get_data(Models.Products, query, projection, options)
            if (response.length) {
                return response[0]
            }
            else {
                throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
            }
        }
        catch (err) {
            throw err;
        }
    }

    static edit = async (req: any) => {
        try {
            let { _id, quantity } = req.body, { _id: user_id } = req.user_data;

            let query = { _id: _id, user_id: user_id }
            let update: any = { updated_at: +new Date() }
            if (!!quantity) { update.quantity = quantity }

            let options = { new: true }
            let response = await DAO.find_and_update(Models.Cart, query, update, options)
            return response
        }
        catch (err) {
            throw err;
        }
    }

    static list = async (req: any) => {
        try {
            let { pagination, limit } = req.query, { _id: user_id } = req.user_data;

            let query: any = { user_id: user_id }
            let projection = { __v: 0 }
            let options = await helpers.set_options(pagination, limit)
            let populate = [
                {
                    path: 'product_id',
                    select: 'name images price discount_percantage discount discount_price added_by quantity is_deleted',
                    populate: [{ path: 'added_by', select: 'name' },]
                }
            ]
            let retrive_data: any = await DAO.populate_data(Models.Cart, query, projection, options, populate)
            let total_count = await DAO.count_data(Models.Cart, query)

            if (retrive_data.length) {
                for (let i = 0; i < retrive_data.length; i++) {
                    let { product_id: { _id } } = retrive_data[i]
                    let query = { product_id: _id, user_id: user_id }
                    let projection = { __v: 0 }
                    let options = { lean: true }
                    let get_products:any = await DAO.get_data(Models.Products,{_id:_id},{quantity:1},options)
                    console.log('qty',get_products[0].quantity);
                    retrive_data[i].available_quantity = get_products[0].quantity;
                    let get_highlights:any = await DAO.get_data(Models.ProductHighlights,{product_id:_id},{content:1,_id:0},options)
                    retrive_data[i].product_highlights = get_highlights
                    let get_services:any = await DAO.get_data(Models.ProductServices,{product_id:_id},{content:1,_id:0},options)
                    retrive_data[i].product_services = get_services;
                    let response: any = await DAO.get_data(Models.Wishlist, query, projection, options)
                    let wishlisted = response.length > 0 ? true : false
                    retrive_data[i].wishlist = wishlisted
                }
            }

            return {
                total_count: total_count,
                data: retrive_data
            }
        }
        catch (err) {
            throw err;
        }
    }

    static delete = async (req: any) => {
        try {

            let { _id } = req.params, { _id: user_id } = req.user_data;
            let query = { _id: _id, user_id: user_id }
            let remove_data: any = await DAO.remove_data(Models.Cart, query)
            if (remove_data.deletedCount > 0) {
                let data = { message: `Cart Item Removed Successfully` };
                return data
            }

        }
        catch (err) {
            throw err;
        }
    }

    static price_details = async (req: any) => {
        try {

            let { _id: user_id } = req.user_data;
            let query = { user_id: user_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let populate = [
                {
                    path: "product_id",
                    select: "-__v"
                }
            ]
            let response: any = await DAO.populate_data(Models.Cart, query, projection, options, populate)
            
            let cal_price = 0, cal_discount = 0, total_price = 0
            if (response.length) {
                for (let i = 0; i < response.length; i++) {
                    let { quantity, product_id : { price, discount, discount_price } } = response[i]
                    // let step_1 = Number(discount_price) * Number(quantity);
                    cal_price += Number(price) * Number(quantity);
                    cal_discount += Number(discount) * Number(quantity);
                }
            }
            if(cal_price > 0) {
                total_price = Number(cal_price) - Number(cal_discount)
            }
            return {
                price : cal_price,
                discount : cal_discount,
                total_price : total_price
            }

        }
        catch (err) {
            throw err;
        }
    }



}
