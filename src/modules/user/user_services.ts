import jwt from 'jsonwebtoken';
import * as DAO from "../../DAO";
import * as Models from "../../models";
import { app_constant, error } from "../../config/index";
import { generate_token, handle_custom_error, helpers } from "../../middlewares/index";
import parcel from "../../../src/models/parcel";
import * as email_services from "./email_services";

import Stripe from "stripe";
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options: any = { apiVersion: "2020-08-27" };
const stripe = new Stripe(STRIPE_KEY, stripe_options);

const user_scope = app_constant.scope.user;
var shippo = require('shippo')(process.env.SHIPPO_TOKEN);

const generate_user_token = async (_id: string, req_data: any, device_type:any) => {
  try {
    let token_data = {
      _id: _id,
      scope: user_scope,
      collection: Models.Users,
      token_gen_at: +new Date(),
    };
    let access_token: any = await generate_token(token_data);
    let response = await save_session_data(access_token, token_data, req_data,device_type);
    // console.log(response)
    return response;
  } catch (err) {
    // console.log(err)
    throw err;
  }
};

const update_otp = async (user_id: string) => {
    try {
        // generate otp
        let otp = await helpers.generate_otp();
        let query = { _id: user_id };
        let update = { otp: otp };
        let options = { new: true };
        return await DAO.find_and_update(Models.Users, query, update, options);
    } catch (err) {
        throw err;
    }
};

const update_phone_otp = async (user_id: string) => {
    try {
        let otp = await helpers.generate_phone_otp();
        let query = { _id: user_id };
        let update = { otp: otp };
        let options = { new: true };
        return await DAO.find_and_update(Models.Users, query, update, options);
    } catch (err) {
        throw err;
    }
};

const save_session_data = async (access_token: string,token_data: any,req_data: any,device_type:any) => {
    try {
        // let device_type: any = req_data.headers["user-agent"];
        // console.log('req_data headers -----USER ------  ',req_data.headers)
        // console.log("DEVICE TYPE  ----***** ----- ****  --- ", device_type);
        let { _id: user_id, token_gen_at } = token_data,
            {  fcm_token } = req_data;

        let set_data: any = {
            type: "USER",
            user_id: user_id,
            access_token: access_token,
            token_gen_at: token_gen_at,
            created_at: +new Date(),
        };
        if (device_type != null || device_type != undefined) {
            set_data.device_type = device_type;
        }
        if (fcm_token != null || fcm_token != undefined) {
            set_data.fcm_token = fcm_token;
        }
        let response = await DAO.save_data(Models.Sessions, set_data);

        return response;
    } catch (err) {
        throw err;
    }
};

const make_user_response = async (token_data: any, language: string) => {
    try {
        let { user_id, access_token, device_type, fcm_token, token_gen_at } = token_data;
        let query = { _id: user_id };
        let projection = { __v: 0, password: 0, otp: 0 };
        let options = { lean: true };
        let response: any = await DAO.get_data(Models.Users, query, projection, options);
        if (response.length) {
            response[0].access_token = access_token;
            response[0].device_type = device_type;
            response[0].fcm_token = fcm_token;
            response[0].token_gen_at = token_gen_at;
            return response[0];
        }
        else {
            throw await handle_custom_error("INVALID_OBJECT_ID", language);
        }
    }
    catch (err) {
        throw err;
    }
};

const block_delete_data = async (data: any, collection: any) => {
    try {
        let { _id, is_blocked, is_deleted } = data;

        let query = { _id: _id };
        let data_to_update: any = {};

        if (typeof is_blocked !== "undefined" && is_blocked !== null) {
            data_to_update.is_blocked = is_blocked;
        }
        if (typeof is_deleted !== "undefined" && is_deleted !== null) {
            data_to_update.is_deleted = is_deleted;
        }
        let options = { new: true };
        let response = await DAO.find_and_update(collection, query, data_to_update, options);

        return response;
    } catch (err) {
        throw err;
    }
};

