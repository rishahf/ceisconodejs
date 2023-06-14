import * as DAO from "../../DAO";
import { Products, Orders, Coupons, Used_Coupons, Cards } from "../../models";
import { helpers, handle_custom_error } from "../../middlewares/index";
const shippo = require('shippo')(process.env.SHIPPO_TOKEN);
import Stripe from 'stripe';
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options: any = { apiVersion: '2020-08-27' }
const stripe = new Stripe(STRIPE_KEY, stripe_options);

class stripe_payments {

    static create_pi = async (req: any, total_price: number) => {
        try {

            let { card_id } = req.body;
            let { _id: user_id, name, email, customer_id } = req.user_data;
            let card_details: any = await this.retrive_card_details(card_id, user_id)
            if (card_details.length) {

                let { payment_method } = card_details[0]

                let amount = Number(total_price) * 100
                let fixed_amount = parseInt(amount.toFixed(2))
                // if (shipping_price == undefined) { shipping_price = 0 }

                // let twenty_percent: number = 0.2
                // let admin_fees = amount * twenty_percent
                // let fixed_fees = parseInt(admin_fees.toFixed(2)) + parseInt(shipping_price)

                // fetch connected account id
                // let connected_account: any = await fetch_connected_account(seller_id)
                // if (connected_account.length) {

                // let { account_id } = connected_account[0]
                // let { customer_id } = card_details[0]
                const payment_intent = await stripe.paymentIntents.create({
                    amount: fixed_amount,
                    currency: 'usd',
                    payment_method: payment_method,
                    customer: customer_id,
                    // application_fee_amount: fixed_fees,
                    // transfer_data: {
                    //     destination: account_id,
                    // },
                    description: `name ${name}, email ${email}`,
                    metadata: {
                        name: name,
                        email: email
                    }
                });

                // confirm_intent
                await stripe.paymentIntents.confirm(payment_intent.id,
                    { payment_method: payment_method }
                );
                return {
                    payment_intent: payment_intent.id
                }

                // } else {
                //     throw error.no_connected_account_found
                // }

            }
            else {
                throw await handle_custom_error("INAVLID_CARD_ID", "ENGLISH")
            }

        }
        catch (err) {
            throw err.raw.message
        }
    }

    static retrive_card_details = async (card_id: string, user_id: string) => {
        try {
            let query = { _id: card_id, user_id: user_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let response = await DAO.get_data(Cards, query, projection, options)
            return response
        }
        catch (err) {
            throw err;
        }
    }

}

export default class order_module extends stripe_payments {

    static create = async (req: any) => {
        try {

            let { products, address_id, card_id, coupon_code, payment_mode, delivery_price, shipment_id, transaction_id } = req.body;

            let { _id: user_id } = req.user_data;
            let set_delivery_price = delivery_price == undefined ? 0 : delivery_price

            let order_id = await helpers.genrate_order_id()
            let retrive_prices = await this.calculate_total_price(req)
            let { product_price, coupon_discount } = retrive_prices;
            let step_1 = Number(product_price) + Number(set_delivery_price)
            let total_price = Number(step_1) - coupon_discount

            let data_to_save: any = {
                // products: products,
                order_id: order_id,
                user_id: user_id,
                address_id: address_id,
                payment_mode: payment_mode,
                price: product_price,
                coupon_discount : coupon_discount,
                delivery_price : set_delivery_price,
                total_price: total_price,
                updated_at: +new Date(),
                created_at: +new Date(),
            }
            if (!!card_id) { data_to_save.card_id = card_id }
            if (!!coupon_code) { data_to_save.coupon_code = coupon_code }
            if (!!shipment_id) {
                let shipment_data = await shippo.shipment.retrieve(shipment_id);
                let { rates } = shipment_data;
                let { object_id, estimated_days, servicelevel: { token } } = rates[0];
                data_to_save.shippo_data = {
                    shipment_id: shipment_id,
                    rate_id: object_id,
                    service_level: token,
                    estimated_days: estimated_days
                }
            }
            if (!!transaction_id) {
                let transaction_data: any = await shippo.transaction.retrieve(transaction_id)
                let { parcel, tracking_number, label_url } = transaction_data;
                data_to_save.shippo_data = {
                    transaction_id: transaction_id,
                    parcel_id: parcel,
                    tracking_no: tracking_number,
                    label_url: label_url
                }
            }
            if (payment_mode == "BY_CARD") {
                let payment_intent = await this.create_pi(req, total_price)
                let { payment_intent : pi } = payment_intent;
                data_to_save.stripe_data.payment_intent = pi
            }

            let create_order = await DAO.save_data(Orders, data_to_save)
            
            return create_order

        }
        catch (err) {
            throw err;
        }
    }

    static calculate_total_price = async (req: any) => {
        try {

            let { products  } = req.body;
            let total_product_price = 0, total_coupon_discount = 0;
            if (products.length) {
                for (let i = 0; i < products.length; i++) {

                    let product_id = products[i].product_id;
                    let quantity = products[i].quantity;

                    let query = { _id: product_id }
                    let projection = { __v: 0 }
                    let options = { lean: true }
                    let retrive_products: any = await DAO.get_data(Products, query, projection, options)
                    
                    if (retrive_products.length) {
                       
                        let { discount_price, added_by } = retrive_products[0];
                        
                        let retrive_prices = await this.cal_product_price(req, discount_price, quantity)
                        let { product_price, coupon_discount } = retrive_prices;
                        total_product_price += product_price
                        total_coupon_discount += coupon_discount
                        
                        // total_price += price
                        // product_price += discount_price
                    }
                }
            }
            return {
                product_price : total_product_price,
                coupon_discount : total_coupon_discount
            }

        }
        catch (err) {
            throw err;
        }
    }

