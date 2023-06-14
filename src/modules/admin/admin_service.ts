
import * as DAO from '../../DAO/index';
import * as Models from '../../models';
import { app_constant } from '../../config/index';
const admin_scope = app_constant.scope.admin;
const user_scope = app_constant.scope.user;
const seller_scope = app_constant.scope.seller;
import { generate_token, handle_custom_error, helpers } from '../../middlewares/index';
import { send_email } from '../../middlewares';
import { send_notification } from '../../middlewares'

import * as list_orders from "./list_orders";


// const Moment = require('moment-timezone');
// const MomentRange = require('moment-range');
// const moment = MomentRange.extendMoment(Moment);
// const salt_rounds = app_constant.salt_rounds;
// const admin_scope = app_constant.scope.admin;
// const user_scope = app_constant.scope.user;

const generate_admin_token = async (_id: string,req_data:any) => {
    try {

        let token_data = {
            _id: _id,
            scope: admin_scope,
            collection: Models.Admin,
            token_gen_at: +new Date()
        }
        let response = await fetch_admin_token(token_data,req_data)
        return response

    }
    catch (err) {
        throw err;
    }
}


const fetch_admin_token = async (token_data: any,req_data:any) => {
    try {
        let {fcm_token} = req_data;
        let access_token: any = await generate_token(token_data)
        let response = await save_session_data(access_token, token_data,fcm_token)
        return response

    }
    catch (err) {
        throw err;
    }
}


const save_session_data = async (access_token: string, token_data: any,fcm_token) => {
    try {

        let { _id: admin_id, token_gen_at } = token_data

        let set_data: any = {
            type: "ADMIN",
            admin_id: admin_id,
            access_token: access_token,
            token_gen_at: token_gen_at,
            fcm_token:fcm_token,
            created_at: +new Date()
        }
        let response = await DAO.save_data(Models.Sessions, set_data)

        return response

    }
    catch (err) {
        throw err;
    }
}

const update_language = async (_id: string, language: string) => {
    try {

        let query = { _id: _id }
        let update = { language: language }
        let options = { new: true }
        await DAO.find_and_update(Models.Admin, query, update, options)

    }
    catch (err) {
        throw err;
    }
}

const make_admin_response = async (data: any, language: string) => {
    try {

        let { admin_id, access_token, token_gen_at } = data

        let query = { _id: admin_id }
        let projection = { __v: 0 }
        let options = { lean: true }
        let fetch_data: any = await DAO.get_data(Models.Admin, query, projection, options)

        if (fetch_data.length) {

            fetch_data[0].access_token = access_token
            fetch_data[0].token_gen_at = token_gen_at

            return fetch_data[0]
        }
        else {
            throw await handle_custom_error('UNAUTHORIZED', language)
        }

    }
    catch (err) {
        throw err;
    }
}


const block_delete_data = async (data: any, collection: any) => {
    try {

        let { _id, is_blocked, is_deleted } = data;
        let message:any;
        let query = { _id: _id }
        let data_to_update: any = {}
        if (typeof is_blocked !== "undefined" && is_blocked !== null) {
            data_to_update.is_blocked = is_blocked
            if (is_blocked == true || is_blocked == 'true') {
              message = "User blocked successfully.";
            } else if (is_blocked == false || is_blocked == 'false') {
              message = "User unblocked successfully.";
            }
        }
        if (typeof is_deleted !== "undefined" && is_deleted !== null) {
            data_to_update.is_deleted = is_deleted
            if (is_deleted == true || is_deleted == 'true') {
              message = "User deleted successfully.";
            } else if (is_deleted == false || is_deleted == 'false') {
              message = "User active successfully.";
            }
        }
        let options = { new: true }
        let response: any = await DAO.find_and_update(collection, query, data_to_update, options)
        let query_data = {
            $or : [
                { seller_id: _id },
                { user_id: _id }
            ]
        }
        await DAO.remove_data(Models.Sessions, query_data);
        
        return {message:message}

    }
    catch (err) {
        throw err;
    }
}

const verify_unverify = async (data: any, collection: any) => {
    try {

        let { _id, admin_verified } = data;
        console.log(data);
        
        let message:any;
        let query = { _id: _id }
        let update: any = {}
        if (typeof admin_verified !== "undefined" && admin_verified !== null) {
            update.admin_verified = admin_verified
             if (admin_verified == true || admin_verified == 'true') {
               message = "User verified successfully.";
             } else if (admin_verified == false || admin_verified == 'false') {
               message = "User unverified successfully.";
             }
        }
        let options = { new: true }
        let response = await DAO.find_and_update(collection, query, update, options)
        return { message: message };

    }
    catch (err) {
        throw err;
    }
}

const activate_deactivate = async (data: any, collection: any) => {
    try {

        let { _id, account_status } = data
        let message:any;
        let query = { _id: _id }
        let update = { account_status: account_status }
        let options = { new: true }
        let response = await DAO.find_and_update(collection, query, update, options)

        // remove login details
        if (account_status == 'DEACTIVATED') {
            let query = {
                $or : [
                { seller_id: _id },
                { user_id: _id }
            ]}
            await DAO.remove_many(Models.Sessions, query)
        }
        if (account_status == 'DEACTIVATED') {
          message = "User account deactivated successfully.";
        } else if (account_status == 'ACTIVATED') {
          message = "User account activated successfully.";
        }
        console.log('mess ', message)
        return { message:message}

    }
    catch (err) {
        throw err;
    }
}