const deactivate_data = async (data: any, session_data: any) => {
    try {
        let { deactivation_reason, password, language } = data,
            { user_id: _id } = session_data;
        console.log("User ID: ", _id);
        let update_set: any = {
            account_status: "Deactivated",
            deactivation_reason: deactivation_reason,
        };
        console.log(update_set);
        let query = { _id: _id };
        let options = { new: true };
        let projection = { _v: 0 };
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options);
        console.log(fetch_data);
        if (fetch_data.length) {
            let { password: hash } = fetch_data[0];

            let decrypt = await helpers.decrypt_password(password, hash);

            if (decrypt != true) {
                throw await handle_custom_error("INCORRECT_PASSWORD", language);
            } else {
                let response = await DAO.find_and_update(Models.Users, query, update_set, options);
                console.log(response);
                return response;
            }
        }
    } catch (err) {
        throw err;
    }
};

const verify_user_info = async (query: any) => {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = await DAO.get_data(Models.Users, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
};

const set_user_data = async (data: any, stripe_customer: any) => {
    try {

        let { name, email, country_code, phone_no, password,language } = data;
        let { id: customer_id } = stripe_customer;
        console.log("stripe_customer....", stripe_customer)

        let hassed_password = await helpers.bcrypt_password(password);
        let otp = await helpers.generate_otp();
        let phone_otp = await helpers.generate_phone_otp();

        let data_to_save: any = {
            name: name,
            email: email.toLowerCase(),
            // country_code: country_code,
            // phone_no: phone_no,
            password: hassed_password,
            customer_id: customer_id,
            otp: otp,
            phone_otp: phone_otp,
            language:language,
            created_at: +new Date(),
        };
        if (data.profile_pic) { data_to_save.profile_pic = data.profile_pic }
        if (data.country_code) { data_to_save.country_code = data.country_code }
        if (data.phone_no) { data_to_save.phone_no = data.phone_no }

        let response: any = await DAO.save_data(Models.Users, data_to_save);
        return response;

    }
    catch (err) {
        throw err;
    }
};

const create_new_user = async (data: any) => {
    try {

        let { social_type, social_token, country_code, phone_no, name, email } = data;

        let stripe_customer = await stripe.customers.create({
            name: name,
            email: email,
            description: "Customer",
        });
        let decode_token = await jwt.decode(social_token);
        console.log("decode_token....", decode_token);
        let { id: customer_id } = stripe_customer;
        if (social_type == "GOOGLE") {
            let decode_token = await jwt.decode(social_token);
            // let { sub, email: google_email, name: google_name } = decode_token
            console.log("decode_token....", decode_token)
            let data_to_save: any = {
                social_type: social_type,
                // social_token: sub,
                // name: google_name,
                // email: google_email.toLowerCase(),
                email_verified: true,
                customer_id:customer_id,
                created_at: +new Date()
            }
            if (!!country_code) { data_to_save.country_code = country_code }
            if (!!phone_no) { data_to_save.phone_no = phone_no }
            let response = await DAO.save_data(Models.Users, data_to_save);
            return response

        }
        else {

            let data_to_save: any = {
              social_type: social_type,
              social_token: social_token,
              email_verified: true,
              customer_id: customer_id,
              created_at: +new Date(),
            };
            if (!!email) { data_to_save.email = email.toLowerCase(); }
            if (!!country_code) { data_to_save.country_code = country_code; }
            if (!!phone_no) { data_to_save.phone_no = phone_no; }
            if (!!name) { data_to_save.name = name; }
            let response = await DAO.save_data(Models.Users, data_to_save);
            return response

        }

    }
    catch (err) {
        throw err;
    }
};

const edit_profile_data = async (data: any, user_data: any) => {
    try {

        let { _id: user_id, name, email, phone_no, country_code } = user_data;
        let set_data: any = {}

        if (data.profile_pic) { set_data.profile_pic = data.profile_pic }
        if (data.name) { set_data.name = data.name }
        if (data.work) { set_data.work = data.work }
        if (data.about) { set_data.about = data.about }

        if (data.email) {
            let to_lower_case = data.email.toLowerCase();
            let query = { _id: { $ne: user_id }, email: to_lower_case };
            let fetch_data: any = await verify_user_info(query);
            if (fetch_data.length) {
                throw await handle_custom_error("EMAIL_ALREADY_EXISTS", data.language);
            }
            else {
                if(to_lower_case != email) {
                    let otp = await helpers.generate_otp();
                    set_data.email = to_lower_case;
                    set_data.otp = otp;
                    set_data.email_verified = false;
    
                    let set_name = data.name !== undefined ? data.name : name;
                    await email_services.edit_profile_mail(to_lower_case, otp, set_name);
                }
            }
        }
        if (data.country_code && data.phone_no) {
            // let country_code = data.country_code;
            // let phone_no = data.phone_no;
            let query = {
                _id: { $ne: user_id },
                phone_no: data.phone_no,
            };
            let fetch_data: any = await verify_user_info(query);
            if (fetch_data.length) {
                throw await handle_custom_error("PHONE_NO_ALREADY_EXISTS", data.language);
            }
            else {
                if(country_code != data.country_code) {
                    set_data.country_code = data.country_code;
                }
                if(phone_no != data.phone_no) {
                    let phone_otp = await helpers.generate_phone_otp();
                    set_data.phone_no = data.phone_no;
                    set_data.phone_otp = phone_otp;
                    set_data.phone_verified = false;
                }
            }
        }
        return set_data;

    } 
    catch (err) {
        throw err;
    }
};

const edit_address_data = async (data: any, user_data: any) => {
    try {
        let set_data: any = {};

        if (data.name) {
            set_data.name = data.name;
        }
        if (data.user_id) {
            set_data.user_id = user_data.user_id;
        }
        if (data.country_code) {
            set_data.country_code = data.country_code;
        }
        if (data.phone_no) {
            set_data.phone_no = data.phone_no;
        }
        if (data.company) {
            set_data.company = data.company;
        }
        if (data.country) {
            set_data.country = data.country;
        }
        if (data.state) {
            set_data.state = data.state;
        }
        if (data.city) {
            set_data.city = data.city;
        }
        if (data.pin_code) {
            set_data.pin_code = data.pin_code;
        }
        if (data.apartment_number) {
            set_data.apartment_number = data.apartment_number;
        }
        if (data.full_address) {
            set_data.full_address = data.full_address;
        }
        if (data.address_type) {
            set_data.address_type = data.address_type;
        }
        if (data.lat) {
           set_data.lat = data.lat;
        }
        if (data.lng) {
           set_data.lng = data.lng;
        }
        if(data.lng && data.lat){
            set_data.location_from = {
              type: "Point",
              coordinates: [data.lng, data.lat],
            };
        }

        return set_data;
    } catch (err) {
        throw err;
    }
};

const fetch_product_data = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 };
        let populate = [{ path: "", select: "name price image_url" }];
        let response: any = await DAO.populate_data(Models.Products, query, projection, options, populate);
        return response;
    } catch (err) {
        throw err;
    }
};

