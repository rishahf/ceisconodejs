import express, { response } from "express";
import * as DAO from "../../DAO/index";
import * as Models from "../../models/index";
import * as seller_service from "./seller_service";
import * as seller_helper from "./seller_helper";
import * as email_services from "./email_services";
import * as email_seller from "./email_seller";
import { send_email } from "../../middlewares";
import * as search_products from './search_products'
import { product_add_module, product_edit_module } from './product_module';
import { handle_return, handle_success, handle_catch, handle_custom_error, helpers } from "../../middlewares/index";

const shippo = require('shippo')(process.env.SHIPPO_TOKEN);


// const seller_signup = async (req: express.Request, res: express.Response) => {
//     try {
//         let { email, password, phone_number, language } = req.body;
//         let device_type: any = req.headers["user-agent"];
//         // console.log("DEVICE TYPE  ----***** ----- ****  --- ", device_type);
//         // verify email address
//         let query_email = { email: email.toLowerCase() };
//         let fetch_data: any = await seller_service.verify_seller_info(query_email);

//         if (fetch_data.length) {
//             throw await handle_custom_error("EMAIL_ALREADY_EXISTS", language);
//         } else {
//             // verify phone_no
//             let query_phone_no = { phone_number: phone_number };
//             let verify_data: any = await seller_service.verify_seller_info(query_phone_no);
//             if (verify_data.length) {
//                 throw await handle_custom_error("PHONE_NO_ALREADY_EXISTS", language);
//             } else {
//                 // create new user
//                 let create_user = await seller_service.set_seller_data(req.body);

//                 let { _id } = create_user;

//                 // generate access token
//                 let generate_token: any = await seller_service.generate_seller_token(_id, req.body, device_type);

//                 // fetch user response
//                 let response = await seller_service.make_seller_response(generate_token, language);
//                 // console.log("seller-response--> ", response);

//                 // send welcome email to user
//                 await email_seller.send_welcome_mail(create_user, password);

//                 // return response
//                 handle_success(res, response);
//             }
//         }
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

