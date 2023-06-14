import * as DAO from "../../DAO";
import * as Models from "../../models";
import { handle_custom_error, helpers } from "../../middlewares/index";
import * as list_orders from "./list_orders";
import * as order_details from "./order_details";
import * as mongoose from 'mongoose'
import moment from "moment";
import Stripe from "stripe";
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options: any = { apiVersion: "2020-08-27" };
const stripe = new Stripe(STRIPE_KEY, stripe_options);
import { send_notification_to_all } from "../../middlewares/index";
import { common_module } from "../../middlewares/common";
import * as email_services from "./email_seller"

export class order_module {
  static list = async (req: any) => {
    try {
      let { _id: seller_id } = req.user_data;
      let query = [
        await list_orders.match(seller_id),
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
        await list_orders.sort_order_data(),
        await list_orders.skip_data(req.query),
        await list_orders.limit_data(req.query),
      ];
      let options = { lean: true };
      let orders = await DAO.aggregate_data(Models.OrderProducts,query,options);

      let query_count = [
        await list_orders.match(seller_id),
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
      ];
      let orders_count: any = await DAO.aggregate_data(
        Models.OrderProducts,
        query_count,
        options
      );
      let response = {
        total_count: orders_count.length,
        data: orders,
      };
      return response;
    } catch (err) {
      throw err;
    }
  };

  static details = async (req: any) => {
    try {
      let { _id } = req.params,
        { _id: seller_id } = req.user_data;

      let query = [
        await order_details.match(_id, seller_id),
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
        await order_details.lookup_order_invoice(_id),
        // await order_details.lookup_reviews(),
        await order_details.unwind_invoice(),
        await order_details.group_data(),
        await order_details.sort_data(),
        await order_details.skip_data(req.query),
        await order_details.limit_data(req.query),
      ];
      let options = { lean: true };
      let response: any = await DAO.aggregate_data(Models.OrderProducts,query,options);
      if (response.length) {
        return response[0];
      } else {
        await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH");
      }
    } catch (err) {
      throw err;
    }
  };