const fetch_Orders_data = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 };
        let populate = [{ path: "product", select: "" }];
        let response: any = await DAO.populate_data(Models.Orders, query, projection, options, populate);
        return response;
    } catch (err) {
        throw err;
    }
};
const fetch_Wishlist_data = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 };
        let populate = [{ path: "product_id", select: "" }];
        let response: any = await DAO.populate_data(Models.Wishlist, query, projection, options, populate);
        return response;
    } catch (err) {
        throw err;
    }
};

const save_address = async (data: any) => {
    data.created_at = +new Date();
    let response = await DAO.save_data(Models.Address, data);
    return response;
};

const update_address_data = async (query: any, update: any) => {
    try {
        let options = { new: true };
        let response = await DAO.find_and_update(Models.Address, query,
            update, options);
        return response;
    } catch (err) {
        throw err;
    }
};

const fetch_total_count = async (collection: any, query: any) => {
    try {
        let response = await DAO.count_data(collection, query);
        return response;
    } catch (err) {
        throw err;
    }
};

const make_address_response = async (query: any, options: any) => {
    try {
        // let query = { user_id : user_id }
        let projection = { __v: 0 };
        let respone = await DAO.get_data(Models.Address, query, projection, options);
        return respone;
    } catch (err) {
        throw err;
    }
};

