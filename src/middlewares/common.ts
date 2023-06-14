import * as DAO from "../DAO";
import * as Models from "../models";
import * as mongoose from "mongoose";
import { send_notification_to_all } from "../middlewares/index";

export class common_module {

  static send_notification_to_admin = async (notification_admin: any) => {
    let { type, title, message, order_id } = notification_admin;
    let projection = { __v: 0 };
    let options = { lean: true };
    let query = { type: "ADMIN", fcm_token: { $nin: ["", null] } };
    let admin_data: any = await DAO.get_data(Models.Sessions,query,projection,options);
    if (admin_data && admin_data.length) {
      let notification: any = {
        type: type,
        title: title,
        message: message,
        admin_id: admin_data[0].admin_id,
        order_id: order_id,
      };
      let admin_fcms: any = [];
      for (let i: 0; i < admin_data.length; i++) {
        let { fcm_token } = admin_data[i];
        admin_fcms.push(fcm_token);
      }
      console.log('Notification --- to --- admin --- sent')
      await DAO.save_data(Models.Notifications, notification);
      await send_notification_to_all(notification, admin_fcms);
    }
    return admin_data;
  };

  static get_user_detail = async (user_id: string) => {
    let projection = { __v: 0 };
    let options = { lean: true };
    // let query = { _id: mongoose.Types.ObjectId(user_id) };
    let query = { _id: user_id };
    let user_data: any = await DAO.get_data(
      Models.Users,
      query,
      projection,
      options
    );
    return user_data[0];
  };

  static get_seller_detail = async (seller_id: string) => {
    let projection = { __v: 0 };
    let options = { lean: true };
    // let query = { _id: mongoose.Types.ObjectId(seller_id) };
    let query = { _id: seller_id};
    let seller_data: any = await DAO.get_data(
      Models.Sellers,
      query,
      projection,
      options
    );
    return seller_data[0];
  };

  static customer_fcms_arr = async (user_id: string) => {
    let projection = { __v: 0 };
    let options = { lean: true };
    let query = {
      // user_id: { $in: mongoose.Types.ObjectId(user_id) },
      user_id: { $in: user_id },
      fcm_token: { $nin: [null, ""] },
    };
    let user_data: any = await DAO.get_data(
      Models.Sessions,
      query,
      projection,
      options
    );
    let fcms_arr: any = [];
    if (user_data && user_data.length) {
      for (let i = 0; i < user_data.length; i++) {
        fcms_arr.push(user_data[i].fcm_token);
      }
    }
    return fcms_arr;
  };

  static seller_fcms_arr = async (seller_id: string) => {
    let projection = { __v: 0 };
    let options = { lean: true };
    let query = {
      // seller_id: { $in: mongoose.Types.ObjectId(seller_id) },
      seller_id: { $in: seller_id },fcm_token: { $nin: [null, ""] } };
    let user_data: any = await DAO.get_data(Models.Sessions,query,projection,options);
    let fcms_arr: any = [];
    if (user_data && user_data.length) {
      for (let i = 0; i < user_data.length; i++) {
        fcms_arr.push(user_data[i].fcm_token);
      }
    }
    console.log('seller- fcm - arr -- 1---', fcms_arr)
    return fcms_arr;
  };

  static seller_fcms = async (seller_id:string) => {
    let projection = { __v: 0 };
    let options = { lean: true };
    // let query = { seller_id: { $in: mongoose.Types.ObjectId(seller_id) }, fcm_token: {$nin: [null, '']} }
    let query = { seller_id: { $in: seller_id }, fcm_token: {$nin: [null, '']} }

    let get_seller: any = await DAO.get_data(
      Models.Sessions,
      query,
      projection,
      options
    );

    let fcm_arr: any = [];
    if (get_seller && get_seller.length) {
      for (let i = 0; i < get_seller.length; i++) {
        let { fcm_token } = get_seller[i];
        fcm_arr.push(fcm_token);
      }
    }
    return fcm_arr;
  }

  static customer_fcms = async (user_id:string) => {
        let projection = { __v: 0 };
        let options = { lean: true };
        // let query = { user_id: { $in: mongoose.Types.ObjectId(user_id) }, fcm_token: {$nin: [null, '']} }
        let query = {
          user_id: { $in: user_id },
          fcm_token: { $nin: [null, ""] },
        };
        let get_user:any  = await DAO.get_data(Models.Sessions,query,projection,options)
        let fcm_arr:any = []
        if(get_user && get_user.length){
            for(let i = 0; i<get_user.length; i++){
                let {fcm_token} = get_user[i];
                fcm_arr.push(fcm_token)
            }
        }
        return fcm_arr
  }
}