    // static save_order_products = async (product_data : any, ) => {
    //     try {

    //         let { coupon_code } = req.body;
    //         let { _id: user_id } = req.user_data;
    //         // let { discount_price } = product_data[0];

    //         let price = Number(quantity) * Number(discount_price);
    //         let fixed_price = Number(price.toFixed(2));
    //         if (!!coupon_code) {
    //             // price if coupon applied
    //             let coupon_discount = await this.calculate_coupon_discount(user_id, coupon_code, fixed_price)
    //             // let fixed_price = Number(calculated_price.toFixed(2));
    //             return {
    //                 product_price : fixed_price,
    //                 coupon_discount : coupon_discount
    //             }
    //         }
    //         else {
    //             // price if coupon is not applied
    //             // let fixed_price = Number(price.toFixed(2));
    //             // return fixed_price
    //             return {
    //                 product_price : fixed_price,
    //                 coupon_discount : 0
    //             }
    //         }

    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    static cal_product_price = async (req: any, discount_price: number, quantity: number) => {
        try {

            let { coupon_code } = req.body;
            let { _id: user_id } = req.user_data;
            // let { discount_price } = product_data[0];

            let price = Number(quantity) * Number(discount_price);
            let fixed_price = Number(price.toFixed(2));
            if (!!coupon_code) {
                // price if coupon applied
                let coupon_discount = await this.calculate_coupon_discount(user_id, coupon_code, fixed_price)
                // let fixed_price = Number(calculated_price.toFixed(2));
                return {
                    product_price : fixed_price,
                    coupon_discount : coupon_discount
                }
            }
            else {
                // price if coupon is not applied
                // let fixed_price = Number(price.toFixed(2));
                // return fixed_price
                return {
                    product_price : fixed_price,
                    coupon_discount : 0
                }
            }

        }
        catch (err) {
            throw err;
        }
    }

    static calculate_coupon_discount = async (user_id: string, coupon_code: string, price: number) => {
        try {

            // check coupon is available or not
            let query = {
                code: coupon_code,
                is_available: true,
                is_deleted: false
            }
            let projection = { __v: 0 };
            let options = { lean: true };
            let response: any = await DAO.get_data(Coupons, query, projection, options);
            // check coupon already used or not
            if (response.length) {
                let { _id } = response[0]
                let query = { _id: _id, user_id: user_id }
                let used_coupons: any = await DAO.get_data(Used_Coupons, query, projection, options)
                if (used_coupons.length) {
                    throw await handle_custom_error("COUPON_ALREADY_USED", "ENGLISH")
                }
                else {
                    let { coupon_type, price: fixed_discount, max_discount } = used_coupons[0];
                    // let new_price = 0;
                    let coupon_discount = 0;
                    if (coupon_type == "FIXED") {
                        coupon_discount = fixed_discount;
                        // new_price = Number(price) - Number(fixed_discount);
                    }
                    else {
                        coupon_discount = Number(max_discount / 100) * Number(price);
                        // new_price = Number(price) - Number(coupon_discount);
                    }
                    // save coupon as it is used
                    let data_to_save = {
                        user_id: user_id,
                        coupon_id: _id,
                        created_at: +new Date()
                    }
                    await DAO.save_data(Used_Coupons, data_to_save);
                    return coupon_discount
                }
            }
            else {
                throw await handle_custom_error("COUPON_NOT_AVAILABLE", "ENGLISH")
            }

        }
        catch (err) {
            throw err;
        }
    }
}




    // static list = async (req: any) => {
    //     try {

    //         let { order_status, pagination, limit } = req.query;
    //         let { _id: user_id } = req.user_data;

    //         let query: any = { user_id: user_id }
    //         if (!!order_status) { query.order_status = order_status }

    //         let projection = { __v: 0 }
    //         let options = await helpers.set_options(pagination, limit)
    //         let orders: any = await DAO.get_data(Orders, query, projection, options)
    //         let total_count = await DAO.count_data(Orders, query)
    //         if (orders.length) {
    //             for (let i = 0; i < orders.length; i++) {
    //                 let { _id } = orders[i];
    //                 let query = { order_id: _id }
    //                 let projection = { __v: 0 }
    //                 let options = { lean: true, sort: { _id: -1 } }
    //                 let populate = [
    //                     {
    //                         path: 'product_id',
    //                         select: 'name description images'
    //                     }
    //                 ]
    //                 let products = await DAO.populate_data(OrderProducts, query, projection, options, populate)
    //                 orders[i].products = products;
    //             }
    //             return {
    //                 total_count: total_count,
    //                 data: orders
    //             }
    //         }
    //         else {
    //             return []
    //         }
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }

    // static details = async (req: any) => {
    //     try {

    //         let { _id: order_id } = req.params, { _id } = req.user_data;

    //         let query: any = { _id: order_id, user_id: _id }
    //         let projection = { __v: 0 }
    //         let options = { lean: true }
    //         let populate = [
    //             {
    //                 path: 'address_id',
    //                 select: '-__v'
    //             }
    //         ]
    //         let orders: any = await DAO.populate_data(Orders, query, projection, options, populate)
    //         if (orders.length) {
    //             let { _id } = orders[0];
    //             let query = { order_id: _id }
    //             let projection = { __v: 0 }
    //             let options = { lean: true, sort: { _id: -1 } }
    //             let populate = [
    //                 {
    //                     path: 'product_id',
    //                     select: 'name description images'
    //                 }
    //             ]
    //             let products = await DAO.populate_data(OrderProducts, query, projection, options, populate)
    //             orders[0].products = products;
    //             return orders[0]
    //         }
    //     }
    //     catch (err) {
    //         throw err;
    //     }
    // }