const make_orders_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: "product_id", select: "name image price image_url" },
        ];
        let respone = await DAO.populate_data(Models.Orders, query, projection, options, populate);
        return respone;
    } catch (err) {
        throw err;
    }
};

const order_cancellation = async (data: any, collection: any) => {
    try {
        let { _id, cancellation_reason } = data;
        let query = { _id: _id };
        let projection = { __v: 0 }

        let options_order = { lean: true }
        let get_orders = await DAO.get_data(Models.Orders, query, projection, options_order)
        // console.log("GET_Orders", get_orders)
        let transaction_id = get_orders[0].transaction_id
        // console.log("TRANSACTION_ID", transaction_id)

        let refund = await shippo.refund.create({
            "transaction": transaction_id,
            "async": false
        })
        // console.log("REFUND", refund)
        let refund_id = refund.object_id
        // console.log("REFUND_ID",refund_id)

        let data_to_update: any = {
            order_status: "CANCELLED",
            refund_id: refund_id,
            is_removed: true,
            cancellation_reason: cancellation_reason,
        };

        let options = { new: true };
        let response = await DAO.find_and_update(collection, query, data_to_update, options);
        return response;
    } catch (err) {
        throw err;
    }
};

const fetch_user_data = async (query: any, options: any) => {
    try {
        let projection = { password: 0, otp: 0, fp_otp: 0, unique_code: 0, __v: 0 };
        let response = await DAO.get_data(Models.Users, query, projection, options);
        return response;
    } catch (err) {
        throw err;
    }
};

// const save_order_create1 = async (data: any, user_id: any) => {
//   try {
//     let { quantity, product, address_id, card_id, delivery_charges, coupon_code, price, payment_mode,
//       transaction_id, shipment_id } = data;

//     let order_id = await helpers.genrate_order_id();
//     var calculate_price: any, coupon_off_price: any;

//     let query = { _id: product },
//       projection = { price: 1, discount_price: 1, discount: 1 },
//       options = { lean: true };
//     let product_data: any = await DAO.get_single_data(Models.Products, query, projection, options);
//     calculate_price = quantity * product_data.discount_price.toFixed(0);

//     //COUPON
//     if (coupon_code != null) {
// //       //check coupon is available
//       let query_coupon = { code: coupon_code, is_available: true },
//         projections = { __v: 0 },
//         option = { lean: true };
//       let coupon_data: any = await DAO.get_single_data(Models.Coupons, query_coupon, projections, option);

//       let query = { coupon_id: coupon_data._id };

//       //verify coupon is already used
//       let verify_coupon_used: any = await DAO.get_data(Models.Used_Coupons, query, projections, options);
//       // console.log(">>>>>>>>>>>USED_COUPON>>>>>>>>>>>>",verify_coupon_used)
//       // console.log("COUPON LENGTH ", verify_coupon_used.length )

//       if (verify_coupon_used.length == 0) {
//         //check coupon type
//         if (coupon_data.coupon_type == "FIXED") {
//           coupon_off_price = coupon_data.price;
//           calculate_price = calculate_price - coupon_off_price;
//         } else {
//           let coupon_discount = coupon_data.max_discount;
//           coupon_off_price = (coupon_discount / 100) * calculate_price;
//           calculate_price = calculate_price - coupon_off_price;
//         }
//         var coupon_name = coupon_data.code;
//         //save coupon as it is used
//         let set_data: any = {
//           user_id: user_id,
//           coupon_id: coupon_data._id,
//           is_deleted: true,
//         };
//         await DAO.save_data(Models.Used_Coupons, set_data);
//       }
//     }

//     let shipment = { object_id: shipment_id }
//     let get_shipment = await shippo.shipment.retrieve(shipment_id);
//     //  console.log("get_shipment",get_shipment)

//     let transaction = { object_id: transaction_id }
//     let get_transaction = await shippo.transaction.retrieve(transaction_id)
//     // console.log("get_transaction",get_transaction)
//     let parcel_id = get_transaction.parcel
//     // console.log("PARCEL_ID",parcel_id)
//     let tracking_number = get_transaction.tracking_number
//     // console.log("tracking_NUMBER",tracking_number)
//     let label_url = get_transaction.label_url
//     // console.log("label_url",label_url)
//     let rate_id = get_shipment.rates[0].object_id
//     // console.log("rate_id",rate_id)
//     let estimated_days = get_shipment.rates[0].estimated_days
//     // console.log("estimated_days",estimated_days)
//     let servicelevel = get_shipment.rates[0].servicelevel.token
//     // console.log("servicelevel",servicelevel)