  static order_status = async(req:any) => {
    try {
      let { _id, order_status, tracking_link } = req.body;
      let options: any = { lean: true };
      let projection:any = { __v:0 }
      let update: any;

      let query:any = { _id:_id, order_status:{ $in:["PLACED","SHIPPED"] }}
      let get_orders:any = await DAO.get_data(Models.OrderProducts,query,projection,options)
      if(get_orders){
        let { product_id,seller_id, user_id } = get_orders[0];
    
        let retrive_product: any = await DAO.get_data(Models.Products, {_id:product_id}, projection, {lean: true})
        let { images } = retrive_product[0];
      
        let notification_to_seller: any, notification_to_customer: any;
        if(!!order_status){
          update = { order_status: order_status };
          //DELIVERED
          if(order_status == "DELIVERED"){ 
            update.delivery_date = +new Date(); 
  
            notification_to_seller = {
              type: "ORDER_DELIVERED",
              title: "Order Delivered",
              message: "Order delivery sucess",
              seller_id: seller_id,
              orderProduct_id: _id,
              product_id: product_id,
              created_at: +new Date(),
            };
            notification_to_customer = {
              type: "DELIVERED",
              title: "Order Delivered",
              message: "Your order has been delivered",
              user_id: user_id,
              orderProduct_id: _id,
              images: images,
              product_id: product_id,
              created_at: +new Date(),
            };
            
          }
          else if(order_status == "SHIPPED"){ 
            update.shipped_at = +new Date() 

            notification_to_seller = {
              type: "ORDER_SHIPPED",
              title: "Order SHIPPED",
              message: "Order shipped sucess",
              seller_id: seller_id,
              orderProduct_id: _id,
              product_id: product_id,
              created_at: +new Date(),
            };
            notification_to_customer = {
              type: "SHIPPED",
              title: "Order SHIPPED",
              message: "Your order has been shipped successfully",
              user_id: user_id,
              orderProduct_id: _id,
              images: images,
              product_id: product_id,
              created_at: +new Date(),
            };

          }
        }
  
        if(!!tracking_link){
           update.tracking_link = tracking_link ;
        }
        update.updated_at = +new Date(),
        await DAO.find_and_update(Models.OrderProducts,query,update,{new:true})
        let response:any = await DAO.get_data(Models.OrderProducts,{_id:_id}, projection, options)
        let { order_id:orderId } = response[0];
        let order:any = await DAO.get_data(Models.Orders,{_id:orderId},projection,options)
        let { order_id, coupon_code } = order[0];
        response[0].orders_id = order_id
        response[0].coupon_code = coupon_code;
        // console.log('response -- ', response)

          //notification to seller
          let seller_fcm_ids:any = await common_module.seller_fcms(seller_id)
          if (seller_fcm_ids && seller_fcm_ids.length) {
            await DAO.save_data(Models.Notifications, notification_to_seller);
            await send_notification_to_all(notification_to_seller,seller_fcm_ids);
          }
          //notification to customer
          let customer_fcm_ids:any = await common_module.customer_fcms(user_id)
          if (customer_fcm_ids && customer_fcm_ids.length) {
            await DAO.save_data(Models.Notifications, notification_to_customer);
            await send_notification_to_all(notification_to_customer,customer_fcm_ids);
          }

          let notification_admin: any = {
             type: "ORDER_CANCELLED_BY_SELLER",
             title: "Order Delivered",
             message: "Order has been delivered",
             //   user_id: user_id,
             order_id: _id,
             created_at: +new Date(),
           };
           await common_module.send_notification_to_admin(notification_admin);

           //email to seller 
        let seller_detail = await DAO.get_data(Models.Sellers,{_id:seller_id},projection,options)
        //email to user
        let user_detail = await DAO.get_data(Models.Users,{_id:user_id},projection,options)
        
        if(order_status == 'SHIPPED'){
          await email_services.send_shipped_mail(user_detail[0], response,retrive_product,seller_detail[0]);
        }else if(order_status == 'DELIVERED'){
          await email_services.send_delivery_mail(user_detail[0], response,retrive_product,seller_detail[0]);
        }

        return response
        
      }else{
        throw "You cann't change the status of this order";
      }

    } catch (err) {
      throw err;
    }
  }

  static invoice_details = async (req: any) => {
    try {
      let { _id } = req.params,
        { _id: seller_id } = req.user_data;

      let query = [
        await order_details.match(_id, seller_id),
        await order_details.lookup_order(),
        await order_details.unwind_orders(),
        await order_details.lookup_sellers(),
        await order_details.unwind_sellers(),
        await order_details.lookup_users(),
        await order_details.unwind_users(),
        await order_details.lookup_address(),
        await order_details.unwind_address(),
        await order_details.lookup_product_invoice(),
        await order_details.unwind_products(),
        await order_details.lookup_order_invoice(_id),
        await order_details.unwind_invoice(),
        await order_details.group_invoice_data(),
        await order_details.sort_data(),
        await order_details.skip_data(req.query),
        await order_details.limit_data(req.query),
      ];
      let options = { lean: true };
      let response: any = await DAO.aggregate_data(Models.OrderProducts,query,options);
      if (response.length) {
        return response[0];
      } else {
        await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH");
      }
    } catch (err) {
      throw err;
    }
  };

  static list_transactions = async (req: any) => {
    try {
      let { _id: seller_id } = req.user_data;
      let query = [
        await list_orders.match_transactions(seller_id),
        await list_orders.lookup_sellers(),
        await list_orders.unwind_sellers(),
        await list_orders.lookup_users(),
        await list_orders.unwind_users(),
        await list_orders.lookup_products(),
        await list_orders.unwind_products(),
        await list_orders.lookup_order(),
        await list_orders.unwind_orders(),
        await list_orders.lookup_card(),
        await list_orders.unwind_card(),
        await list_orders.group_transactions_data(),
        await list_orders.filter_transaction_data(req.query),
        await list_orders.sort_data(),
        await list_orders.skip_data(req.query),
        await list_orders.limit_data(req.query),
      ];
      let options = { lean: true };
      let orders = await DAO.aggregate_data(Models.OrderProducts,query,options);

      let query_count = [
        await list_orders.match_transactions(seller_id),
        await list_orders.lookup_sellers(),
        await list_orders.unwind_sellers(),
        await list_orders.lookup_users(),
        await list_orders.unwind_users(),
        await list_orders.lookup_products(),
        await list_orders.unwind_products(),
        await list_orders.lookup_order(),
        await list_orders.unwind_orders(),
        await list_orders.group_transactions_data(),
        await list_orders.filter_transaction_data(req.query),
      ];
      let orders_count: any = await DAO.aggregate_data(Models.OrderProducts,query_count,options);
      let response = {
        total_count: orders_count.length,
        data: orders,
      };
      return response;
    } catch (err) {
      throw err;
    }
  };

