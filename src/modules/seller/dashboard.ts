import * as DAO from "../../DAO";
import * as express from 'express';
import * as Models from "../../models";
import * as email_services from "./email_services";
import * as search_products from './search_products';
import { handle_return, handle_catch, handle_custom_error, helpers } from "../../middlewares/index";


// Total product count
// Out of Stock (Total product that are out of stock)
// Alert of Stock (Product that will soon go out of that ie quantity less then 5)
// Total orders count
// Total rating & reviews count
// Total earning (Addition of all order pricing)



export default class dashboard_module {

    static count = async (req: any) => {
        try {

            let { _id: seller_id } = req.user_data;

            let query = { added_by: seller_id, is_deleted: false };

            let total_products = await DAO.count_data(Models.Products, query);
            let out_of_stock = await this.out_of_stock_count(req)
            let alert_of_stock = await this.alert_of_stock_count(req)
            let total_orders = await DAO.count_data(Models.OrderProducts, { seller_id: seller_id });
            let total_reviews = await this.total_reviews(req)
            let total_ratings = await this.total_ratings(req)
            let total_earnings = await this.total_earnings(req)

            let response = {
                total_products: total_products,
                out_of_stock: out_of_stock,
                alert_of_stock: alert_of_stock,
                total_orders: total_orders,
                total_reviews: total_reviews,
                total_ratings: total_ratings,
                total_earnings: total_earnings
            };
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static out_of_stock_count = async (req: any) => {
        try {

            let { _id: seller_id } = req.user_data;

            let query = {
                is_deleted: false,
                sold: true,
                added_by: seller_id
            };
            let count = await DAO.count_data(Models.Products, query);
            return count
        }
        catch (err) {
            throw err;
        }
    }

    static alert_of_stock_count = async (req: any) => {
        try {

            let { _id: seller_id } = req.user_data;

            let query = {
                is_deleted: false,
                quantity: { $lt: 5 },
                added_by: seller_id
            };
            let count = await DAO.count_data(Models.Products, query);
            return count
        }
        catch (err) {
            throw err;
        }
    }

    static total_orders = async (req: any) => {
        try {

            let { _id: seller_id } = req.user_data;

            let query = {

            };
            let count = await DAO.count_data(Models.Orders, query);
            return count
        }
        catch (err) {
            throw err;
        }
    }

    static total_reviews = async (req: any) => {
        try {

            let { _id: seller_id } = req.user_data;

            let query = { seller_id: seller_id }
            let count = await DAO.count_data(Models.Reviews, query);
            return count

        }
        catch (err) {
            throw err;
        }
    }

    static total_ratings = async (req: any) => {
        try {

            let { _id: seller_id } = req.user_data;

            let query = { seller_id: seller_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let reviews: any = await DAO.get_data(Models.Reviews, query, projection, options);

            let total_ratings = 0;
            if (reviews.length) {
                for (let i = 0; i < reviews.length; i++) {
                    total_ratings += reviews[i].ratings
                }
            }
            return total_ratings

        }
        catch (err) {
            throw err;
        }
    }

    static total_earnings = async (req: any) => {
        try {

            let { _id: seller_id } = req.user_data;
            let query = { seller_id: seller_id, order_status : "DELIVERED" }
            let projection = { __v: 0 }
            let options = { lean: true }
            let retrive_data: any = await DAO.get_data(Models.OrderProducts, query, projection, options);

            let total_price = 0;
            if (retrive_data.length) {
                for (let i = 0; i < retrive_data.length; i++) {
                    total_price += retrive_data[i].total_earnings;
                }
            }
            return total_price

        }
        catch (err) {
            throw err;
        }
    }

}