//     let option_save = { new: true }
//     let query_save = { tracking_id: transaction_id, shipment_id: shipment_id }
//     let update_save = {
//       shipment_id: shipment_id,
//       transaction_id: transaction_id,
//       parcel_id: parcel_id,
//       tracking_number: tracking_number,
//       label_url: label_url,
//       rate_id: rate_id,
//       estimated_days: estimated_days,
//       servicelevel: servicelevel
//     }
//     let update_shipment = await DAO.find_and_update(Models.Orders, query_save, update_save, option_save)

//     let data_to_save = {
//       quantity: quantity,
//       product: product,
//       user_id: user_id,
//       order_id: order_id,
//       card_id: card_id,
//       address_id: address_id,
//       delivery_charges: delivery_charges,
//       price: price,
//       coupon_code: coupon_name,
//       payment_mode: payment_mode,
//       coupon: coupon_off_price,
//       total_price: calculate_price,
//       shipment_id: shipment_id,
//       transaction_id: transaction_id,
//       parcel_id: parcel_id,
//       tracking_number: tracking_number,
//       label_url: label_url,
//       rate_id: rate_id,
//       estimated_days: estimated_days,
//       servicelevel: servicelevel,
//       created_at: +new Date(),
//     };

//     let response: any = await DAO.save_data(Models.Orders, data_to_save);

//     // console.log("SAVE SHIPMENT",response)

//     return response;
//   } catch (err) {
//     throw err;
//   }
// };

const save_order_create = async (data: any, user_id: any) => {
    try {

        let { quantity, product, address_id, card_id, delivery_charges, coupon_code, price, payment_mode,
            transaction_id, shipment_id
        } = data;

        let order_id = await helpers.genrate_order_id();
        var calculate_price: any, coupon_off_price: any;

        let query = { _id: product };
        let projection = { price: 1, discount_price: 1, discount: 1 };
        let options = { lean: true };
        let product_data: any = await DAO.get_single_data(Models.Products, query, projection, options);
        calculate_price = quantity * product_data.discount_price.toFixed(0);

        //COUPON
        if (coupon_code != null) {
            //check coupon is available
            let query_coupon = { code: coupon_code, is_available: true }
            let projections = { __v: 0 };
            let option = { lean: true };
            let coupon_data: any = await DAO.get_single_data(Models.Coupons, query_coupon, projections, option);

            //verify coupon is already used
            let query = { coupon_id: coupon_data._id };
            let verify_coupon_used: any = await DAO.get_data(Models.Used_Coupons, query, projections, options);
            if (verify_coupon_used.length == 0) {
                //check coupon type
                if (coupon_data.coupon_type == "FIXED") {
                    coupon_off_price = coupon_data.price;
                    calculate_price = calculate_price - coupon_off_price;
                }
                else {
                    let coupon_discount = coupon_data.max_discount;
                    coupon_off_price = (coupon_discount / 100) * calculate_price;
                    calculate_price = calculate_price - coupon_off_price;
                }
                var coupon_name = coupon_data.code;
                //save coupon as it is used
                let set_data: any = {
                    user_id: user_id,
                    coupon_id: coupon_data._id,
                    is_deleted: true,
                };
                await DAO.save_data(Models.Used_Coupons, set_data);
            }
        }

        let get_shipment = await shippo.shipment.retrieve(shipment_id);
        let get_transaction = await shippo.transaction.retrieve(transaction_id)

        let parcel_id = get_transaction.parcel
        let tracking_number = get_transaction.tracking_number
        let label_url = get_transaction.label_url
        let rate_id = get_shipment.rates[0].object_id
        let estimated_days = get_shipment.rates[0].estimated_days
        let servicelevel = get_shipment.rates[0].servicelevel.token

        let data_to_save = {
            quantity: quantity,
            product: product,
            user_id: user_id,
            order_id: order_id,
            card_id: card_id,
            address_id: address_id,
            delivery_charges: delivery_charges,
            price: price,
            coupon_code: coupon_name,
            payment_mode: payment_mode,
            coupon: coupon_off_price,
            total_price: calculate_price,
            shipment_id: shipment_id,
            transaction_id: transaction_id,
            parcel_id: parcel_id,
            tracking_number: tracking_number,
            label_url: label_url,
            rate_id: rate_id,
            estimated_days: estimated_days,
            servicelevel: servicelevel,
            created_at: +new Date(),
        };
        // let update_shipment = await DAO.find_and_update(Models.Orders, query_save, update_save, option_save)
        let response: any = await DAO.save_data(Models.Orders, data_to_save);
        return response;

    }
    catch (err) {
        throw err;
    }
};