const fetch_total_count = async (collection: any, query: any) => {
    try {

        let response = await DAO.count_data(collection, query)
        return response

    }
    catch (err) {
        throw err;
    }
}

const fetch_recent_users = async () => {
    try {

        let query = { is_deleted: false }
        let projection = { __v: 0, password: 0, otp: 0, fp_otp: 0 }
        let options = { lean: true, sort: { _id: -1 }, limit: 20 }
        let response = await DAO.get_data(Models.Users, query, projection, options)
        return response

    }
    catch (err) {
        throw err;
    }
}

const fetch_recent_products = async () => {
    try {

        let query = { is_deleted: false }
        let projection = { __v: 0 }
        let options = { lean: true, sort: { _id: -1 }, limit: 20 }
        let populate = [
            { path: 'brand_id', select: 'name' }
        ]
        // let response = await DAO.get_data(Models.Products, query, projection, options)
        let response = await DAO.populate_data(Models.Products, query, projection, options, populate)
        return response

    }
    catch (err) {
        throw err;
    }
}

const total_earnings = async (req: any) => {
    try {

        let query = { order_status : "DELIVERED" }
        let projection = { __v: 0 }
        let options = { lean: true }
        let retrive_data: any = await DAO.get_data(Models.OrderProducts, query, projection, options);

        let total_earnings = 0;
        if (retrive_data.length) {
            for (let i = 0; i < retrive_data.length; i++) {
                total_earnings += retrive_data[i].admin_commision;
            }
        }
        return total_earnings

    }
    catch (err) {
        throw err;
    }
}

const total_reviews = async (req: any) => {
        try {
            let query = { }
            let count = await DAO.count_data(Models.Reviews, query);
            return count

        }
        catch (err) {
            throw err;
        }
}

const total_ratings = async (req: any) => {
        try {
            let query = { }
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

const generate_user_token = async (_id: string, req_data: any, device_type:any) => {
  try {
    let token_data = {
      _id: _id,
      scope: user_scope,
      collection: Models.Users,
      token_gen_at: +new Date(),
    };
    let response = await fetch_user_token(token_data, req_data, device_type);
    return response;
  } catch (err) {
    throw err;
  }
};


const fetch_user_token = async (token_data: any, req_data: any, device_type:any) => {
    try {

        let access_token: any = await generate_token(token_data)
        console.log('access _token ')
        let response = await save_user_session_data(access_token, token_data, req_data, device_type)
        return response

    }
    catch (err) {
        throw err;
    }
}


const save_user_session_data = async (access_token: string, token_data: any, req_data: any,device_type:any) => {
    try {

        let { _id: user_id, token_gen_at } = token_data, { fcm_token } = req_data

        let set_data: any = {
            type: "USER",
            user_id: user_id,
            access_token: access_token,
            token_gen_at: token_gen_at,
            created_at: +new Date()
        }
        if (device_type != null || device_type != undefined) { set_data.device_type = device_type }
        if (fcm_token != null || fcm_token != undefined) { set_data.fcm_token = fcm_token }
        let response = await DAO.save_data(Models.Sessions, set_data)

        return response

    }
    catch (err) {
        throw err;
    }
}

const make_user_response = async (token_data: any) => {
    try {
        let { user_id, access_token, device_type, fcm_token, language, token_gen_at } = token_data
        let query = { _id: user_id }
        let projection = {
            __v: 0,
            password: 0,
            otp: 0,
            fp_otp: 0,
            unique_code: 0,
            fp_otp_verified: 0,
            is_blocked: 0,
            is_deleted: 0
        }
        let options = { lean: true }
        let response: any = await DAO.get_data(Models.Users, query, projection, options)
        if (response.length) {
            response[0].access_token = access_token
            response[0].device_type = device_type
            response[0].fcm_token = fcm_token
            response[0].token_gen_at = token_gen_at
            return response[0]
        } 
        else {
             throw await handle_custom_error("UNAUTHORIZED", language);
        }
    }
    catch (err) {
        throw err;
    }
}

const fetch_user_data = async (query: any, options: any) => {
    try {

        let projection = { password: 0, otp: 0, fp_otp: 0, unique_code: 0, __v: 0, forgot_otp: 0 }
        let response = await DAO.get_data(Models.Users, query, projection, options)
        return response

    }
    catch (err) {
        throw err;
    }
}

const check_content = async (type: string) => {
    try {

        let query = { type: type }
        let projection = { __v: 0 }
        let options = { lean: true }
        return await DAO.get_data(Models.Content, query, projection, options)

    }
    catch (err) {
        throw err;
    }
}

const verify_admin_info = async (query: any) => {
    try {

        let projection = { __v: 0 }
        let options = { lean: true }
        let fetch_data = await DAO.get_data(Models.Admin, query, projection, options)
        return fetch_data

    }
    catch (err) {
        throw err;
    }
}

// const set_staff_data = async (data: any, language: string, type: string) => {
//     try {

//         let set_data: any = {
//             name: data.name,
//             roles: data.roles,
//         }
//         if (data.password) {
//             let hassed_password = await helpers.bcrypt_password(data.password)
//             set_data.password = hassed_password
//         }
//         if (data.image) { set_data.image = data.image }
//         if (data.phone_number) { set_data.phone_number = data.phone_number }
//         if (data.country_code) { set_data.country_code = data.country_code }


//         if (data.email) {

//             // check other email
//             let email = data.email.toLowerCase()
//             if (type == 'UPDATE') {

//                 let query = { _id: { $ne: data._id }, email: email }
//                 let fetch_data: any = await verify_admin_info(query)
//                 if (fetch_data.length) {
//                     throw await handle_custom_error('EMAIL_ALREADY_EXISTS', language)
//                 }
//                 else { set_data.email = email }

//             } else {

//                 let query = { email: email }
//                 let fetch_data: any = await verify_admin_info(query)
//                 if (fetch_data.length) {
//                     throw await handle_custom_error('EMAIL_ALREADY_EXISTS', language)
//                 }
//                 else { set_data.email = email }

//             }

//         }

//         return set_data

//     }
//     catch (err) {
//         throw err;
//     }
// }


const save_staff_data = async (data: any) => {
    try {
        let { name, email, password, image, phone_number, country_code, roles } = data
        let hassed_password = await helpers.bcrypt_password(password)
        let set_data: any = {
            name: name,
            email: email,
            password: hassed_password,
            image: image,
            phone_number: phone_number,
            country_code: country_code,
            roles: roles,
            created_at: +new Date()
        }
        let response = await DAO.save_data(Models.Admin, set_data)
        return response
    }
    catch (err) {

        throw (err)
    }
}

// const make_products_response = async (query: any, options: any) => {
//     try {

//         let projection = { __v: 0 }
//         let populate = [
//             { path: 'added_by', select: 'profile_pic name' },
//             { path: 'brand_id', select: 'name' }
//         ]
//         let respone = await DAO.populate_data(Models.Products, query, projection, options, populate)
//         return respone

//     }
//     catch (err) {
//         throw err;
//     }
// }

const make_products_response = async (query: any, options: any) => {
    try {

        let response: any = await DAO.aggregate_data(Models.Products, query, options)
        return response

    }
    catch (err) {
        throw err;
    }
}

const make_products = async (query: any, options: any) => {
    try {

        let response: any = await DAO.aggregate_data(Models.Products, query, options)
        return response

    }
    catch (err) {
        throw err;
    }
}

const get_product_detail = async (query: any, options: any) => {
    try {

        let projection = { __v: 0 }
        let populate = [
            { path: 'brand_id', select: 'name' },
            { path: 'subcategory_id', select: 'name' },
            { path: "sub_subcategory_id", select: 'name' },
            { path: 'product_details', select: 'key value' },
            // { path: 'deliverable_cities', select: 'city_name' }
        ]
        let respone = await DAO.populate_data(Models.Products, query, projection, options, populate)
        // console.log("------RESPONSE-------",respone)
        return respone

    }
    catch (err) {
        throw err;
    }
}

const fetch_Orders_data = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: "product", select: "_id name price images  discount_price" },
            { path: "user_id", select: "name profile_pic" },
            { path: "address_id", select: "" }
        ];
        let respo: any = await DAO.populate_data(Models.Orders, query, projection, options, populate);
        //   console.log("RESPO ", respo)
        return respo;
    } catch (err) {
        throw err;
    }
};

