import * as DAO from "../../DAO";
import * as Models from "../../models";
import { handle_custom_error, helpers } from "../../middlewares/index";
import * as list_orders from './list_orders';
import * as order_details from './order_details';
import Stripe from 'stripe';
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options: any = { apiVersion: '2020-08-27' }
const stripe = new Stripe(STRIPE_KEY, stripe_options);

export class order_module {

    static list = async (req: any) => {
        try {
        
            let query = [
              await list_orders.lookup_sellers(),
              await list_orders.unwind_sellers(),
              await list_orders.lookup_users(),
              await list_orders.unwind_users(),
              await list_orders.lookup_products(),
              await list_orders.unwind_products(),
              await list_orders.lookup_order(),
              await list_orders.unwind_orders(),
              await list_orders.group_data(),
              await list_orders.filter_data(req.query),
              //   await list_orders.filter_sorting(req.query),
              await list_orders.sortOrder_data(req.query),
              await list_orders.skip_data(req.query),
              await list_orders.limit_data(req.query),
            ];
            let options = { lean : true }
            let orders = await DAO.aggregate_data(Models.OrderProducts, query, options)

            let query_count = [
                await list_orders.lookup_sellers(),
                await list_orders.unwind_sellers(),
                await list_orders.lookup_users(),
                await list_orders.unwind_users(),
                await list_orders.lookup_products(),
                await list_orders.unwind_products(),
                await list_orders.lookup_order(),
                await list_orders.unwind_orders(),
                await list_orders.group_data(),
                await list_orders.filter_data(req.query)
            ]
            let orders_count : any = await DAO.aggregate_data(Models.OrderProducts, query_count, options)
            let response = {
                total_count : orders_count.length,
                data : orders
            }
            return response

        }
        catch (err) {
            throw err;
        }
    }


    static details = async(req: any) => {
        try {

            let { _id } = req.params;
            let query = [
              await order_details.match(_id),
              await order_details.lookup_order(),
              await order_details.unwind_orders(),
              await order_details.lookup_sellers(),
              await order_details.unwind_sellers(),
              await order_details.lookup_users(),
              await order_details.unwind_users(),
              // await order_details.lookup_address(),
              // await order_details.unwind_address(),
              await order_details.lookup_products(),
              await order_details.unwind_products(),
              await order_details.lookup_order_reviews(),
              await order_details.group_data(),
              await order_details.sort_data(),
              await order_details.skip_data(req.query),
              await order_details.limit_data(req.query),
            ];
            let options = { lean : true }
            let response : any = await DAO.aggregate_data(Models.OrderProducts, query, options)
            console.log('response ', response);
            
            if(response && response.length) {
                console.log('response[0].order_object_id',response[0].order_object_id);
                let { order_object_id } = response[0];
                let query_other = [
                  await order_details.match_order_id(order_object_id, _id),
                  await order_details.lookup_order(),
                  await order_details.unwind_orders(),
                  await order_details.lookup_product_order_item(),
                  await order_details.unwind_products(),
                  await order_details.lookup_users(),
                  await order_details.unwind_users(),
                  await order_details.lookup_sellers(),
                  await order_details.unwind_sellers(),
                  await order_details.group_order_items(),
                ];
                let other_order_items = await DAO.aggregate_data(Models.OrderProducts, query_other, options)
                response[0].other_order_items = other_order_items
                return response[0]
            }
            else {
                await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
            }


        }
        catch(err) {
            throw err;
        }
    }

    static user_orders = async (req: any) => {
        try {
            
            let { _id : user_id } = req.query;
            let query = [
                await list_orders.match(user_id),
                await list_orders.lookup_sellers(),
                await list_orders.unwind_sellers(),
                await list_orders.lookup_users(),
                await list_orders.unwind_users(),
                await list_orders.lookup_products(),
                await list_orders.unwind_products(),
                await list_orders.lookup_order(),
                await list_orders.unwind_orders(),
                await list_orders.group_data(),
                await list_orders.filter_data(req.query),
                await list_orders.sort_data(),
                await list_orders.skip_data(req.query),
                await list_orders.limit_data(req.query)
            ]
            let options = { lean : true }
            let orders = await DAO.aggregate_data(Models.OrderProducts, query, options)

            let query_count = [
                await list_orders.match(user_id),
                await list_orders.lookup_sellers(),
                await list_orders.unwind_sellers(),
                await list_orders.lookup_users(),
                await list_orders.unwind_users(),
                await list_orders.lookup_products(),
                await list_orders.unwind_products(),
                await list_orders.lookup_order(),
                await list_orders.unwind_orders(),
                await list_orders.group_data(),
                await list_orders.filter_data(req.query),
            ]
            let orders_count : any = await DAO.aggregate_data(Models.OrderProducts, query_count, options)
            let response = {
                total_count : orders_count.length,
                data : orders
            }
            return response

        }
        catch (err) {
            throw err;
        }
    }