const login = async (req: express.Request, res: express.Response) => {
    try {

        let { email, password: input_password, language } = req.body;
        let device_type:any = req.headers["user-agent"];
        // console.log("DEVICE TYPE  ----***** ----- ****  --- ", device_type);
        // console.log('body ', req.body)
        let query = {
            email: email,
            // is_deleted: false
        };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Sellers, query, projection, options);

        if (fetch_data.length) {
            let { _id, password, is_blocked, is_deleted,account_status } = fetch_data[0];
            if (is_blocked == true) {
              throw await handle_custom_error("ACCOUNT_BLOCKED", language);
            } else if (is_deleted == true) {
              throw await handle_custom_error("ACCOUNT_DELETED", language);
            } else if (account_status == "DEACTIVATED") {
              throw await handle_custom_error("ACCOUNT_DEACTIVATED", language);
            } else {
              let decrypt = await helpers.decrypt_password(
                input_password,
                password
              );
              if (decrypt != true) {
                throw await handle_custom_error("INCORRECT_PASSWORD", language);
              } else {

                let query_ss = { user_id:_id, device_type:device_type} 
                let session_data:any  = await DAO.get_data(Models.Sessions,query_ss,projection,options)
                console.log('query_ss -- ', query_ss )
                // console.log('ssession data ----  ', session_data);
                    
                if(session_data && session_data.length){
                            await DAO.remove_many(Models.Sessions,query_ss)
                }

                // generate token
                let generate_token = await seller_service.generate_seller_token(_id,req.body,device_type);
                let response = await seller_service.make_seller_response(generate_token,language);
                // return response
                handle_success(res, response);
              }
            }
        }
        else {
            throw await handle_custom_error("EMAIL_NOT_REGISTERED", language);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const email_verification = async (req: any, res: express.Response) => {
    try {
        let { otp: input_otp, language } = req.body;
        let { _id, email_otp } = req.user_data;
        let session_data = req.session_data;
        console.log('match seller -- otp -- ', email_otp, 'entered - ', input_otp)
        console.log('match seller 1 --- ', email_otp == input_otp)
        if (parseInt(email_otp) == parseInt(input_otp)) {
            let query = { _id: _id };
            let update = { email_otp:0,email_verified: true };
            let options = { new: true };
            await DAO.find_and_update(Models.Sellers, query, update, options);
            let response = await seller_service.make_seller_response(session_data, language);
            handle_success(res, response);
        }
        else {
            throw await handle_custom_error("WRONG_OTP", language);
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const resend_email_otp = async (req: any, res: express.Response) => {
    try {
        let { email, language } = req.body;
        let query_email = { email: email.toLowerCase() };
        let fetch_data: any = await seller_service.verify_seller_info(query_email);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            let update_data = await seller_service.update_email_otp(_id);
            // let generate_token: any = await seller_service.generate_seller_token(_id, req.body);
            // let response = await seller_service.make_seller_response(generate_token, language);
            await email_services.resend_otp_mail(update_data);
            let message = 'Mail sent successfully';
            handle_success(res, message);
        }
        else {
            throw await handle_custom_error("EMAIL_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const view_my_profile = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.user_data;
        let query = { _id: _id, is_deleted: false };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = await DAO.get_data(Models.Sellers, query, projection, options);
        handle_success(res, response[0]);
    } catch (err) {
        handle_catch(res, err);
    }
};

const edit_profile = async (req: any, res: express.Response) => {
    try {

        let { _id: seller_id } = req.user_data;
        let {
            name, email,image, phone_number, country_code, company, country,
            state, city, pin_code, apartment_number, full_address,language
        } = req.body;
        // console.log('REQ_BODY ------ ', req.body)
        let query = { _id: seller_id };
        let set_data: any = {};

        if (!!name) { set_data.name = name }
        if (!!email) { 
            // set_data.email = email
            // set_data.email_verified = false
            let to_lower_case = email.toLowerCase();
            let query = { _id: { $ne: seller_id }, email: to_lower_case };
            let fetch_data: any = await verify_seller_info(query);
            if (fetch_data.length) {
              throw await handle_custom_error("EMAIL_ALREADY_EXISTS",language);
            } else {
              if (to_lower_case != email) {
                let otp = await helpers.generate_otp();
                set_data.email = to_lower_case;
                set_data.otp = otp;
                set_data.email_verified = false;
                let set_name = name !== undefined ? name : name;
                await email_services.edit_profile_mail(to_lower_case,otp,set_name);
                }
            }
         }
        if (!!image) { set_data.image = image }
        if (!!country_code) { set_data.country_code = country_code }
        if (!!phone_number) { set_data.phone_number = phone_number }

        if (!!company) { set_data.company = company }
        if (!!city) { set_data.city = city }
        if (!!state) { set_data.state = state }
        if (!!country) { set_data.country = country }
        if (!!pin_code) { set_data.pin_code = pin_code }
        if (apartment_number == '' || !!apartment_number) { 
            set_data.apartment_number = apartment_number 
        }
        if (!!full_address) { set_data.full_address = full_address }

        // console.log('set-data -------- ', set_data)

        let options = { new: true };
        let update_seller: any = await DAO.find_and_update(Models.Sellers, query, set_data, options);
        // console.log('update seller -- -- ', update_seller)

        if (!!city && !!state && !!country && pin_code && !!apartment_number) {

            let set_address: any = {
                "name": name,
                "street1": apartment_number,
                "city": city,
                "state": state,
                "zip": pin_code,
                "country": country, //iso2 country code
                "email": update_seller.email,
                "validate": true
            }
            if (!!company) { set_address.company = company }
            let address_from: any = await shippo.address.create(set_address)

            let validate_address = await shippo.address.validate(address_from.object_id);
            let update: any = { shippo_address_id: validate_address.object_id }

            let response: any = await DAO.find_and_update(Models.Sellers, query, update, options)
            handle_success(res, response);
        }
        else {
            handle_success(res, update_seller);
        }

    }
    catch (err) {
        handle_catch(res, err);
    }
};

const verify_seller_info = async (query: any) => {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = await DAO.get_data(Models.Sellers, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
};

const change_password = async (req: any, res: express.Response) => {
    try {
        let { old_password, new_password, language } = req.body,
            { _id: seller_id } = req.user_data;

        let query = { _id: seller_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Sellers, query, projection, options);

        if (fetch_data.length) {
            let { _id, password } = fetch_data[0];
            let decrypt = await helpers.decrypt_password(old_password, password);

            if (decrypt != true) {
                throw await handle_custom_error("OLD_PASSWORD_MISMATCH", language);
            } else {
                // bycryt password
                let bycryt_password = await helpers.bcrypt_password(new_password);

                let query = { _id: _id };
                let update = { password: bycryt_password };
                let options = { new: true };

                await DAO.find_and_update(Models.Sellers, query, update, options);

                // return password
                let message = { message: "Password Changed Successfully!" };
                handle_success(res, message);
            }
        } else {
            throw await handle_custom_error("UNAUTHORIZED", language);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const forgot_password = async (req: any, res: express.Response) => {
    try {
        let { email, language } = req.body;
        let query_email = { email: email.toLowerCase() };
        let fetch_data: any = await seller_service.verify_user_info(query_email);
        if (fetch_data.length) {

            let { _id } = fetch_data[0];
            let unique_code = await helpers.gen_unique_code(Models.Sellers);
            let fp_otp = await helpers.generate_otp();

            let query = { _id: _id };
            let update = {
                unique_code: unique_code,
                fp_otp: fp_otp,
                fp_otp_verified : false
            };
            let options = { new: true };
            let update_data: any = await DAO.find_and_update(Models.Sellers, query, update, options);
            await email_services.forgot_password_mail(update_data);
            let message = "Mail sent sucessfully";
            let response = {
                message: message,
                unique_code: unique_code
            };
            handle_success(res, response);
        }
        else {
            throw await handle_custom_error("EMAIL_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const resend_fp_otp = async (req: any, res: express.Response) => {
    try {

        let { unique_code, language } = req.body;

        let query = { unique_code: unique_code };
        let projection = { __v: 0 }
        let options = { lean: true }
        let fetch_data: any = await DAO.get_data(Models.Sellers, query, projection, options)
        if (fetch_data.length) {

            let { _id } = fetch_data[0];
            // let unique_code = await helpers.gen_unique_code(Models.Sellers);
            let fp_otp = await helpers.generate_otp();

            let query = { _id: _id };
            let update = {
                // unique_code: unique_code,
                fp_otp: fp_otp,
                fp_otp_verified : false
            };
            let options = { new: true };
            let update_data: any = await DAO.find_and_update(Models.Sellers, query, update, options);
            await email_services.forgot_password_mail(update_data);
            let message = "Mail sent sucessfully";
            let response = {
                message: message,
                unique_code: unique_code
            };
            handle_success(res, response);

        } 
        else {
            throw await handle_custom_error("EMAIL_NOT_REGISTERED", language);
        }

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const verify_fp_otp = async (req: any, res: express.Response) => {
    try {

        let { unique_code, otp: input_otp, language } = req.body;

        let query = { unique_code: unique_code }
        let projection = { __v: 0 }
        let options = { lean: true }
        let response: any = await DAO.get_data(Models.Sellers, query, projection, options)
        if (response.length) {
            let { _id, fp_otp } = response[0]
            if (input_otp != fp_otp) {
                throw await handle_custom_error("WRONG_OTP", language)
            }
            else {
                let query = { _id: _id }
                let update = { fp_otp : 0, fp_otp_verified : true }
                let options = { new : true }
                await DAO.find_and_update(Models.Sellers, query, update, options)
                let response = {
                    message: "OTP verified",
                    unique_code : unique_code
                };
                handle_success(res, response);
            }
        }
        else {
            throw await handle_custom_error("WRONG_UNIQUE_CODE", language)
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
}

const set_new_password = async (req: any, res: express.Response) => {
    try {
        let { password, unique_code, language } = req.body;
        
        let query = { unique_code: unique_code }
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Sellers, query, projection, options);
        if (fetch_data.length) {
            let { _id, fp_otp_verified } = fetch_data[0];
            if (fp_otp_verified != true) {
                throw await handle_custom_error("OTP_NOT_VERIFIED", language)
            }
            else {
                let bycryt_password = await helpers.bcrypt_password(password);
                let query = { _id: _id };
                let update = {
                    password: bycryt_password,
                    unique_code : null,
                    fp_otp_verified: false
                };
                let options = { new: true };
                await DAO.find_and_update(Models.Sellers, query, update, options);
                let message = "Password Changed Sucessfully";
                let response = { message: message };
                handle_success(res, response);
            }
        }
        else {
            throw await handle_custom_error("WRONG_UNIQUE_CODE", language);
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const logout = async (req: any, res: express.Response) => {
    try {
        let { _id: _id } = req.session_data;

        let query = { type: "SELLER", _id: _id };
        // console.log("query: ", query);
        await DAO.remove_data(Models.Sessions, query);

        let message = { message: "Logout Successfull" };
        // return response
        handle_success(res, message);
    } catch (err) {
        handle_catch(res, err);
    }
};

const dashboard = async (req: any, res: express.Response) => {
    try {
        // fetch user count
        let { graph_type, timezone } = req.query;
        let { _id: seller_id } = req.user_data;

        let query = { is_deleted: false, added_by: seller_id };
        let total_products = await seller_service.fetch_total_count(Models.Products, query);

        let projection = { __v: 0 }, option = { lean: true };
        let product: any = await DAO.get_data(Models.Products, query, projection, option);

        let query_order = { product: product };
        // fetch products count
        let total_orders = await seller_service.fetch_total_count(Models.Orders, query_order);

        // fetch recent users
        let response = {
            total_products: total_products,
            total_orders: total_orders,
        };

        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

// const add_edit_products = async (req: any, res: express.Response) => {
//     try {

//         let { product_id, product_details, services, highlights, deliverable_cities } = req.body; 
//         let { _id: seller_id } = req.user_data;
//         let response: any;

//         let query = { _id: product_id }
//         let projection = { __v: 0 }
//         let options = { new: true }
//         if (product_id != undefined) {
//             let update = await seller_service.edit_products_data(req.body, product_id, deliverable_cities);
//             let response_data: any = await DAO.find_and_update(Models.Products, query, update, options);
//             let { price, discount_percantage } = response_data, new_discount_price: any, calculate_discount: any;

//             if (discount_percantage != null) {
//                 calculate_discount = (discount_percantage / 100) * price;
//                 new_discount_price = price - calculate_discount;
//                 // console.log("New discount price", new_discount_price)
//             }

//             let update_discount: any = {
//                 discount: calculate_discount,
//                 discount_price: new_discount_price,
//             };

//             response = await DAO.find_and_update(Models.Products, query, update_discount, options);

//         } 
//         else {
//             response = await seller_service.save_products(req.body, seller_id);
//             await seller_service.save_product_services(services, response._id);
//             await seller_service.save_product_highlights(highlights, response._id);
//             await seller_service.save_product_details(product_details, response._id);
//             // await seller_service.save_deliverable_locations(deliverable_cities, response._id);
//         }

//         let query_data = { _id: response._id }
//         let data_response = await DAO.get_data(Models.Products, query_data, projection, options)
//         // console.log("RESPONSE ", data_response)

//         handle_success(res, data_response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

const retrive_parcels = async (req: express.Request, res: express.Response) => {
    try {

        let { _id, pagination, limit } = req.query;

        let query: any = {}
        if (!!_id) { query._id = _id }

        let projection = { __v: 0 }
        let options = await helpers.set_options(pagination, limit)
        let Parcels = await DAO.get_data(Models.Parcel, query, projection, options)
        let total_count = await DAO.count_data(Models.Parcel, query)
        let response = {
            total_count: total_count,
            data: Parcels
        }
        handle_return(res, response)

    }
    catch (err) {
        handle_catch(res, err);
    }
}

// // const add_edit_products = async (req: any, res: express.Response) => {
// //     try {

// //         let { product_id } = req.body, response: any;
// //         if (!!product_id) {
// //             response = await product_edit_module.edit_a_product(req)
// //         }
// //         else {
// //             response = await product_add_module.add_a_product(req)
// //         }
// //         handle_success(res, response);

// //     }
// //     catch (err) {
// //         throw err;
// //     }
// // }

// const add_edit_product_services = async (req: any, res: express.Response) => {
//     try {
//         let { service_id } = req.body, response: any;

//         if (service_id != undefined) {
//             let query = { _id: service_id }

//             response = await seller_service.edit_services(req.body, query);
//         } else {
//             let { product_id, content } = req.body;
//             let set_data: any = {
//                 product_id: product_id,
//                 content: content,
//             };
//             response = await DAO.save_data(Models.ProductServices, set_data);
//             // response = await seller_service.save_product_services(req.body);
//         }

//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const add_edit_product_highlights = async (req: any, res: express.Response) => {
//     try {
//         let { highlights_id } = req.body, response: any;

//         if (highlights_id != undefined) {
//             let query = { _id: highlights_id }

//             response = await seller_service.edit_highlights(req.body, query);
//         } else {
//             let { product_id, content } = req.body;
//             let set_data: any = {
//                 product_id: product_id,
//                 content: content,
//             };
//             response = await DAO.save_data(Models.ProductHighlights, set_data);
//             // response = await seller_service.save_product_services(req.body);
//         }

//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const add_edit_productDetail = async (req: any, res: express.Response) => {
//     try {
//         let { product_detail_id } = req.body, response: any;

//         if (product_detail_id != undefined) {
//             let query = { _id: product_detail_id }

//             response = await seller_service.edit_productDetails(req.body, query);
//         } else {
//             let { key, value, product_id } = req.body;
//             let query = { product_id: product_id }
//             let total_count = await DAO.count_data(Models.ProductDetails, query);

//             let save_data: any = {
//                 key: key,
//                 value: value,
//                 product_id: product_id,
//                 unique_number: Number(total_count) + 1,
//                 created_at: +new Date(),
//             }
//             response = await DAO.save_data(Models.ProductDetails, save_data);
//         }

//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const get_Services = async (req: express.Request, res: express.Response) => {
//     try {
//         let { _id } = req.query, query: any = { _id: _id };
//         let projection = { __v: 0 }, options = { lean: true };

//         let response: any = await DAO.get_single_data(Models.ProductServices, query, projection, options);

//         // return data
//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const get_highlights = async (req: express.Request, res: express.Response) => {
//     try {
//         let { _id } = req.query, query: any = { _id: _id };
//         let projection = { __v: 0 }, options = { lean: true };

//         let response: any = await DAO.get_single_data(Models.ProductHighlights, query, projection, options);

//         // return data
//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };


// const add_edit_product_variation = async (req: any, res: express.Response) => {
//     try {
//         let { varient_id } = req.body, response: any;

//         if (varient_id != undefined) {
//             let query = { _id: varient_id }
//             // console.log("Query ", query)
//             response = await seller_service.edit_variants(req.body, query);
//         } else {
//             response = await seller_service.save_product_variants(req.body);
//         }

//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const get_variants = async (req: express.Request, res: express.Response) => {
//     try {
//         let { _id } = req.query, query: any = { _id: _id };
//         let projection = { __v: 0 }, options = { lean: true };

//         let response: any = await DAO.get_single_data(Models.Product_Variations, query, projection, options);

//         // return data
//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const list_product_variants = async (req: any, res: express.Response) => {
//     try {
//         let { product_id } = req.query;
//         let query: any = { product_id: product_id };
//         let options = { lean: true };
//         let response = await seller_service.get_variants_detail(query, options);
//         // console.log(response);
//         // return response
//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// // const products_edit = async(req:any , res:express.Response)=>{
// //     try{
// //         let{ _id } = req.body

// //         if( _id != undefined ) {
// //             let query = { _id:_id }
// //             let update = await seller_service.edit_products_data(req.body, _id )
// //             let options ={ new:true }
// //             let response = await DAO.find_and_update(Models.Products, query, update, options)
// //             console.log(response)
// //             handle_success(res,response)
// //         }

// //     }catch(err){
// //         handle_catch(res,err)
// //     }
// // }

// // const list_products = async (req: any, res: express.Response) => {
// //     try {

// //         let { _id: seller_id } = req.user_data;

// //         let query = [
// //             await search_products.match_data(seller_id),
// //             await search_products.lookup_brands(),
// //             await search_products.unwind_brands(),
// //             await search_products.lookup_subcategories(),
// //             await search_products.unwind_subcategories(),
// //             await search_products.lookup_sub_subcategories(),
// //             await search_products.unwind_sub_subcategories(),
// //             await search_products.lookup_seller(),
// //             await search_products.unwind_seller(),
// //             await search_products.filter_data(req.query),
// //             await search_products.group_data(),
// //             await search_products.sort_data(),
// //             await search_products.skip_data(req.query),
// //             await search_products.limit_data(req.query)
// //         ]
// //         let options = { lean: true }
// //         let Products = await DAO.aggregate_data(Models.Products, query, options);

// //         let query_count = [
// //             await search_products.match_data(seller_id),
// //             await search_products.lookup_brands(),
// //             await search_products.unwind_brands(),
// //             await search_products.lookup_subcategories(),
// //             await search_products.unwind_subcategories(),
// //             await search_products.lookup_sub_subcategories(),
// //             await search_products.unwind_sub_subcategories(),
// //             await search_products.lookup_seller(),
// //             await search_products.unwind_seller(),
// //             await search_products.filter_data(req.query),
// //             await search_products.group_data(),
// //             await search_products.sort_data()
// //         ]
// //         let CountProducts: any = await DAO.aggregate_data(Models.Products, query_count, options);
// //         let response = {
// //             total_count: CountProducts.length,
// //             data: Products
// //         };
// //         handle_success(res, response);

// //     }
// //     catch (err) {
// //         handle_catch(res, err);
// //     }
// // }

// const product_details = async (req: any, res: express.Response) => {
//     try {
//         let { _id } = req.query;
//         // let query: any = { _id: _id };
//         let options = { lean: true };

//         let response_product = await seller_service.get_product_by_id(_id, options);

//         let query_data = { product_id: _id }, projection = { __v: 0 }
//         let populate = [
//             { path: 'user_id', select: 'name profile_pic' },
//         ]

//         let response_reviews: any = await DAO.populate_data(Models.Reviews, query_data, projection, options, populate)
//         let count_reviews = response_reviews.length

//         let response = {
//             product: response_product[0],
//             reviews: response_reviews,
//             total_review_count: count_reviews
//         };
//         // return response
//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };



// // const get_single_product_details = async (req: any, res: express.Response) => {
// //     try {
// //         let { _id } = req.query, options = { lean: true };

// //         let query: any = [
// //             await seller_helper.match_product_id(_id),
// //             await seller_helper.lookup_data("subcategories", "$subcategory_id"),
// //             await seller_helper.unwind_data("$subcategory_id"),
// //             await seller_helper.lookup_data("sub_subcategories", "$sub_subcategory_id"),
// //             await seller_helper.unwind_data("$sub_subcategory_id"),
// //             await seller_helper.lookup_data("brands", "$brand_id"),
// //             await seller_helper.unwind_data("$brand_id"),
// //             await seller_helper.lookup_data("product_types", "$product_type_id"),
// //             await seller_helper.unwind_data("$product_type_id"),
// //             await seller_helper.lookup_product_detail("productdetails"),
// //             await seller_helper.lookup_services_highlights("product_services"),
// //             await seller_helper.lookup_services_highlights("product_highlights"),
// //             await seller_helper.lookup_common_collection("faqs_products"),
// //             await seller_helper.lookup_common_collection("product_variations"),
// //             await seller_helper.lookup_reviews_data(),
// //             // await seller_helper.unwind_review_user_data("$user_id"),
// //             await seller_helper.set_ratings(),

// //             // await seller_helper.lookup_data("deliverable_locations", "$deliverable_cities"),
// //             // await seller_helper.unwind_data("$deliverable_cities"),
// //             await seller_helper.lookup_data("sellers", "$added_by"),
// //             await seller_helper.unwind_data("$added_by"),
// //             await seller_helper.sort_data(),
// //         ];

// //         let fetch_data: any = await seller_service.make_products_response(query, options);

// //         // let fetch_sevices:any = await seller_service.get_services(_id,options)
// //         // fetch_data[0]['services'] = fetch_sevices

// //         // console.log("fetch_data", fetch_data)
// //         handle_success(res, fetch_data);
// //     } catch (err) {
// //         handle_catch(res, err);
// //     }
// // };

// const manage_products = async (req: any, res: express.Response) => {
//     try {
//         let collection = Models.Products;
//         let update_data: any = await seller_service.block_delete_data(req.body, collection);

//         let { _id } = update_data;

//         let query: any = { _id: _id };
//         let options = { lean: true };
//         let response = await seller_service.get_product_detail(query, options);

//         // return response
//         handle_success(res, response[0]);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };



// const add_edit_faqs = async (req: any, res: express.Response) => {
//     try {
//         let { _id, product_id, question, answer } = req.body, { _id: seller_id } = req.user_data, response: any;

//         if (_id != undefined) {
//             let query = { _id: _id };
//             let options = { new: true };
//             let setdata = await seller_service.edit_faqs(req.body);
//             response = await DAO.find_and_update(Models.FaqsProducts, query, setdata, options);
//         } else {
//             let query = { _id: product_id, added_by: seller_id };

//             let verifyProduct: any = await seller_service.verify_product(query);

//             if (verifyProduct.length != 0) {
//                 let set_data: any = {
//                     product_id: product_id,
//                     question: question,
//                     answer: answer,
//                 };
//                 set_data.created_at = +new Date();
//                 response = await DAO.save_data(Models.FaqsProducts, set_data);
//             } else {
//                 response = `Cannot Add FAQ to this Product`;
//             }
//         }
//         // return data
//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const get_faqs = async (req: express.Request, res: express.Response) => {
//     try {
//         let { _id } = req.query, query: any = { _id: _id };
//         let projection = { __v: 0 }, options = { lean: true };

//         let response: any = await DAO.get_single_data(Models.FaqsProducts, query, projection, options);

//         // return data
//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const list_product_faqs = async (req: express.Request, res: express.Response) => {
//     try {
//         let { _id: product_id, pagination, limit } = req.query, query: any = { product_id: product_id };

//         let projection = { __v: 0 };
//         let options = await helpers.set_options(pagination, limit);
//         let fetch_data: any = await DAO.get_data(Models.FaqsProducts, query, projection, options);

//         // fetch total count
//         let total_count = fetch_data.length;

//         let response = {
//             total_count: total_count,
//             data: fetch_data,
//         };

//         // return data
//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const delete_faqs = async (req: any, res: express.Response) => {
//     try {
//         let { _id } = req.params;
//         // console.log("_id ", _id)
//         let query = { _id: _id };

//         // console.log("QUery ", query)

//         let response: any = await DAO.remove_data(Models.FaqsProducts, query);

//         // console.log("response ", response)
//         if (response.deletedCount > 0) {
//             let data = { message: `Faq deleted successfully...` };
//             handle_success(res, data);
//         }
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// // const list_user_orders = async (req: any, res: express.Response) => {
// //   try {
// //     let { _id, pagination, limit } = req.query, { _id: seller_id } = req.user_data, fetch_data: any, total_count: any;
// //     let query_data = { added_by: seller_id }
// //     let get_products: any = await seller_service.verify_product(query_data)

// //     for (let value of get_products) {
// //       let get_id = value._id
// //       var query = { product: get_id }
// //     }

// //     let options = await helpers.set_options(pagination, limit);
// //     fetch_data = await seller_service.fetch_Orders_data(query, options);
// //     total_count = fetch_data.length;

// //     let response = {
// //       total_count: total_count,
// //       data: fetch_data,
// //     };
// //     // return data
// //     handle_success(res, response);
// //   } catch (err) {
// //     handle_catch(res, err);
// //   }
// // };

// const list_user_orders = async (req: any, res: express.Response) => {
//     try {
//         let { pagination, limit } = req.query, { _id: seller_id } = req.user_data, fetch_data: any, total_count: any;

//         let query: any = [
//             await seller_helper.lookup_User_data(),
//             await seller_helper.unwind_data("$user_id"),
//             // await seller_helper.lookup_address_data(),
//             // await seller_helper.unwind_data("$address_id"),
//             await seller_helper.lookup_orders_data("products", "$product", seller_id),
//             await seller_helper.unwind_data("$product"),
//             { $match: { "product.added_by": seller_id } },
//             await seller_helper.sort_data(),

//         ];
//         let options = await helpers.set_options(pagination, limit);

//         fetch_data = await seller_service.make_orders_response(query, options);
//         total_count = await seller_service.make_orders_response(query, { lean: true });
//         //await seller_service.fetch_total_count(Models.Orders, query);

//         let response = {
//             total_count: total_count.length,
//             data: fetch_data,
//         };

//         // return data
//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// // const list_user_order_detail = async (req: any, res: express.Response) => {
// //   try {
// //     let { _id } = req.query;

// //     let query: any = { _id: _id };
// //     let options = { lean: true };
// //     let fetch_data: any = await seller_service.fetch_order_detail(query, options);

// //     let user_id = fetch_data[0].user_id._id;
// //     let product_id = fetch_data[0].product._id;
// //     let fetch_ratings_data: any = await seller_service.list_reviews(user_id, product_id);
// // //     // return data
// //     let response = {
// //       order_data: fetch_data,
// //       ratings_data: fetch_ratings_data,
// //       // rating:
// //     };
// //     handle_success(res, response);
// //   } catch (err) {
// //     handle_catch(res, err);
// //   }
// // };

// const list_user_order_detail = async (req: any, res: express.Response) => {
//     try {
//         let { _id } = req.query, { _id: seller_id } = req.user_data;

//         let query: any = [
//             await seller_helper.match_order_id(_id),
//             await seller_helper.lookup_User_data(),
//             await seller_helper.unwind_data("$user_id"),
//             await seller_helper.lookup_address_data(),
//             await seller_helper.unwind_data("$address_id"),
//             await seller_helper.lookup_orders_data("products", "$product", seller_id),
//             await seller_helper.unwind_data("$product"),
//             { $match: { "product.added_by": seller_id } },
//             await seller_helper.lookup_user_ratings(),
//             await seller_helper.sort_data(),

//         ];
//         let options = { lean: true }
//         let response: any = await seller_service.make_orders_response(query, options);

//         handle_success(res, response[0]);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const cancel_order = async (req: any, res: express.Response) => {
//     try {
//         let { _id } = req.body;

//         let { _id: user_id } = req.user_data;

//         let response = await seller_service.order_cancellation(_id);
//         // console.log(response);
//         let data = { message: `Order Cancelled` };

//         let { product: product_id } = _id;
//         let query: any = { _id: _id };
//         let options = { lean: true };

//         let resp: any = await seller_service.fetch_Orders_data(query, options);
//         // console.log("------RESp------", resp);
//         let set_data: any = {
//             user_id: user_id,
//             product_id: product_id,
//             type: "CANCELLED_ORDER",
//             title: "cancel_order",
//             message: `Your order for ${resp[0].product.name} has been cancel successfully!`,
//         };
//         await seller_service.save_notification_data(set_data);

//         handle_success(res, data);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };

// const confirm_order = async (req: any, res: express.Response) => {
//     try {
//         let { _id } = req.body, { _id: user_id } = req.user_data;
//         // console.log(_id, " ID");

//         let response = await seller_service.order_confirmation(_id);
//         // console.log(response);
//         let data = { message: `Order Confirmed` };

//         let { product: product_id } = _id;
//         let query: any = { _id: _id };
//         let options = { lean: true };

//         let resp: any = await seller_service.fetch_Orders_data(query, options);
//         // console.log("------RESp------",resp)
//         let set_data: any = {
//             user_id: user_id,
//             product_id: product_id,
//             type: "CONFIRMED_ORDER",
//             title: "Order_confirmed",
//             message: `Your order for ${resp[0].product.name} has been confirmed successfully!`,
//         };
//         await seller_service.save_notification_data(set_data);


//         handle_success(res, data);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };



export {
    // seller_signup,
    login,
    email_verification,
    resend_email_otp,
    view_my_profile,
    edit_profile,
    change_password,
    forgot_password,
    resend_fp_otp,
    verify_fp_otp,
    set_new_password,
    logout,
    dashboard,
    retrive_parcels,
    verify_seller_info

    // add_edit_products,
    // add_edit_product_services,
    // add_edit_product_highlights,
    // add_edit_productDetail,
    // get_Services,
    // get_highlights,
    // // list_products,
    // product_details,
    // // get_single_product_details,
    // manage_products,
    // view_my_profile,
    // add_edit_faqs,
    // get_faqs,
    // list_product_faqs,
    // delete_faqs,

    // add_edit_product_variation,
    // get_variants,
    // list_product_variants,
    // list_user_orders,
    // list_user_order_detail,
    // cancel_order,
    // confirm_order,
}