  static list_order_reviews = async (req: any) => {
    try {
      let { _id: seller_id } = req.user_data;
      let query = [
        await list_orders.match(seller_id),
        // await list_orders.lookup_order(),
        // await list_orders.unwind_orders(),
        // await list_orders.lookup_order_product(),
        // await list_orders.unwind_ordered_product(),
        await list_orders.lookup_users(),
        await list_orders.unwind_users(),
        await list_orders.lookup_sellers(),
        await list_orders.unwind_sellers(),
        await list_orders.lookup_review_products(seller_id),
        await list_orders.unwind_products(),
        // await list_orders.lookup_ordered_products(seller_id),
        // await list_orders.unwind_ordered_products(),
        // await list_orders.lookup_order(),
        // await list_orders.unwind_orders(),
        await list_orders.group_orders_review_data(),
        await list_orders.filter_review_order_data(req.query),
        await list_orders.sort_order_data(),
        // await list_orders.skip_data(req.query),
        // await list_orders.limit_data(req.query),
      ];
      let options = { lean: true };
      let orders = await DAO.aggregate_data(Models.Reviews,query,options);

      let query_count = [
        await list_orders.match(seller_id),
        await list_orders.lookup_users(),
        await list_orders.unwind_users(),
        await list_orders.lookup_review_products(seller_id),
        await list_orders.unwind_review_products(),
        await list_orders.lookup_order(),
        await list_orders.unwind_orders(),
        await list_orders.group_orders_review_data(),
        await list_orders.filter_review_order_data(req.query),
      ];
      let orders_count: any = await DAO.aggregate_data(Models.Reviews,query_count,options);
      let response = {
        total_count: orders_count.length,
        data: orders,
      };
      return response;
    } catch (err) {
      throw err;
    }
  };

  static listNotifications = async (req:any) =>{
    try{
      let { pagination, limit } = req.query;
      let { _id: seller_id } = req.user_data;
      let query = { seller_id: seller_id, clear_for_seller:false, read_by_seller:false }
      let options = await helpers.set_options(pagination,limit)
      // let projection = {  __v: 0 }
      let projection = { seller_id:1, clear_for_seller:1, read_by_seller:1, type:1,title:1, message:1,order_id:1, orderProduct_id:1, created_at:1 };
      let unread_notifications:any = await DAO.get_data(Models.Notifications,query,projection,options)

      let query2 = { seller_id: seller_id, clear_for_seller:false, read_by_seller:true }
      let read_notifications = await DAO.get_data(Models.Notifications,query2,projection,options)
      
      //count of new unread
      let query_unread:any = { seller_id : seller_id, read_by_seller:false ,clear_for_seller:false}
      let unread_count:any = await DAO.count_data(Models.Notifications,query_unread)

      //updating view new to previous
      // await DAO.update_many(Models.Notifications,query,{ previous_seller:true })
      
      return {
          unread_count:unread_count,
          read_notifications:read_notifications,
          unread_notifications:unread_notifications   
      }
    }catch(err){
      throw err;
    }
  }