    static list_orderReviews = async (req: any) => {
        try {
        
            let query = [
            //   await list_orders.lookup_order_review(),
            //   await list_orders.unwind_order_review(),
            //   await list_orders.lookup_order_product_review(),
            //   await list_orders.unwind_order_products(),
              await list_orders.lookup_sellers(),
              await list_orders.unwind_sellers(),
              await list_orders.lookup_users(),
              await list_orders.unwind_users(),
              await list_orders.lookup_products_review(),
              await list_orders.unwind_products(),
              await list_orders.group_orderReview_data(),
              await list_orders.filter_reviews_data(req.query),
              await list_orders.sorting_data(req.query),
              await list_orders.skip_data(req.query),
              await list_orders.limit_data(req.query),
            ];
            let options = { lean : true }
            let orders = await DAO.aggregate_data(Models.Reviews, query, options)

            let query_count = [
            //   await list_orders.lookup_order_review(),
            //   await list_orders.unwind_order_review(),
            //   await list_orders.lookup_order_product_review(),
            //   await list_orders.unwind_order_products(),
              await list_orders.lookup_sellers(),
              await list_orders.unwind_sellers(),
              await list_orders.lookup_users(),
              await list_orders.unwind_users(),
              await list_orders.lookup_products_review(),
              await list_orders.unwind_products(),
              await list_orders.group_orderReview_data(),
              await list_orders.filter_reviews_data(req.query),
            //   await list_orders.sort_data(),
            ];
            let orders_count : any = await DAO.aggregate_data(Models.Reviews, query_count, options)
            let response = {
                total_count : orders_count.length,
                data : orders
            }
            return response

        }
        catch (err) {
            throw err;
        }
    }

     static invoiceData = async (req: any) => {
        try {
        let { _id, order_id, invoice_type } = req.query;
        
        let options = { lean: true };
        let query:any;
        let response: any; 
        if(invoice_type == "SELLER"){
              query = [
                await order_details.match(_id),
                await order_details.lookup_order(),
                await order_details.unwind_orders(),
                await order_details.lookup_sellers(),
                await order_details.unwind_sellers(),
                await order_details.lookup_users(),
                await order_details.unwind_users(),
                // await order_details.lookup_address(),
                // await order_details.unwind_address(),
                await order_details.lookup_product_invoice(),
                await order_details.unwind_products(),
                await order_details.lookup_order_invoice(_id),
                await order_details.unwind_invoice(),
                await order_details.group_invoice_data(),
                await order_details.sort_data(),
                await order_details.skip_data(req.query),
                await order_details.limit_data(req.query),
              ];
            
              response = await DAO.aggregate_data(Models.OrderProducts,query,options);
              response[0].type = "SELLER"
        }
        else if(invoice_type == "USER"){
              query = [
                await order_details.match(order_id),
                await order_details.lookup_order_address(),
                await order_details.unwind_address(),
                await order_details.lookup_ordered_invoice(order_id),
              ];
            response = await DAO.aggregate_data(Models.Orders, query, options);
            response[0].type = "USER";
        }
        if (response.length) {
          return response[0];
        } else {
          await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH");
        }
        }
        catch (err) {
            throw err;
        }
    }

      static order_products_details = async (req: any) => {
        try {
            let { _id:order_id } = req.params, { _id :admin_id} = req.user_data;
            let query = [
              await order_details.match_data(order_id, admin_id),
              await order_details.lookup_ordered_products(),
              // await order_details.lookup_products(),
              // await order_details.unwind_products(),
              // await order_details.lookup_address(),
              // await order_details.unwind_address(),

              await order_details.group_data1(),
              await order_details.sort_data(),
            ];
            let options = { lean: true }
            let orders: any = await DAO.aggregate_data(Models.Orders, query, options)
            if (orders.length) {
                return orders[0]
            }
            else {
                throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
            }
        }
        catch (err) {
            throw err;
        }
    }

}

export class cancel_order_module {

    static cancel = async (req: any) => {
        try {

            let { _id: order_id } = req.body;
            let { _id: user_id } = req.user_data;

            let query = { _id: order_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let retrive_data: any = await DAO.get_data(Models.Orders, query, projection, options)
            if (retrive_data.length) {

                let { _id, stripe_data: { payment_intent, refund_id } } = retrive_data[0]
                if (!!refund_id) {
                    throw await handle_custom_error("ORDER_ALREADY_CANCELLED", "ENGLISH")
                }
                else {
                    let retrive_refund_id = await this.create_refund(payment_intent)
                    let query = { _id: _id }
                    let data_to_update = {
                        cancellation_reason: "ORDER_CANCELLED_BY_SELLER",
                        "stripe_data.refund_id": retrive_refund_id,
                        updated_at: +new Date()
                    }
                    let options = { new: true }
                    await DAO.find_and_update(Models.Orders, query, data_to_update, options)
                    await this.update_order_products(_id)
                    return {
                        message: "Order Cancelled Sucessfully"
                    }
                }
            }
            else {
                throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
            }
        }
        catch (err) {
            throw err;
        }
    }

    static create_refund = async (payment_intent: string) => {
        try {
            let refund = await stripe.refunds.create({
                payment_intent: payment_intent,
            });
            return refund.id
        }
        catch (err) {
            throw err;
        }
    }

    static update_order_products = async (order_id: string) => {
        try {

            let query = { order_id: order_id }
            let projection = { __v: 0 }
            let options = { lean: true }
            let retrive_data: any = await DAO.get_data(Models.OrderProducts, query, projection, options)
            if (retrive_data.length) {
                for (let i = 0; i < retrive_data.length; i++) {
                    let { _id, product_id, quantity } = retrive_data[i]
                    let query = { _id: _id }
                    let data_to_update = {
                        order_status: "CANCELLED",
                        // delivery_status : "CANCELLED",
                        updated_at: +new Date()
                    }
                    let options = { new: true }
                    await DAO.find_and_update(Models.OrderProducts, query, data_to_update, options)
                    await this.inc_product_quantity(product_id, quantity)
                }
            }

        }
        catch (err) {
            throw err;
        }
    }

    static inc_product_quantity = async (product_id: string, quantity: number) => {
        try {
            // console.log("product_id...", product_id)
            let query = { _id: product_id }
            let update = {
                $inc: {
                    quantity: Number(quantity)
                },
                updated_at: +new Date()
            }
            let options = { new: true }
            await DAO.find_and_update(Models.Products, query, update, options)
        }
        catch (err) {
            throw err;
        }
    }


}