const fetch_Orders_search = async (query: any, options: any) => {
    try {
        let response: any = await DAO.aggregate_data(Models.Orders, query, options);
        return response;
    } catch (err) {
        throw err;
    }
};

const save_notification_data = async (set_data: any) => {
    try {
        let response = await DAO.save_data(Models.Notifications, set_data);
        return response;
    } catch (err) {
        throw err;
    }
};
const verify_product_info = async (query: any) => {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = await DAO.get_data(Models.Products, query, projection, options);
        // console.log(fetch_data)
        return fetch_data;
    } catch (err) {
        throw err;
    }
};

const save_wishlist = async (data: any, user_id: any) => {
    try {
        let { product_id } = data;
        let set_data: any = {
            product_id: product_id,
            user_id: user_id,
            created_at: +new Date(),
        };
        let response: any = await DAO.save_data(Models.Wishlist, set_data);
        return response;
    } catch (err) {
        throw err;
    }
};

const save_to_cart = async (data: any, user_id: any) => {
    try {
        let { quantity, product, delivery_charges, price } = data;

        let query = { _id: product },
            projection = { price: 1, discount_price: 1 },
            options = { lean: true };
        let product_data: any = await DAO.get_single_data(Models.Products, query, projection, options);
        let calculate_price = quantity * product_data.discount_price;
        // console.log("product_data-> ", product_data)
        // console.log("calculate_price-> ", calculate_price)
        let data_to_save = {
            quantity: quantity,
            product: product,
            user_id: user_id,
            delivery_charges: delivery_charges,
            price: price,
            total_price: calculate_price,
            created_at: +new Date(),
        };

        let response: any = await DAO.save_data(Models.Cart, data_to_save);

        return response;
    } catch (err) {
        throw err;
    }
};

const fetch_Cart_data = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 };
        let populate = [{ path: "product", select: "" }];
        let response: any = await DAO.populate_data(Models.Cart, query, projection, options, populate);
        return response;
    } catch (err) {
        throw err;
    }
};
const edit_cart = async (data: any, cart_id: any) => {
    try {
        let query = { _id: cart_id };
        let projection = { product: 1 };
        let options = { lean: true };

        let get_cart_data: any = await DAO.get_single_data(Models.Cart, query, projection, options);

        let query_data = { _id: get_cart_data.product };
        let projections = { discount_price: 1 };

        let get_product: any = await DAO.get_single_data(Models.Products, query_data, projections, options);

        let set_data: any = {};

        if (data.quantity) {
            set_data.quantity = data.quantity;
            set_data.total_price = data.quantity * get_product.discount_price;
        }
        let query_dta = { _id: cart_id };
        let response_data: any = await DAO.find_and_update(Models.Cart, query_dta, set_data, options);
        return response_data;
    } catch (err) {
        throw err;
    }
};