const fetch_reviews_data = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: "user_id", select: "name profile_pic" },
        ];
        let respo: any = await DAO.populate_data(Models.Reviews, query, projection, options, populate);
        //   console.log("RESPO ", respo)
        return respo;
    } catch (err) {
        throw err;
    }
};

const make_category_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }

        let response = await DAO.get_data(Models.Category, query, projection, options)
        return response
    } catch (err) {
        throw (err)
    }
}

const make_subcategory_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }
        let populate = [
            { path: 'category_id', select: 'name' }
        ]
        let response = await DAO.populate_data(Models.SubCategory, query, projection, options, populate)
        return response
    } catch (err) {
        throw (err)
    }
}


const make_product_type_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }
        let populate = [
            { path: 'subcategory_id', select: 'name' }
        ]
        let response = await DAO.populate_data(Models.Sub_subcategories, query, projection, options, populate)
        return response
    } catch (err) {
        throw (err)
    }
}

const make_brand_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }
        let populate = [
            { path: 'product_id', select: ' ' }

        ]

        let response = await DAO.populate_data(Models.Brands, query, projection, options, populate)
        return response
    } catch (err) {
        throw (err)
    }
}
const make_banners_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }

        let response = await DAO.get_data(Models.Banners, query, projection, options)
        return response
    } catch (err) {
        throw (err)
    }
}



const save_categories = async (data: any) => {
    try {
        let { name } = data
        let set_data: any = {
            name: name,
            created_at: +new Date()
        }
        let response = await DAO.save_data(Models.Category, set_data)
        return response
    } catch (err) {
        throw (err)
    }
}

const save_sub_categories = async (data: any) => {
    try {
        let { name, category_id } = data
        let set_data: any = {
            name: name,
            category_id: category_id,
            is_deleted: false,
            created_at: +new Date()
        }
        let response = await DAO.save_data(Models.SubCategory, set_data)
        return response
    } catch (err) {
        throw (err)
    }
}

const add_sub_subcategories = async (data: any) => {
    try {
        let { name, subcategory_id } = data
        let set_data: any = {
            name: name,
            subcategory_id: subcategory_id,
            is_deleted: false,
            created_at: +new Date()
        }
        let response = await DAO.save_data(Models.Sub_subcategories, set_data)
        return response
    } catch (err) {
        throw (err)
    }
}

const save_brands = async (data: any) => {
    try {
        let { name } = data
        let set_data: any = {
            name: name,
            created_at: +new Date()
        }
        let response = await DAO.save_data(Models.Brands, set_data)
        return response
    } catch (err) {
        throw (err)
    }
}