  static markReadNotifications = async (req:any) =>{
    try{
      let { language } = req.query;
      let { _id: seller_id } = req.user_data;
      let qury = { seller_id: seller_id, read_by_seller:false }
      let options = {lean:true}
      let projection = {  __v: 0 }
      let update: any = {
        read_by_seller: true,
      };
      let resp:any = await DAO.get_data(Models.Notifications,qury,projection,options)
      if(resp && resp.length){
        for(let i=0; i<resp.length;i++){
          let query1 = { _id: resp[i]._id };
          await DAO.find_and_update(Models.Notifications,query1, update,options)
        }
      }
      // let response:any = await DAO.get_data(Models.Notifications,qury,projection,options)
      // if(response && response.length){
      //   return response
      // }
      let data = { message : 'All notifications read'}
      return data
    }catch(err){
      throw err;
    }
  }

  static clearNotifications = async (req:any) =>{
    try{
      let { language } = req.query;
      let { _id: seller_id } = req.user_data;
      let qury = { seller_id: seller_id, clear_for_seller:false }
      let options = {lean:true}
      let projection = {  __v: 0 }
      let update:any = {
        clear_for_seller:true
      }
      let resp:any = await DAO.get_data(Models.Notifications,qury,projection,options)
      if(resp && resp.length){
        for(let i=0; i<resp.length;i++){
          let query1 = { _id:resp[i]._id }
          await DAO.find_and_update(Models.Notifications,query1, update,options)
        }
      }
      let response:any = await DAO.get_data(Models.Notifications,qury,projection,options)
      // if(response && response.length){
      //   return response
      // }
       let data = { message: "All notifications cleared" };
       return data;
    }catch(err){
      throw err;
    }
  }

  static ReadNotification = async (req:any) =>{
    try{
      console.log('read ---- notification --- ',req.params)
      let { _id,language } = req.params;
      let { _id: seller_id } = req.user_data;
      let query = { _id: _id, seller_id: seller_id };
      console.log('query --- ', query)
      let options = { new:true }
      let projection = {  __v: 0 }
      let update:any = {
        read_by_seller:true
      }
      let response:any = await DAO.find_and_update(Models.Notifications,query, update,options)
      // let response:any = await DAO.get_data(Models.Notifications,query,projection,options)
      let data = { message: "Notification Read" };
      return data;
    }catch(err){
      throw err;
    }
  }

  //sending shipping mails to seller to mark order status
  static ordersDelivery = async () =>{
    try{
      let options = { lean:true }
      let projection = { __v: 0 };
      let current_date:any = +new Date();

      let query = { order_status: 'PLACED', };
      let get_data:any = await DAO.get_data(Models.OrderProducts,query,projection,options)
      if(get_data && get_data.length){
        for(let i=0; i<get_data.length; i++){
          let { _id,order_id, created_at, seller_id, product_order_id } = get_data[i];
          let dateAfterTwoDays: any = moment(parseInt(created_at)).add(2, "day").format('x');
          
          if (current_date >= dateAfterTwoDays) {
            //current date is greater or eq to order created date of order
            //send mail to seller to view and marked the order to shipped
            let seller_detail:any = await DAO.get_data(Models.Sellers,{ _id:seller_id }, projection,options);
            let order_product_detail:any = await DAO.get_data(Models.OrderProducts,{ _id:_id },projection,options)
            let order_detail:any = await DAO.get_data(Models.Orders,{ _id: order_id },projection,options)
            console.log('inside -- sending mail')
            email_services.send_pending_shipped_mail(seller_detail[0],order_detail[0]);
          }
        }
      }

      let data = { message: "Order Shipped Mail Sent to Seller" };
      return data;
    }catch(err){
      throw err;
    }
  } 
}

export class cancel_order_module {