const save_card = async (data: any, user_id: any) => {
    let { number, holder_name, exp_month, exp_year, cvc } = data, response: any;
    let data_to_save: any = {
        user_id: user_id,
        card_number: number,
        card_holder_name: holder_name,
        expiry_month: exp_month,
        expiry_year: exp_year,
        cvv: cvc,
        is_deleted: false,
        created_at: +new Date(),
    };

    let query = { user_id: user_id };
    let fetch_data: any = await fetch_total_count(Models.Cards, query);

    if (fetch_data !== 0) {
        data_to_save.is_default = false;
        response = await DAO.save_data(Models.Cards, data_to_save);
    } else {
        data_to_save.is_default = true;
        response = await DAO.save_data(Models.Cards, data_to_save);
    }

    return response;
};
const get_seller_data = async (_id: any) => {
    try {
        let query = { _id: _id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_single_data(Models.Users, query, projection, options);

        return fetch_data
    } catch (err) {
        throw err;
    }
};

const fetch_cards = async (query: any, options: any) => {
    try {
        // let query = { user_id : user_id }
        let projection = { __v: 0, cvv: 0 };
        let respone = await DAO.get_data(Models.Cards, query, projection, options);
        return respone;
    } catch (err) {
        throw err;
    }
};

const update_card = async (query: any, update: any) => {
    try {
        let options = { new: true };
        let response = await DAO.find_and_update(Models.Cards, query, update, options);
        return response;
    } catch (err) {
        throw err;
    }
};
const fetch_order_detail = async (query: any, options: any) => {
    try {
        let projection = { order_status: 1, total_price: 1 };

        let populate = [
            { path: "product", select: "_id images name price" },
            { path: "user_id", select: "name profile_pic address phone_no " },
            { path: "address_id", select: "" },
            { path: "parcel_id", select: "" },
        ];

        let fetch_data: any = await DAO.populate_data(Models.Orders, query, projection, options, populate);

        return fetch_data;
    } catch (err) {
        throw err;
    }
};

const get_products = async (query_product: any, optionss: any) => {
    try {
        let projection = { __v: 0 }
        let fetch_products = await DAO.get_data(Models.Products, query_product, projection, optionss)
        // console.log("Fetch_Products", fetch_products)
        return fetch_products
    } catch (err) {
        throw (err)
    }
}
const get_seller = async (query_seller: any, options_seller: any) => {
    try {
        let projection = { __v: 0 }
        let fetch_seller = await DAO.get_data(Models.Sellers, query_seller, projection, options_seller)
        // console.log("Fetch_Seller", fetch_seller)
        return fetch_seller
    } catch (err) {
        throw (err)
    }
}

const user_shippoAddress = async (_id: any, address_id: any) => {
    try {
        // let { _id } = req.user_data;

        let query = { user_id: _id, _id: address_id }
        let projection: { __v: 0 }, options = { lean: true }
        let get_address: any = await DAO.get_single_data(Models.Address, query, projection, options)

        // console.log('-----------------------HEREEEE ')

        var UseraddressTo = await shippo.address.create({
            "name": get_address.name,
            "street1": get_address.apartment_number,
            "city": get_address.city,
            "state": get_address.state,
            "zip": get_address.pin_code,
            "country": get_address.country
        })
        // console.log("User address id ", UseraddressTo.object_id)

        let validate_user_address: any = await shippo.address.validate(UseraddressTo.object_id);
        // console.log("validate_user_address.object_id ", validate_user_address.object_id)
        let update: any = {
            shippo_user_address_id: validate_user_address.object_id
        }
        let option = { new: true }
        let update_seller: any = await DAO.find_and_update(Models.Address, query, update, option)
        // console.log("SERVICE ", update_seller)
        return update_seller
    } catch (err) {
        throw (err)
    }

}


export {
    generate_user_token,
    update_otp,
    save_session_data,
    make_user_response,
    block_delete_data,
    deactivate_data,
    verify_user_info,
    set_user_data,
    create_new_user,
    edit_profile_data,
    edit_address_data,
    fetch_product_data,
    fetch_total_count,
    save_address,
    make_address_response,
    make_orders_response,
    fetch_Orders_data,
    update_address_data,
    order_cancellation,
    fetch_user_data,
    save_order_create,
    fetch_Orders_search,
    save_notification_data,
    verify_product_info,
    save_wishlist,
    fetch_Wishlist_data,
    save_to_cart,
    fetch_Cart_data,
    save_card,
    fetch_cards,
    update_card,
    edit_cart,
    get_seller_data,

    fetch_order_detail,

    get_products,
    get_seller,

    user_shippoAddress,
    update_phone_otp,


};