const save_banners = async (data: any) => {
    try {
        let { images, description, image_place } = data
        let set_data: any = {
            images: images,
            description: description,
            image_place: image_place,
            created_at: +new Date()
        }

        let response = await DAO.save_data(Models.Banners, set_data)
        return response

    } catch (err) {
        throw (err)
    }
}

const save_deals = async (data: any) => {
    try {
        let { image, subcategory_id, title, sub_title, price_description } = data
        let set_data: any = {
            image: image,
            subcategory_id: subcategory_id,
            title: title,
            sub_title: sub_title,
            price_description: price_description,
            created_at: +new Date()
        }
        let response = await DAO.save_data(Models.Deals_of_the_day, set_data)
        return response
    } catch (err) {
        throw (err)
    }
}

const save_hot_deals = async (data: any) => {
    try {
        let { image, subcategory_id, title, sub_title, price_description } = data
        let set_data: any = {
            image: image,
            subcategory_id: subcategory_id,
            title: title,
            sub_title: sub_title,
            price_description: price_description,
            created_at: +new Date()
        }
        let response = await DAO.save_data(Models.Hot_deals, set_data)
        return response
    } catch (err) {
        throw (err)
    }
}
const save_fashion_deals = async (data: any) => {
    try {
        let { image, subcategory_id, brand_id, title, sub_title, price_description } = data
        let set_data: any = {
            image: image,
            subcategory_id: subcategory_id,
            brand_id: brand_id,
            title: title,
            sub_title: sub_title,
            price_description: price_description,
            created_at: +new Date(),
        }
        let response = await DAO.save_data(Models.FashionDeals, set_data)
        return response
    } catch (err) {
        throw (err)
    }
}
const fetch_users = async (query: any) => {
    try {

        let projection = { email: 1, _id: 1 }
        let options = { lean: true, sort: { _id: -1 } }
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options)
        // console.log(fetch_data)

        let user_ids: any = []
        if (fetch_data.length) {
            for (let value of fetch_data) {
                user_ids.push(value._id)
                // user_ids.push(value.email)
            }
        }
        // console.log("user_ids --> ", user_ids)

        let user_emails: any = []
        if (fetch_data.length) {
            for (let value of fetch_data) {
                // user_ids.push(value._id)
                user_emails.push(value.email)
            }
        }
        // console.log("user email s--> ", user_emails)
        return user_ids

    }
    catch (err) {
        throw err;
    }
}

const fetch_sellers = async (query: any) => {
    try {
        let projection = { email: 1, _id: 1 }
        let options = { lean: true, sort: { _id: -1 } }
        let fetch_data: any = await DAO.get_data(Models.Sellers, query, projection, options)
        // console.log(fetch_data)

        let user_ids: any = []
        if (fetch_data.length) {
            for (let value of fetch_data) {
                user_ids.push(value._id)
                // user_ids.push(value.email)
            }
        }
        // console.log("user_ids --> ", user_ids)

        let user_emails: any = []
        if (fetch_data.length) {
            for (let value of fetch_data) {
                // user_ids.push(value._id)
                user_emails.push(value.email)
            }
        }
        // console.log("user email s--> ", user_emails)
        return user_ids

    }
    catch (err) {
        throw err;
    }
}

const fetch_users_fcms = async (query: any) => {
    try {
        let projection = { email: 1, _id: 1 }
        let options = { lean: true, sort: { _id: -1 } }
        let fetch_data: any = await DAO.get_data(Models.Sessions, query, projection, options)
        // console.log(fetch_data)

        // let user_fcms: any = []
        // if (fetch_data.length) {
        //     for (let value of fetch_data) {
        //         user_fcms.push(value.fcm_token);
        //         // user_ids.push(value.email)
        //     }
        // }
        // console.log("user_ids --> ", user_ids)

        // let user_emails: any = []
        // if (fetch_data.length) {
        //     for (let value of fetch_data) {
        //         // user_ids.push(value._id)
        //         user_emails.push(value.email)
        //     }
        // }
        // console.log("user email s--> ", user_emails)
        return fetch_data;

    }
    catch (err) {
        throw err;
    }
}
const fetch_sellers_fcms = async (query: any) => {
    try {
        let projection = { email: 1, _id: 1 }
        let options = { lean: true, sort: { _id: -1 } }
        let fetch_data: any = await DAO.get_data(Models.Sessions, query, projection, options)
        // console.log(fetch_data)

        let user_fcms: any = []
        if (fetch_data.length) {
            for (let value of fetch_data) {
                user_fcms.push(value.fcm_token);
                // user_ids.push(value.email)
            }
        }
        // console.log("user_ids --> ", user_ids)

        // let user_emails: any = []
        // if (fetch_data.length) {
        //     for (let value of fetch_data) {
        //         // user_ids.push(value._id)
        //         user_emails.push(value.email)
        //     }
        // }
        // console.log("user email s--> ", user_emails)
        return user_fcms;

    }
    catch (err) {
        throw err;
    }
}


const fetch_users_emails = async (query: any) => {
    try {

        let projection = { email: 1, _id: 1 }
        let options = { lean: true, sort: { _id: -1 } }
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options)
        // console.log(fetch_data)


        let user_emails: any = []
        if (fetch_data.length) {
            for (let value of fetch_data) {
                // user_ids.push(value._id)
                user_emails.push(value.email)
            }
        }
        console.log("user email s--> ", user_emails)
        return user_emails

    }
    catch (err) {
        throw err;
    }
}