   static cancel = async (req: any) => {
    try {
      let { _id:orderPId, order_id, cancellation_reason, description } = req.body;
      let { _id: user_id } = req.user_data;
      let cancel_reason:any = cancellation_reason == undefined ? "ORDER_CANCELLED_BY_SELLER":cancellation_reason

      let query = { _id: order_id };
      let projection = { __v: 0 };
      let options = { lean: true };
      let retrive_data: any = await DAO.get_data(Models.Orders,query,projection,options);
      let retrive_OrderProduct: any = await DAO.get_data(Models.OrderProducts,{_id:orderPId},projection,options);
      if (retrive_data.length) {
        console.log("STRIPE 1---------- ", retrive_data[0]);
        let { _id,order_id, stripe_data: { payment_intent },coupon_code } = retrive_data[0];
        // console.log('STRIPE 1---------- ', retrive_data[0].stripe_data)
        // console.log("STRIPE 2---------- ", payment_intent);
        let { total_price, product_id, quantity, refund_id, seller_id ,user_id} =
          retrive_OrderProduct[0];
        let retrive_product: any = await DAO.get_data(Models.Products, {_id:product_id}, projection, {lean: true})
        let { images } = retrive_product[0];
        console.log("images cancelled 1 ----------------- ", retrive_product[0]);
        console.log("images cancelled 2 ----------------- ", images);
        if (!!refund_id) {
          throw await handle_custom_error("ORDER_ALREADY_CANCELLED", "ENGLISH");
        } else {
          let retrive_refund_id = await this.create_refund(payment_intent,total_price);
          console.log('refund  ------ done ------ ')
          let query1 = { _id: orderPId };
          let data_to_update = {
            cancelled_by: "BY_SELLER",
            description: description,
            order_status: "CANCELLED",
            cancellation_reason: cancel_reason,
            payment_status: "REFUNDED",
            // "stripe_data.refund_id": retrive_refund_id,
            refund_id: retrive_refund_id,
            updated_at: +new Date(),
          };
          let options = { new: true };
          await DAO.find_and_update(Models.OrderProducts,query1,data_to_update,{new:true});
          let orderP_detail:any = await DAO.get_data(Models.OrderProducts,query1,projection,options);
          console.log("ORder Product_detail ----- ", orderP_detail);
          console.log("ORder-- order_id--coupon_code ----- ", order_id, coupon_code);
          // console.log("ORder Product_detail ----- ",  orderP_detail[0].order_id = order_id);
          orderP_detail[0].orders_id = order_id;
          if(coupon_code != null){
            orderP_detail[0].coupon_code = coupon_code;
          }else{
            orderP_detail[0].coupon_code = null;
          }
          // await this.update_order_products(_id);
          await this.inc_product_quantity(product_id, quantity);

          //notification to seller
          let seller_fcm_ids: any = await common_module.seller_fcms(seller_id);
          if (seller_fcm_ids && seller_fcm_ids.length) {
            let notification_to_seller: any = {
              type: "ORDER_CANCELLED",
              title: "Order Cancelled",
              message: "Order cancelled by you",
              seller_id: seller_id,
              orderProduct_id: _id,
              product_id: product_id,
              created_at: +new Date(),
            };
            await DAO.save_data(Models.Notifications, notification_to_seller);
            await send_notification_to_all(notification_to_seller,seller_fcm_ids);
          }
          //notification to customer
          let customer_fcm_ids:any = await common_module.customer_fcms(user_id)
          if (customer_fcm_ids && customer_fcm_ids.length) {
            let notification_to_customer: any = {
              type: "CANCELLED_ORDER",
              title: "Order Cancel",
              message: "Your order has been cancelled",
              user_id: user_id,
              orderProduct_id: _id,
              product_id: product_id,
              images: images,
              created_at: +new Date(),
            };
            await DAO.save_data(Models.Notifications, notification_to_customer);
            await send_notification_to_all(notification_to_customer,customer_fcm_ids);
          }

          //notification to admin
          let notification_admin: any = {
            type: "ORDER_CANCELLED_BY_SELLER",
            title: "Order Cancel",
            message: "Order has been cancelled by Seller",
            order_id: _id,
            product_id: product_id,
            created_at: +new Date(),
          };
          await common_module.send_notification_to_admin(notification_admin);

          //email 
          let seller_detail = await DAO.get_data(Models.Sellers,{_id:seller_id},projection,options)
          let user_detail = await DAO.get_data(Models.Users,{_id:user_id},projection,options)
          await email_services.send_cancel_mail(user_detail[0],orderP_detail,retrive_product,seller_detail[0])
          await email_services.send_refund_mail(user_detail[0],orderP_detail,retrive_product,seller_detail[0])

          return {
            message: "Order Cancelled Sucessfully",
          };
        }
      } else {
        throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH");
      }
    } catch (err) {
      throw err;
    }
  };