const fetch_sellers_emails = async (query: any) => {
    try {

        let projection = { email: 1, _id: 1 }
        let options = { lean: true, sort: { _id: -1 } }
        let fetch_data: any = await DAO.get_data(Models.Sellers, query, projection, options)
        // console.log(fetch_data)


        let seller_emails: any = []
        if (fetch_data.length) {
            for (let value of fetch_data) {
                // user_ids.push(value._id)
                seller_emails.push(value.email);
            }
        }
        console.log("seller_emails email s--> ", seller_emails);
        return seller_emails;

    }
    catch (err) {
        throw err;
    }
}

const fetch_user = async (query: any) => {
    try {

        let projection = { __v: 0 }
        let options = { lean: true, sort: { _id: -1 } }
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options)
        // console.log(fetch_data)

        // let user_ids: any = []
        // if (fetch_data.length) {
        //     for (let value of fetch_data) {
        //         user_ids.push(value._id)
        //         user_ids.push(value.email)
        //     }
        // }

        return fetch_data

    }
    catch (err) {
        throw err;
    }
}

const fetch_seller = async (query: any) => {
    try {

        let projection = { __v: 0 }
        let options = { lean: true, sort: { _id: -1 } }
        let fetch_data: any = await DAO.get_data(Models.Sellers, query, projection, options)
        // console.log(fetch_data)

        // let user_ids: any = []
        // if (fetch_data.length) {
        //     for (let value of fetch_data) {
        //         user_ids.push(value._id)
        //         user_ids.push(value.email)
        //     }
        // }

        return fetch_data

    }
    catch (err) {
        throw err;
    }
}



const fetch_users_token = async (user_id: string) => {
    try {

        let query = { user_id: user_id, fcm_token: { $ne: null } }
        let projection = { __v: 0 }
        let options = { lean: true }
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options)
        return fetch_data

    }
    catch (err) {
        throw err;
    }
}

const fetch_users_fcm_token = async (user_id: string) => {
    try {

        let query = { user_id: user_id, fcm_token: { $nin: [null,''] } }
        let projection = { __v: 0 }
        let options = { lean: true }
        let fetch_data: any = await DAO.get_data(Models.Sessions, query, projection, options)
        return fetch_data

    }
    catch (err) {
        throw err;
    }
}

const fetch_sellers_fcm_token = async (user_id: string) => {
    try {

        let query = { seller_id: user_id, fcm_token: { $nin: [null,''] } }
        let projection = { __v: 0 }
        let options = { lean: true }
        let fetch_data: any = await DAO.get_data(Models.Sessions, query, projection, options)
        return fetch_data

    }
    catch (err) {
        throw err;
    }
}


const send_broadcast_email = async (data: any) => {
    try {
        console.log("broadcast req.body ---- ", data);
        let { send_to, user_ids, subject, message,language } = data
        let default_title:any;
        if(language == 'ENGLISH'){
            default_title = "Email Received";
        }else {
            default_title = "رسالة الكترونية تلقتها";
        }

        let users: any;
        let sellers:any;

        if (send_to == 1) {
            let query = { is_deleted: false }
            users = await fetch_user(query)
            sellers = await fetch_seller(query);
            if (users && users.length) {
                for (let value of users) {
                    let { email } = value
                    // console.log("value ", value)
                    let data_to_save = {
                        user_id: value._id,
                        title: default_title,
                        message: message,
                        type: 'NEW_PRODUCTS_ADDED',
                        created_at: +new Date()
                    }
                    await DAO.save_data(Models.Notifications, data_to_save)

                    // fetch device token
                    let user_token_data = await fetch_users_fcm_token(value._id)
                    // await send_push(user_token_data, data_to_save)
                    console.log(' ---- sent to all users ---')
                    await send_email(email, subject, message)
                }
            }
            if (sellers && sellers.length) {
              for (let value of sellers) {
                let { email } = value;
                // console.log("value ", value)
                let data_to_save = {
                  seller_id: value._id,
                  title: default_title,
                  message: message,
                  type: "NEW_PRODUCTS_ADDED",
                  created_at: +new Date(),
                };
                await DAO.save_data(Models.Notifications, data_to_save);
                console.log(" ---- sent to all sellers ---");
                await send_email(email, subject, message);
              }
            }
        }
        else {
            let query = { _id: { $in: user_ids }, is_deleted: false }
            users = await fetch_user(query)
            sellers = await fetch_seller(query);
            // console.log("Get Data: ",users)
            if (users && users.length) {
                for (let value of users) {
                    let { email } = value
                    // console.log("email ", email)
                    let data_to_save = {
                        user_id: value._id,
                        title: default_title,
                        message: message,
                        type: 'NEW_PRODUCTS_ADDED',
                        created_at: +new Date()
                    }
                    await DAO.save_data(Models.Notifications, data_to_save)

                    // fetch device token
                    let user_token_data = await fetch_users_fcm_token(value._id)
                    // await send_push(user_token_data, data_to_save)

                    await send_email(email, subject, message)
                }
            }
             if (sellers && sellers.length) {
                for (let value of sellers) {
                    let { email } = value
                    // console.log("email ", email)
                    let data_to_save = {
                        seller_id: value._id,
                        title: default_title,
                        message: message,
                        type: 'NEW_PRODUCTS_ADDED',
                        created_at: +new Date()
                    }
                    await DAO.save_data(Models.Notifications, data_to_save)
                    await send_email(email, subject, message)
                }
            }
        }
    }
    catch (err) {
        throw err;
    }
}