  static cancel1 = async (req: any) => {
    try {
      let { _id: order_id, cancellation_reason, description } = req.body;
      let { _id: user_id } = req.user_data;
      let cancel_reason:any = cancellation_reason == undefined ? "ORDER_CANCELLED_BY_SELLER":cancellation_reason

      let query = { _id: order_id };
      let projection = { __v: 0 };
      let options = { lean: true };
      let retrive_data: any = await DAO.get_data(Models.Orders,query,projection,options);
      if (retrive_data.length) {
        let { _id, stripe_data: { payment_intent, refund_id },} = retrive_data[0];
        if (!!refund_id) {
          throw await handle_custom_error("ORDER_ALREADY_CANCELLED", "ENGLISH");
        } else {
          let total = 500
          // let retrive_refund_id = await this.create_refund(payment_intent);
          let retrive_refund_id = await this.create_refund(payment_intent,total);
          let query = { _id: _id };
          let data_to_update = {
            cancelled_by: "BY_SELLER",
            description: description,
            cancellation_reason: cancel_reason,
            "stripe_data.refund_id": retrive_refund_id,
            updated_at: +new Date(),
          };
          let options = { new: true };
          await DAO.find_and_update(
            Models.Orders,
            query,
            data_to_update,
            options
          );
          await this.update_order_products(_id);
          return {
            message: "Order Cancelled Sucessfully",
          };
        }
      } else {
        throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH");
      }
    } catch (err) {
      throw err;
    }
  };

 static approve_cancellation_request = async (req: any) => {
    try {
      let { _id } = req.body;
      let { _id: user_id } = req.user_data;

      let query = { _id: _id };
      console.log("query ", query);

      let projection = { __v: 0 };
      let options = { lean: true };
      let retrive_data: any = await DAO.get_data(Models.OrderProducts,query,projection,options);
      if (retrive_data.length) {
        
        let {_id,order_id, total_price,product_id, quantity,refund_id, user_id, seller_id} = retrive_data[0];
        let retrive_order: any = await DAO.get_data(Models.Orders,{_id:order_id},projection,options);

        let retrive_product: any = await DAO.get_data(Models.Products, {_id:product_id}, projection, {lean: true})
        let { images } = retrive_product[0];
         console.log("images cancelled 1 ----------------- ", retrive_product[0]);
        console.log("images cancelled 2 ----------------- ", images);

        let { order_id:orderIdString, coupon_code, stripe_data: { payment_intent },} = retrive_order[0];

        if (!!refund_id) {
          throw await handle_custom_error("ORDER_ALREADY_CANCELLED", "ENGLISH");
        } else {
          let retrive_refund_id = await this.create_refund(payment_intent,total_price);
          let query = { _id: _id };
          let data_to_update = {
            payment_status: "REFUND_IN_PROGRESS",
            cancel_request_accepted: true,
            order_status: "CANCELLED",
            refund_id: retrive_refund_id,
            updated_at: +new Date(),
          };
          let options = { new: true };
          await DAO.find_and_update(Models.OrderProducts,query,data_to_update,{new:true});
          let response:any = await DAO.get_data(Models.OrderProducts,query,data_to_update,options);
          response[0].orders_id = orderIdString;
          response[0].coupon_code = coupon_code;
          // await this.update_order_products(_id);
          await this.inc_product_quantity(product_id, quantity);

          //notification to seller
          let seller_fcm_ids: any = await common_module.seller_fcms(seller_id);
          if (seller_fcm_ids && seller_fcm_ids.length) {
            let notification_to_seller: any = {
              type: "CANCELLED",
              title: "Order Cancelled",
              message: "Order cancelled request approved by you",
              seller_id: seller_id,
              orderProduct_id: _id,
              product_id:product_id,
              created_at: +new Date(),
            };
            await DAO.save_data(Models.Notifications, notification_to_seller);
            await send_notification_to_all(
              notification_to_seller,
              seller_fcm_ids
            );
          }
          //notification to customer
          let customer_fcm_ids: any = await common_module.customer_fcms(
            user_id
          );
          if (customer_fcm_ids && customer_fcm_ids.length) {
            let notification_to_customer: any = {
              type: "CANCELLED",
              title: "Order Cancel",
              message: "Your order cancellation request has been approved, you'll get refund in 4-5 days.",
              user_id: user_id,
              orderProduct_id: _id,
              images:images,
              product_id:product_id,
              created_at: +new Date(),
            };
            await DAO.save_data(Models.Notifications, notification_to_customer);
            await send_notification_to_all(notification_to_customer,customer_fcm_ids);

            let notification_to_admin: any = {
              type: "CANCELLED",
              title: "Order Cancel",
              message:"Your order cancellation request has been approved successfully",
              orderProduct_id: _id,
              product_id:product_id,
              created_at: +new Date(),
            };
            await common_module.send_notification_to_admin(notification_to_admin)
          }

        //email 
        let seller_detail = await DAO.get_data(Models.Sellers,{_id:seller_id},projection,options)
        let user_detail = await DAO.get_data(Models.Users,{_id:user_id},projection,options)
        await email_services.send_cancel_mail(user_detail[0], response,retrive_product,seller_detail[0]);
        
          return {
            message: "Order Cancelled Sucessfully",
          };
        }
      } else {
        throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH");
      }
    } catch (err) {
      throw err;
    }
  };

  static cancellation_request1 = async (req: any) => {
    try {
      let { _id: order_id } = req.body;
      let { _id: user_id } = req.user_data;

      let query = { _id: order_id };
      console.log("query ", query);

      let projection = { __v: 0 };
      let options = { lean: true };
      let retrive_data: any = await DAO.get_data(Models.Orders,query,projection,options);
      if (retrive_data.length) {
        let {
          _id,
          stripe_data: { payment_intent, refund_id },
        } = retrive_data[0];
        if (!!refund_id) {
          throw await handle_custom_error("ORDER_ALREADY_CANCELLED", "ENGLISH");
        } else {
          // let retrive_refund_id = await this.create_refund(payment_intent);
          let total_price = 500
          let retrive_refund_id = await this.create_refund(payment_intent,total_price);
          let query = { _id: _id };
          let data_to_update = {
            order_status: "PENDING_CANCELLATION",
            payment_status: "REFUND_IN_PROGRESS",
            cancel_request_accepted: true,
            "stripe_data.refund_id": retrive_refund_id,
            updated_at: +new Date(),
          };
          let options = { new: true };
          await DAO.find_and_update(Models.Orders,query,data_to_update,options);
          await this.update_order_products(_id);
          return {
            message: "Order Cancelled Sucessfully",
          };
        }
      } else {
        throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH");
      }
    } catch (err) {
      throw err;
    }
  };

  static create_refund = async (payment_intent: string,amount:any) => {
    try {
      let refund = await stripe.refunds.create({
        payment_intent: payment_intent,
        amount: parseInt(amount.toFixed(2) * 100 + ""),
      });
      return refund.id;
    } catch (err) {
      throw err;
    }
  };

  static update_order_products = async (order_id: string) => {
    try {
      let query = { order_id: order_id };
      let projection = { __v: 0 };
      let options = { lean: true };
      let retrive_data: any = await DAO.get_data(
        Models.OrderProducts,
        query,
        projection,
        options
      );
      if (retrive_data.length) {
        for (let i = 0; i < retrive_data.length; i++) {
          let { _id, product_id, quantity } = retrive_data[i];
          let query = { _id: _id };
          let data_to_update = {
            order_status: "CANCELLED",
            delivery_status: "CANCELLED",
            updated_at: +new Date(),
          };
          let options = { new: true };
          await DAO.find_and_update(
            Models.OrderProducts,
            query,
            data_to_update,
            options
          );
          await this.inc_product_quantity(product_id, quantity);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  static inc_product_quantity = async (
    product_id: string,
    quantity: number
  ) => {
    try {
      // console.log("product_id...", product_id)
      let query = { _id: product_id };
      let update = {
        $inc: {
          quantity: Number(quantity),
        },
        updated_at: +new Date(),
      };
      let options = { new: true };
      await DAO.find_and_update(Models.Products, query, update, options);
    } catch (err) {
      throw err;
    }
  };

}