const send_broadcast_push = async (data: any) => {
    try {

        let { send_to, user_ids, subject, message,language } = data;
        
        let default_title: any;
        if (language == "ENGLISH") {
          default_title = "New Notification Received";
        } else {
          default_title = "تم استلام إشعار جديد";
        }

        let users: any;
        let sellers: any;
        if (send_to == 1) {
            // let query = { type: { $in: ['USER'] } , fcm_token : { $nin: ['',null]}}
            let query = { is_deleted: false }
            users = await fetch_users(query);
            sellers = await fetch_sellers(query);
        }
        else {
            let query = { _id: { $in: user_ids }, is_deleted: false }
            console.log('query --- notification ----- ', query)
            users = await fetch_users(query)
            sellers = await fetch_sellers(query)
        }

        if (users && users.length) {
            for (let value of users) {
                let data_to_save = {
                    user_id: value._id,
                    title: default_title,
                    message: message,
                    type: 'NEW_NOTIFICATION',
                    created_at: +new Date()
                }
                await DAO.save_data(Models.Notifications, data_to_save)

                // fetch device token
                let user_token_data = await fetch_users_fcm_token(value)
                await send_push(user_token_data, data_to_save)

            }
        }

        if (sellers && sellers.length) {
            for (let value of sellers) {
                let data_to_save = {
                  seller_id: value._id,
                  title: default_title,
                  message: message,
                  type: "NEW_NOTIFICATION",
                  created_at: +new Date(),
                };
                await DAO.save_data(Models.Notifications, data_to_save)

                // fetch device token
                let user_token_data = await fetch_sellers_fcm_token(value);
                await send_push(user_token_data, data_to_save)

            }
        }


    }
    catch (err) {
        throw err;
    }
}


const send_push = async (data: any, notification_data: any) => {
    try {

        if (data.length) {
            for (let value of data) {
                let { fcm_token } = value
                if (fcm_token != undefined) {
                    await send_notification(notification_data, fcm_token)
                }
            }
        }

    }
    catch (err) {
        throw err;
    }
}

const verify_seller_info = async (query: any) => {
    try {

        let projection = { __v: 0 }
        let options = { lean: true }
        let fetch_data = await DAO.get_data(Models.Sellers, query, projection, options)
        // console.log(fetch_data)
        return fetch_data

    }
    catch (err) {
        throw err;
    }
}

const set_seller_data = async (data: any) => {
    try {

        let { name, email, image, country_code, phone_number, password } = data

        // bycryt password
        let hassed_password = await helpers.bcrypt_password(password)

        // fetch otp


        let data_to_save: any = {
            name: name,
            email: email.toLowerCase(),
            country_code: country_code,
            phone_number: phone_number,
            password: hassed_password,
            image: image,
            created_at: +new Date()
        }

        let response: any = await DAO.save_data(Models.Sellers, data_to_save)
        return response
    }
    catch (err) {
        throw err;
    }
}

const generate_seller_token = async (_id: string, req_data: any, device_type:any) => {
    try {
        let token_data = {
            _id: _id,
            scope: seller_scope,
            collection: Models.Sellers,
            token_gen_at: +new Date(),
        };
        let access_token: any = await generate_token(token_data)
        let response = await save_session_data_seller(access_token, token_data, req_data,device_type)
        return response;
    } catch (err) {
        throw err;
    }
};


const save_session_data_seller = async (access_token: string, token_data: any, req_data: any,device_type:any) => {
    try {
        let { _id: seller_id, token_gen_at } = token_data;

        let set_data: any = {
            type: "SELLER",
            seller_id: seller_id,
            access_token: access_token,
            token_gen_at: token_gen_at,
            created_at: +new Date(),
        };
        if(device_type != null || device_type != undefined){
            set_data.device_type = device_type
        }
        let response = await DAO.save_data(Models.Sessions, set_data);

        return response;
    } catch (err) {
        throw err;
    }
};

const make_seller_response = async (data: any, language: string) => {
    try {

        let { seller_id, access_token, token_gen_at } = data;
        let query = { _id: seller_id };
        let projection = {
            __v: 0,
            is_deleted: 0,
            unique_code: 0,
            fp_otp: 0,
            fp_otp_verified: 0,
            password: 0,
            is_blocked: 0
        };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Sellers, query, projection, options);
        if (fetch_data.length) {
            fetch_data[0].access_token = access_token;
            fetch_data[0].token_gen_at = token_gen_at;
            return fetch_data[0];
        }
        else {
            throw await handle_custom_error("UNAUTHORIZED", language);
        }
    }
    catch (err) {
        throw err;
    }
}


const fetch_seller_data = async (query: any, options: any) => {
    try {

        let projection = { password: 0, __v: 0 }
        let response = await DAO.get_data(Models.Sellers, query, projection, options)
        return response

    }
    catch (err) {
        throw err;
    }
}

const edit_coupon = async (data: any) => {
    try {

        let set_data: any = {}
        if (data.name) { set_data.name = data.name }
        if (data.start_date) { set_data.start_date = data.start_date }
        if (data.end_date) { set_data.end_date = data.end_date }
        if (data.coupon_type) {
            set_data.coupon_type = data.coupon_type
            if (data.coupon_type == 'FIXED') {
                set_data.price = data.price
                set_data.max_discount = 0
            } else {
                set_data.max_discount = data.max_discount
                set_data.price = 0
            }
        }
        // if (data.price) { set_data.price = data.price }
        // if (data.max_discount) { set_data.max_discount = data.max_discount }
        // console.log("SET DATA --> ", set_data)
        return set_data

    }
    catch (err) {
        throw err;
    }
}
const edit_language = async (data: any) => {
    try {

        let set_data: any = {}
        if (data.key) { set_data.key = data.key }
        if (data.english) { set_data.english = data.english }
        if (data.arabic) { set_data.arabic = data.arabic }
        return set_data

    }
    catch (err) {
        throw err;
    }
}

const edit_faqs = async (data: any) => {
    try {

        let set_data: any = {}
        if (data.question) { set_data.question = data.question }
        if (data.answer) { set_data.answer = data.answer }

        return set_data
    }
    catch (err) {
        throw err;
    }
}
const get_variants_detail = async (query: any, options: any) => {
    try {

        let projection = { __v: 0 }
        // let populate = [
        //     { path:"product_id", select:"name"}
        // ]
        let respone = await DAO.get_data(Models.Product_Variations, query, projection, options)
        // console.log(respone)
        return respone

    }
    catch (err) {
        throw err;
    }
}

const make_deals_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }

        let response = await DAO.get_data(Models.Deals_of_the_day, query, projection, options)
        return response
    } catch (err) {
        throw (err)
    }
}

const get_deals_detail = async (query: any, options: any) => {
    try {

        let projection = { __v: 0 }
        let populate = [
            { path: 'subcategory_id', select: '' },
        ]
        let respone = await DAO.populate_data(Models.Deals_of_the_day, query, projection, options, populate)
        // console.log("------RESPONSE-------",respone)
        return respone

    }
    catch (err) {
        throw err;
    }
}

const make_hot_deals_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }

        let response = await DAO.get_data(Models.Hot_deals, query, projection, options)
        return response
    } catch (err) {
        throw (err)
    }
}

const get_hotdeals_detail = async (query: any, options: any) => {
    try {

        let projection = { __v: 0 }
        let populate = [
            { path: 'subcategory_id', select: 'name' },
        ]
        let respone = await DAO.populate_data(Models.Hot_deals, query, projection, options, populate)
        // console.log("------RESPONSE-------",respone)
        return respone

    }
    catch (err) {
        throw err;
    }
}

const get_fashiondeals_detail = async (query: any, options: any) => {
    try {

        let projection = { __v: 0 }
        let populate = [
            { path: 'brand_id', select: 'name' },
        ]
        let respone = await DAO.populate_data(Models.FashionDeals, query, projection, options, populate)
        // console.log("------RESPONSE-------",respone)
        return respone

    }
    catch (err) {
        throw err;
    }
}

const make_fashion_deals_response = async (query: any, options: any) => {
    try {
        let projection = { __v: 0 }

        let response = await DAO.get_data(Models.FashionDeals, query, projection, options)
        return response
    } catch (err) {
        throw (err)
    }
}

const save_parcel = async (data: any) => {
    try {
        let { order_id, length, width, height, distance_unit, weight, mass_unit } = data
        let set_data: any = {
            order_id: order_id,
            length: length,
            width: width,
            height: height,
            distance_unit: distance_unit,
            weight: weight,
            mass_unit: mass_unit
        }
        let response: any = await DAO.save_data(Models.Parcel, set_data)
        return response
    } catch (err) {
        throw (err)
    }
}


const getNotifications = async (admin_id:string, req_data:any) => {
    try {
        let { pagination, limit} = req_data;
        let options = await helpers.set_options(pagination,limit)
        let projection = {admin_id:1, read_by_admin:1, clear_for_admin:1,order_product_id:1, order_id:1,title:1, type:1, message:1,created_at:1,  }

        let query = { admin_id :admin_id, read_by_admin:false, clear_for_admin:false};
        let unread_notifications = await DAO.get_data(Models.Notifications, query, projection, options)

        let query1 = { admin_id :admin_id, read_by_admin:true, clear_for_admin:false};
        let read_notifications = await DAO.get_data(Models.Notifications, query1, projection, options)

        //unreead count 
        let unread_count = await DAO.count_data(Models.Notifications, query)

        let response: any = {
            unread_count:unread_count,
            unread_notifications: unread_notifications,
            read_notifications:read_notifications,
        };
        return response
    }
    catch (err) {
        throw err;
    }
}

const markReadNotifications = async (req:any) =>{
    try{
      let { language } = req.query;
      let { _id: admin_id } = req.user_data;
      let qury = { admin_id: admin_id, read_by_admin: false };
      let options = {lean:true}
      let projection = {  __v: 0 }
      let update: any = {
        read_by_admin: true,
      };
      let resp:any = await DAO.get_data(Models.Notifications,qury,projection,options)
      if(resp && resp.length){
        // for(let i=0; i<resp.length;i++){
        //   let query1 = { _id: resp[i]._id };
        //   await DAO.find_and_update(Models.Notifications,query1, update,options)
        // }
        await DAO.update_many(Models.Notifications, qury, update);
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

const clearNotifications = async (req:any) =>{
    try{
      let { language } = req.query;
      let { _id: admin_id } = req.user_data;
      let qury = { admin_id: admin_id, clear_for_admin: false };
      let options = {lean:true}
      let projection = {  __v: 0 }
      let update: any = {
        clear_for_admin: true,
      };
      let resp:any = await DAO.get_data(Models.Notifications,qury,projection,options)
      if(resp && resp.length){
        await DAO.update_many(Models.Notifications, qury, update);
        // for(let i=0; i<resp.length;i++){
        //   let query1 = { _id:resp[i]._id }
        //   await DAO.find_and_update(Models.Notifications,query1, update,options)
        // }
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

const ReadNotification = async (req:any) =>{
    try{
      let { _id,language } = req.params;
      let { _id: admin_id } = req.user_data;
      let query = { _id: _id, admin_id: admin_id };
      let options = { new:true }
      let projection = {  __v: 0 }
      let update:any = {
        read_by_admin:true
      }
      let response:any = await DAO.find_and_update(Models.Notifications,query, update,options)
      // let response:any = await DAO.get_data(Models.Notifications,query,projection,options)
      let data = { message: "Notification Read" };
      return data;
    }catch(err){
      throw err;
    }
}

const listing_users_sellers = async (req: any) => {
  try {
    let {  language, search } = req.query;
    let { _id: admin_id } = req.user_data;
    let query1 = [
        await list_orders.match_delete(),
        await list_orders.set_type(),
        await list_orders.filter_search(req.query)
    ];
    
    let query2 = [
       await list_orders.match_delete(),
       await list_orders.set_seller_type(),
       await list_orders.filter_search(req.query),
    ];
    let options = { new: true };
    let projection = { __v: 0 };
    
    let users_list: any = await DAO.aggregate_data(Models.Users,query1,options);
    let sellers_list:any = await DAO.aggregate_data(Models.Sellers,query2,options)
    let data = [ ...users_list, ...sellers_list];
    return {data:data};
  } catch (err) {
    throw err;
  }
};

const saveMainKey = async (req: any) => {
    try {
        let { name , type} = req.body;
        let save_data = { name: name, type:type };
        let data = await DAO.save_data(Models.MainKeys,save_data)
      
      return {message:'Key Saved',data:data};
    } catch (err) {
      throw err;
    }
  };

  const getMainKeys = async (req: any) => {
    try {
        let { search , type } = req.query;
        let query:any  = { type : type};
        if (search != undefined) {
            query = [
                { name: { $regex: search, $options: "i" } }
            ];
        }
        let projection = { __v:0 } , options = {lean:true}
        let data = await DAO.get_data(Models.MainKeys,query,projection, options)
      
      return data;
    } catch (err) {
      throw err;
    }
  };

  const saveKeyValue = async (req: any) => {
    try {
        let { _id, key, value, language } = req.body;
        let save_data = { main_key_id:_id,key:key.trim(), value:value.trim(),language :language};
        let data = await DAO.save_data(Models.KeyValues,save_data)
      
      return { message:'Value Saved',data:data };
    } catch (err) {
      throw err;
    }
  };

  const editKeyValue = async (req: any) => {
    try {
        let { _id } = req.params;
        let { key, value, language } = req.body;
        let query:any  = { _id:_id };
        let options = {new:true}
        let update:any = {};

        if(key) { update.key =  key.trim() };
        if(value) { update.value =  value.trim() };
        if(language) { update.language =  language };
        console.log('updated key-value', update);
        await DAO.find_and_update(Models.KeyValues,query,update, options)
        let projection:any = { key:1, value:1,language:1 }
        let response =  await DAO.get_data(Models.KeyValues,query,projection, {lean:true}) 
      
        return {message:'Edit successfully',data:response[0]};
    } catch (err) {
      throw err;
    }
  };

  const getAllKeys = async (req: any) => {
    try {
        let { _id } = req.params;
        let query:any  = { _id:_id };
        console.log('query' ,query);
        let response:any = {};
        let projection = { __v:0 } , options = {lean:true}
        let data:any = await DAO.get_data(Models.MainKeys,query,projection, options)
        if(data.length > 0) {
            let query_value:any = { main_key_id:_id , language:'ENGLISH'}
            let projection:any = {key:1, value:1,language:1}
            let English:any =  await DAO.get_data(Models.KeyValues,query_value,projection,{lean:true})
            response.English = English

            let query_value1:any = { main_key_id:_id , language:'ARABIC'}
            let Arabic =  await DAO.get_data(Models.KeyValues,query_value1,projection,{lean:true})
            response.Arabic = Arabic
        }
      
      return {data:response};
    } catch (err) {
      throw err;
    }
  };

export {
  generate_admin_token,
  fetch_admin_token,
  save_session_data,
  update_language,
  make_admin_response,
  block_delete_data,
  verify_unverify,
  activate_deactivate,
  fetch_total_count,
  fetch_recent_users,
  fetch_recent_products,
  total_earnings,
  total_reviews,
  total_ratings,
  generate_user_token,
  make_user_response,
  fetch_user_data,
  check_content,
  verify_admin_info,
  // set_staff_data,
  make_products_response,
  get_product_detail,
  fetch_Orders_data,
  fetch_reviews_data,
  send_broadcast_email,
  send_broadcast_push,
  save_categories,
  make_category_response,
  make_subcategory_response,
  make_product_type_response,
  save_sub_categories,
  add_sub_subcategories,
  save_brands,
  make_brand_response,
  save_banners,
  make_banners_response,
  verify_seller_info,
  set_seller_data,
  generate_seller_token,
  save_session_data_seller,
  make_seller_response,
  fetch_seller_data,
  make_products,
  save_deals,
  save_hot_deals,
  save_fashion_deals,
  edit_coupon,
  save_staff_data,
  edit_faqs,
  get_variants_detail,
  edit_language,
  make_deals_response,
  get_deals_detail,
  make_hot_deals_response,
  get_hotdeals_detail,
  get_fashiondeals_detail,
  make_fashion_deals_response,
  save_parcel,
  fetch_sellers,
  fetch_users_fcm_token,
  fetch_sellers_fcm_token,
  getNotifications,
  markReadNotifications,
  clearNotifications,
  ReadNotification,
  listing_users_sellers,
  fetch_sellers_emails,
  fetch_seller,
  saveMainKey,
  getMainKeys,
  saveKeyValue,
  getAllKeys,
  editKeyValue
};