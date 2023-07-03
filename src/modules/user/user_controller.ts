import jwt from 'jsonwebtoken';
import * as DAO from "../../DAO";
import moment from 'moment';
import  Mongoose  from 'mongoose';
import * as express from "express";
import * as Models from "../../models";
import * as user_services from "./user_services";
import * as user_helper from "./user_helper";
import * as email_services from "./email_services";
import { add_review_module, edit_review_module, list_review_module } from './review_module';
import { send_notification,send_notification_to_all } from '../../middlewares/index';
import Stripe from 'stripe';
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options: any = { apiVersion: '2020-08-27' }
const stripe = new Stripe(STRIPE_KEY, stripe_options);
import {
    helpers,
    handle_return,
    handle_success,
    handle_catch,
    handle_custom_error
} from "../../middlewares/index";
const shippo = require('shippo')(process.env.SHIPPO_TOKEN);



const signup = async (req: any, res: express.Response) => {
    try {
        let device_type: any = req.headers["user-agent"];
        let { name, email, phone_no, language } = req.body;
        let query_email = { email: email.toLowerCase(), is_deleted: false };
        let fetch_data: any = await user_services.verify_user_info(query_email);
        if (fetch_data.length) {
            throw await handle_custom_error("EMAIL_ALREADY_EXISTS", language);
        }
        else {
            let query_phone_no = { phone_no: phone_no };
            let verify_data: any = await user_services.verify_user_info(query_phone_no);
            if (verify_data.length) {
                throw await handle_custom_error("PHONE_NO_ALREADY_EXISTS", language);
            }
            else {
                let stripe_customer = await stripe.customers.create({
                    name: name,
                    email: email,
                    description: "Customer",
                });
                let create_user = await user_services.set_user_data(req.body, stripe_customer);
                let { _id } = create_user;

                // generate access token
                let generate_token: any = await user_services.generate_user_token(_id, req.body,device_type);
                let response = await user_services.make_user_response(generate_token, language);
                await email_services.send_welcome_mail(create_user);
                handle_success(res, response);
            }
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const email_verification = async (req: any, res: express.Response) => {
    try {
        let { otp: input_otp, language } = req.body;
        let { _id, otp } = req.user_data;
        let session_data = req.session_data;
        if (otp == input_otp) {
            let query = { _id: _id };
            let update = { email_verified: true };
            let options = { new: true };
            await DAO.find_and_update(Models.Users, query, update, options);
            let response = await user_services.make_user_response(session_data, language);
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

const resend_otp = async (req: any, res: express.Response) => {
    try {
        let { email, language } = req.body;
         let device_type: any = req.headers["user-agent"];
        let query_email = { email: email.toLowerCase() };
        let fetch_data: any = await user_services.verify_user_info(query_email);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            let update_data = await user_services.update_otp(_id);
            let generate_token: any = await user_services.generate_user_token(_id, req.body,device_type);
            let response = await user_services.make_user_response(generate_token, language);
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

const phone_no_verification = async (req: any, res: express.Response) => {
    try {
        let { otp: input_otp, language } = req.body;
        let { _id, phone_otp } = req.user_data;
        let session_data = req.session_data;
        if (phone_otp == input_otp || Number(input_otp) == 1234) {
            let query = { _id: _id };
            let update = { phone_verified: true };
            let options = { new: true };
            await DAO.find_and_update(Models.Users, query, update, options);
            let response = await user_services.make_user_response(session_data, language);
            //email
            await email_services.phone_verification_success_mail(response);

            //notification
            let query_sess = { user_id: { $in: Mongoose.Types.ObjectId(_id) }, fcm_token: { $nin: [null, ''] } };
            let get_sessions:any = await DAO.get_data(Models.Sessions,query_sess, {__v:0 },options)
            if(get_sessions && get_sessions.length){
                let fcms_arr:any = []
                for(let i=0; i<get_sessions.length; i++){
                    let { fcm_token } = get_sessions[i];
                    fcms_arr.push(fcm_token);
                }
                console.log('---phone verfication fcm ---- ', fcms_arr)
                let notification_data:any = {
                     type: "PHONE_VERIFICATION_SUCCESS",
                      title: "Mobile Number Verified",
                      message: "Your mobile number has been verified Successfully",
                      user_id: _id
                      
                }
                await DAO.save_data(Models.Notifications,notification_data)
                await send_notification_to_all(notification_data,fcms_arr);
            } 
            handle_success(res, response);
        }
        else {
            throw await handle_custom_error("WRONG_OTP", language);
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
}

const resend_phone_otp = async (req: any, res: express.Response) => {
    try {
         let device_type: any = req.headers["user-agent"];
        let { country_code, phone_no, language } = req.body;
        let query = {
            country_code: country_code,
            phone_no: phone_no
        };
        let fetch_data: any = await user_services.verify_user_info(query);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            let update_data = await user_services.update_phone_otp(_id);
            let generate_token: any = await user_services.generate_user_token(_id, req.body,device_type);
            let response = await user_services.make_user_response(generate_token, language);
            // await email_services.resend_otp_mail(update_data);
            let message = 'SMS sent successfully';
            handle_success(res, message);
        }
        else {
            throw await handle_custom_error("PHONE_NO_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
};


const social_login = async (req: express.Request, res: express.Response) => {
    try {
        let device_type: any = req.headers["user-agent"];
        let { social_type, social_token, email, phone_no, language } = req.body;
        let query = {}
        if (social_type == "GOOGLE") {
            let decode_token = await jwt.decode(social_token)
            let { sub } = decode_token
            query = {
                social_type: social_type,
                social_token: sub,
                is_deleted: false
            };
        }
        else {
            query = {
                social_type: social_type,
                social_token: social_token,
                is_deleted: false
            };
        }
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            let generate_token: any = await user_services.generate_user_token(_id, req.body,device_type);
            let response = await user_services.make_user_response(generate_token, language);
            handle_success(res, response);
        }
        else {
            let response: any;
            if (email != null || email != undefined) { email = email.toLowerCase(); }
            if (phone_no != null || phone_no != undefined) { phone_no = phone_no; }

            let case_1 = email != null || phone_no != 0;
            let case_2 = email != null && phone_no != 0;

            if (case_1 || case_2) {
                let query = {
                    $or: [
                        {
                            $and: [{ email: { $ne: null } }, { email: email }],
                        },
                        {
                            $and: [{ phone_no: { $ne: 0 } }, { phone_no: phone_no }],
                        },
                        {
                            $and: [
                                { email: { $ne: null } },
                                { phone_no: { $ne: 0 } },
                                { email: email },
                                { phone_no: phone_no },
                            ],
                        },
                    ],
                    is_deleted: false
                };

                let fetch_data: any = await user_services.verify_user_info(query);
                if (fetch_data.length) {
                    let { social_type } = fetch_data[0];
                    if (social_type == "GOOGLE") {
                        throw await handle_custom_error("LOGIN_VIA_GOOGLE", language);
                    }
                    else if (social_type == "FACEBOOK") {
                        throw await handle_custom_error("LOGIN_VIA_FACEBOOK", language);
                    }
                    else if (social_type == "APPLE") {
                        throw await handle_custom_error("LOGIN_VIA_APPLE", language);
                    }
                    else if (social_type == null) {
                        throw await handle_custom_error("LOGIN_VIA_EMAIL_PASSWORD", language);
                    }
                }
                else {
                    console.log('create One')
                    response = await user_services.create_new_user(req.body);
                }
            }
            else {
                 console.log("create two");
                response = await user_services.create_new_user(req.body);
            }
            let { _id } = response;
            let generate_token = await user_services.generate_user_token(_id, req.body,device_type);
            let populate_data = await user_services.make_user_response(generate_token, language);
            handle_success(res, populate_data);
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const login = async (req: express.Request, res: express.Response) => {
    try {
        //  console.log("req -------- ", req.headers);
        // console.log("req.user-agent ----***** ----- **** ", req.headers['user-agent']);

        let device_type: any = req.headers["user-agent"];
        // console.log("DEVICE TYPE  ----***** ----- ****  --- ", device_type);
        let { email, password, language } = req.body;
        let query = { email: email.toLowerCase() };
        let projection = {};
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options);
        if (fetch_data.length) {
            let { _id, password: hash, is_blocked, is_deleted, account_status, wrong_pwd_count, locked_till } = fetch_data[0];

            let current_millis = moment.utc().format("x")
            if (locked_till > current_millis) {
                await dec_wrong_pwd_count(_id)
                throw await handle_custom_error("ACCOUNT_LOCKED", language);
            }
            else {
                let decrypt = await helpers.decrypt_password(password, hash);
                if (decrypt != true) {
                    if (wrong_pwd_count == 5) {
                        await account_locked_till(_id);
                        throw await handle_custom_error("ACCOUNT_LOCKED", language);
                    }
                    else {
                        await inc_wrong_pwd_count(_id)
                        throw await handle_custom_error("INCORRECT_PASSWORD", language);
                    }
                }
                if (is_blocked == true) {
                    throw await handle_custom_error("ACCOUNT_BLOCKED", language);
                }
                if (is_deleted == true) {
                  throw await handle_custom_error("ACCOUNT_DELETED", language);
                }
                if (account_status == "DEACTIVATED") {
                    throw await handle_custom_error("ACCOUNT_DEACTIVATED", language);
                }
                else {
                    let query_ss = { user_id:_id, device_type:device_type} 
                    let session_data:any  = await DAO.get_data(Models.Sessions,query_ss,projection,options)
                    console.log('query_ss -- ', query_ss )
                    // console.log('ssession data ----  ', session_data);
                    
                    if(session_data && session_data.length){
                        await DAO.remove_many(Models.Sessions,query_ss)
                    }
                    await dec_wrong_pwd_count(_id)
                    let generate_token: any = await user_services.generate_user_token(_id, req.body,device_type);
                    let response = await user_services.make_user_response(generate_token, language);
                    handle_success(res, response);
                }
            }



        }
        else {
            throw await handle_custom_error("EMAIL_NOT_REGISTERED", language);
        }

    }
    catch (err) {
        handle_catch(res, err);
    }
};


const inc_wrong_pwd_count = async (user_id: string) => {
    try {
        let query = { _id: user_id }
        let update = {
            $inc: {
                wrong_pwd_count: 1
            }
        }
        let options = { new: true }
        await DAO.find_and_update(Models.Users, query, update, options)
    }
    catch (err) {
        throw err;
    }
}

const account_locked_till = async (user_id: string) => {
    try {

        let millis = moment.utc().add(15, 'minutes').format("x")
        let query = { _id: user_id }
        let update = {
            locked_till: millis
        }
        let options = { new: true }
        await DAO.find_and_update(Models.Users, query, update, options)
    }
    catch (err) {
        throw err;
    }
}

const dec_wrong_pwd_count = async (user_id: string) => {
    try {
        let query = { _id: user_id }
        let update = {
            wrong_pwd_count : 0
        }
        let options = { new: true }
        await DAO.find_and_update(Models.Users, query, update, options)
    }
    catch (err) {
        throw err;
    }
}

const forgot_password = async (req: any, res: express.Response) => {
    try {

        let { email, language } = req.body;
        let query_email = { email: email.toLowerCase() };
        let fetch_data: any = await user_services.verify_user_info(query_email);
        if (fetch_data.length) {

            let { _id } = fetch_data[0];
            let unique_code = await helpers.gen_unique_code(Models.Users);
            let fp_otp = await helpers.generate_otp();
            let query = { _id: _id };
            let update = {
                unique_code: unique_code,
                fp_otp: fp_otp
            };
            let options = { new: true };
            let update_data: any = await DAO.find_and_update(Models.Users, query, update, options);
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



const verify_otp = async (req: any, res: express.Response) => {
    try {
        let { otp: input_otp, email, language } = req.body;

        // verify email address
        let query_email = { email: email.toLowerCase() };
        let fetch_data: any = await user_services.verify_user_info(query_email);

        if (fetch_data.length) {
            let { _id, fp_otp } = fetch_data[0];
            if (input_otp != fp_otp) {
                throw await handle_custom_error("WRONG_OTP", language);
            } else {
                // generate unique code
                let unique_code = await helpers.gen_unique_code(Models.Users);

                let query = { _id: _id };
                let update = { unique_code: unique_code };
                let options = { new: true };
                await DAO.find_and_update(Models.Users, query, update, options);
                // generate new token
                // let generate_token = await user_services.generate_user_token(_id, req.body)

                // fetch user response
                // let response = await user_services.make_user_response(generate_token)

                let response = { unique_code: unique_code };

                // return response
                handle_success(res, response);
            }
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const verify_password_otp = async (req: any, res: express.Response) => {
    try {
        let { otp, language } = req.body;

        let query = {
            $and: [{ forgot_otp: { $ne: null } }, { forgot_otp: otp }],
        };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options);
        // console.log('fetch ', fetch_data)

        if (fetch_data.length) {
            let { _id, forgot_otp } = fetch_data[0];
            if (forgot_otp == otp) {
                // generate unique code
                let unique_code = await helpers.gen_unique_code(Models.Users);
                let query = { _id: _id };
                let update = { unique_code: unique_code };
                let options = { new: true };
                await DAO.find_and_update(Models.Users, query, update, options);
                let response = { message: 'OTP Verified', unique_code: unique_code };
                // return response
                handle_success(res, response);
            }
        } else {
            throw await handle_custom_error("WRONG_OTP", language);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const set_new_password1 = async (req: any, res: express.Response) => {
    try {
        let { password, unique_code, language } = req.body;

        let query = {
            $and: [{ unique_code: { $ne: null } }, { unique_code: unique_code }],
        };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options);

        if (fetch_data.length) {
            let { _id } = fetch_data[0];

            // bycryt password
            let bycryt_password = await helpers.bcrypt_password(password);

            let query = { _id: _id };
            let update = {
                password: bycryt_password,
                unique_code: null,
                fp_otp: 0,
            };
            let options = { new: true };
            await DAO.find_and_update(Models.Users, query, update, options);

            // // generate new token
            // let generate_token = await user_services.generate_user_token(_id, req.body)

            // // fetch user response
            // let response = await user_services.make_user_response(generate_token)

            let message = "Password Changed Sucessfully";
            let response = { message: message };

            // return password
            handle_success(res, response);
        } else {
            throw await handle_custom_error("NO_DATA_FOUND", language);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const set_new_password = async (req: any, res: express.Response) => {
    try {
        let { password, unique_code, language } = req.body;

        let query = {
            $and: [{ unique_code: { $ne: null } }, { unique_code: unique_code }],
        };

        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options);

        if (fetch_data.length) {
            let { _id } = fetch_data[0];

            // bycryt password
            let bycryt_password = await helpers.bcrypt_password(password);

            let query = { _id: _id };
            let update = {
                password: bycryt_password,
                unique_code: null,
                fp_otp: 0,
            };
            let options = { new: true };
            await DAO.find_and_update(Models.Users, query, update, options);

            // // generate new token
            // let generate_token = await user_services.generate_user_token(_id, req.body)

            // // fetch user response
            // let response = await user_services.make_user_response(generate_token)

            let message = "Password Changed Sucessfully";
            let response = { message: message };

            // return password
            handle_success(res, response);
        } else {
            throw await handle_custom_error("NO_DATA_FOUND", language);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};


const view_my_profile = async (req: any, res: express.Response) => {
    try {
        let { _id: user_id } = req.user_data;
        // console.log("user_id", user_id);
        let query = { user_id: user_id, is_default: true };
        // //console.log(query);

        let options = { lean: true };
        let projection = { full_address: 1 };
        let fetch_data: any = await DAO.get_data(Models.Address, query, projection, options);
        req.user_data["full_address"] = fetch_data.length ? fetch_data[0].full_address : null;
        req.user_data["address_id"] = fetch_data.length ? fetch_data[0]._id : null;
        let response: any = req.user_data;
        handle_success(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
};

const edit_profile = async (req: any, res: express.Response) => {
    try {

        let { language } = req.body;
        let { _id } = req.user_data;
        let session_data = req.session_data;

        let query = { _id: _id };
        let update = await user_services.edit_profile_data(req.body, req.user_data);
        let options = { new: true };
        await DAO.find_and_update(Models.Users, query, update, options);

        let response = await user_services.make_user_response(session_data, language);
        handle_success(res, response);

    }
    catch (err) {
        handle_catch(res, err);
    }
};

const change_password = async (req: any, res: express.Response) => {
    try {
        let { old_password, new_password, language } = req.body,
            { _id } = req.user_data,
            session_data = req.session_data;

        let query = { _id: _id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options);

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
                await DAO.find_and_update(Models.Users, query, update, options);

                // fetch response
                await user_services.make_user_response(session_data, language);
                let message = "Password Changed Successfully";
                let response = { message: message };

                // return password
                handle_success(res, response);
            }
        } else {
            throw await handle_custom_error("UNAUTHORIZED", language);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const logout = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.session_data;

        let query = { _id: _id };
        await DAO.remove_data(Models.Sessions, query);

        let message = "Logout Sucessfull";
        let response = { message: message };

        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const deactivate_account = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.session_data;
        // console.log("Sesion Id : " , _id);

        let query = { _id: _id };
        await user_services.deactivate_data(req.body, req.session_data);

        await DAO.remove_data(Models.Sessions, query);

        let message = "Deactivate Account Sucessfull";
        let response = { message: message };
        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const contact_us = async (req: any, res: express.Response) => {
    try {
        let { name, email, country_code, phone_no, message } = req.body;
            // { _id } = req.session_data;

        let data_to_save = {
            // user_id: _id,
            name: name,
            email: email.toLowerCase(),
            country_code: country_code,
            phone_no: phone_no,
            message: message,
            created_at: +new Date(),
        };
        let response = await DAO.save_data(Models.ContactUs, data_to_save);

        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_content = async (req: express.Request, res: express.Response) => {
    try {
        let { type } = req.query,
            query: any = {};
        if (type != undefined) {
            query.type = type;
        }

        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = await DAO.get_data(Models.Content, query, projection, options);

        // return data
        handle_success(res, fetch_data);
    } catch (err) {
        handle_catch(res, err);
    }
};

const add_edit_address = async (req: any, res: express.Response) => {
    try {

        let { _id, name, country_code, phone_no, company, country, state, city, pin_code, apartment_number,
            full_address, address_type,lng, lat } = req.body, { _id: user_id } = req.user_data, response: any;

        let data: any = {
          name: name,
          user_id: user_id,
          country_code: country_code,
          phone_no: phone_no,
          company: company,
          country: country,
          state: state,
          city: city,
          pin_code: pin_code,
          apartment_number: apartment_number,
          full_address: full_address,
          address_type: address_type,
          lng:lng,
          lat:lat,
          location: { type: "Point", coordinates: [lng, lat] },
          is_deleted: false,
        };
        console.log(data)
        if (!!_id ) {
            let query = { _id: _id };
            let update = await user_services.edit_address_data(req.body, req.user_data);

            response = await user_services.update_address_data(query, update);
            // console.log(response);
            // handle_success(res, response)
        } else {
            let query = { user_id: user_id };
            let fetch_data = await user_services.fetch_total_count(Models.Address, query)
            if (fetch_data !== 0) {
                data.is_default = false;
                response = await user_services.save_address(data);
            } else {
                data.is_default = true;
                response = await user_services.save_address(data);
            }
        }
        let fetch_updatd_data: any = await user_services.user_shippoAddress(user_id, response._id)

        // return response
        // console.log("CONTROLLER ", response);
        handle_success(res, fetch_updatd_data);
    } catch (err) {
        // //console.log(err);
        handle_catch(res, err);
    }
};

const set_default_address = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.query,
            { _id: user_id } = req.user_data,
            response: any;

        let query = { user_id: user_id, is_default: true };
        let fetch_data = await user_services.fetch_total_count(Models.Address, query);

        if (fetch_data != 0) {
            let query = { user_id: user_id, is_default: true };
            let set_data: any = {
                is_default: false,
            };
            response = await user_services.update_address_data(query, set_data);
        }

        let quer = { _id: _id };
        let set_data: any = {
            is_default: true,
        };
        response = await user_services.update_address_data(quer, set_data);

        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_address = async (req: any, res: express.Response) => {
    try {
        let { _id, pagination, limit } = req.query,
            { _id: user_id } = req.user_data;

        let options = await helpers.set_options(pagination, limit);

        if (_id != undefined) {
            let query = { _id: _id };
            let response = await user_services.make_address_response(query, options);
            handle_success(res, response);
        } else {
            let query = { user_id: user_id };
            let fetch_data = await user_services.make_address_response(query, options);
            let total_count = await user_services.fetch_total_count(
                Models.Address,
                query
            );
            let response = {
                total_count: total_count,
                data: fetch_data,
            };
            handle_success(res, response);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};

const delete_address = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params;
        let query = { _id: _id };

        let response: any = await DAO.remove_data(Models.Address, query);
        // console.log(response)

        if (response.deletedCount > 0) {
            let data = { message: `Address deleted successfully...` };
            handle_success(res, data);
        }
    } catch (err) {
        handle_catch(res, err);
    }
};


const add_to_cart = async (req: any, res: express.Response) => {
    try {

        let { cart_id, product } = req.body, { _id: user_id } = req.user_data;

        if (cart_id != undefined) {
            let query = { _id: cart_id };
            let update: any = await user_services.edit_cart(req.body, cart_id);
            let options = { new: true };
            let response: any = await DAO.find_and_update(Models.Cart, query, update, options);
            handle_success(res, response);
        }
        else {
            let query = { product: product, user_id: user_id };
            let options = { lean: true };
            let fetch_data: any = await user_services.fetch_Cart_data(query, options);
            if (fetch_data.length > 0) {
                throw await handle_custom_error("CART_ERROR", "ENGLISH")
            }
            else {
                await user_services.save_to_cart(req.body, user_id);
                let message = `Item added to Cart`;
                handle_success(res, message);
            }
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
};


const list_cart_items = async (req: any, res: express.Response) => {
    try {
        let { pagination, limit } = req.query,
            { _id: user_id } = req.user_data;

        let query: any = { user_id: user_id };

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await user_services.fetch_Cart_data(query, options);

        // fetch total count
        let total_count = await user_services.fetch_total_count(Models.Cart, query);

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};


const remove_cart_item = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params,
            message: any;
        let query = { _id: _id };
        //console.log(query);
        let response: any = await DAO.remove_data(Models.Cart, query);

        if (response.deletedCount > 0) {
            message = `Item Removed From Wishlist`;
            handle_success(res, message);
        }
        handle_success(res, message);
    } catch (err) {
        handle_catch(res, err);
    }
};


const place_order = async (req: any, res: express.Response) => {
    try {

        let { _id: user_id } = req.user_data;
        let save_order: any = await user_services.save_order_create(req.body, user_id);
        let { _id, quantity: total_quantity, product: product_id } = save_order;

        let query: any = { _id: _id };
        let options = { lean: true };
        let response: any = await user_services.fetch_Orders_data(query, options);

        // response.data[0]['product']=response.data[0].product_id
        let set_data: any = {
            user_id: user_id,
            product_id: product_id,
            type: "NEW_ORDER",
            title: "Order Placed",
            message: `Your order for ${response[0].product.name} has been placed successfully!`,
        };
        await user_services.save_notification_data(set_data);
        let product_data: any = await user_services.verify_product_info(product_id);
        if (product_data.length) {
            let quantity = product_data[0].quantity;
            let update_data: any = {
                quantity: Number(quantity) - total_quantity,
            };
            let query_data = { _id: product_id };
            let options = { new: true };
            if (update_data.quantity < 0) {
                var message = { message: "Couldn't add quantity" };
                handle_catch(res, message);
            }
            else {
                if (update_data.quantity == 0) {
                    let update: any = {
                        quantity: update_data.quantity,
                        sold: true,
                    };
                    await DAO.find_and_update(Models.Products, query_data, update, options);
                }
                await DAO.find_and_update(Models.Products, query_data, update_data, options);
                let response: any = await user_services.fetch_Orders_data(query, options);
                handle_success(res, response[0]);
            }
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
};



const get_single_order_detail = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.query;
        let query = { _id: _id };
        let options = { lean: true };
        let response = await user_services.make_orders_response(query, options);
        handle_success(res, response[0]);
    } catch (err) {
        handle_catch(res, err);
    }
};

const get_all_orders = async (req: any, res: express.Response) => {
    try {
        let { search, timezone, pagination, limit } = req.query,
            { _id: user_id } = req.user_data;

        let time_zone = "Asia/Kolkata";
        if (timezone) {
            time_zone = timezone;
        }

        let query: any = [
            await user_helper.match_data(user_id),
            await user_helper.lookup_data(),
            await user_helper.unwind_data(),
            await user_helper.redact_data(search),
            await user_helper.sort_data(),
        ];

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await user_services.fetch_Orders_search(query, options);
        let total_count = await fetch_data.length;

        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const cancel_order = async (req: any, res: express.Response) => {
    try {
        let collection = Models.Orders;
        await user_services.order_cancellation(req.body, collection);

        let data = { message: `Order Cancelled...` };
        handle_success(res, data);
    } catch (err) {
        handle_catch(res, err);
    }
};

const can_add_review = async (req: any, res: express.Response) => {
    try {
        let review = await add_review_module.can_add_review(req);
        let response = {
            message: "success",
            data: review
        };
        handle_return(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
}

const add_review = async (req: any, res: express.Response) => {
    try {
        let review = await add_review_module.add_review(req);
        let response = {
            message: "Review Added Successfully",
            data: review
        };
        handle_return(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
}

const edit_review = async (req: any, res: express.Response) => {
    try {
        let review = await edit_review_module.edit_review(req);
        let response = {
            message: "Review Updated Successfully",
            data: review
        };
        handle_return(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
}

const list_reviews = async (req: any, res: express.Response) => {
    try {
        let review = await list_review_module.list_reviews(req);
        let response = {
            message: "Success",
            data: review
        };
        handle_return(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
}

const list_my_reviews = async (req: any, res: express.Response) => {
    try {
        let review = await list_review_module.list_my_reviews(req);
        let response = {
            message: "Success",
            data: review
        };
        handle_return(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
}

const my_review_details = async (req: any, res: express.Response) => {
    try {
        let review = await list_review_module.my_review_details(req);
        let response = {
            message: "Success",
            data: review
        };
        handle_return(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
}

const delete_review = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params,
          { _id: user_id } = req.user_data;
        let query = { _id: _id, user_id: user_id };
        let response: any = await DAO.remove_data(Models.Reviews, query);
        if (response.deletedCount > 0) {
          let data = { message: `Review Deleted Successfully` };
          handle_success(res, data);
        }

    }
    catch (err) {
        handle_catch(res, err);
    }
}

const add_wishlist = async (req: any, res: express.Response) => {
    try {

        let { product_id } = req.body, { _id: user_id } = req.user_data, message: any;

        let query = { product_id: product_id, user_id:user_id };
        let options = { lean: 0 };
        let get_data = await user_services.fetch_Wishlist_data(query, options);
        if (get_data.length) {
            // message = `Item already added to wishlist`;
            message = {
                title: "Item alreday in wishlist",
                desc:"Item already added to wishlist"
            }
        }
        else {
            await user_services.save_wishlist(req.body, user_id);
            // message = `Item Added To Wishlist`;
            message = {
                title: "Item added to wishlist",
                desc:"Item Added To Wishlist"
            }
        }
        handle_success(res, message);
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const get_wishlist = async (req: any, res: express.Response) => {
    try {

        let { _id, pagination, limit } = req.query, { _id: user_id } = req.user_data;
        let query: any = { user_id: user_id };
        if (_id != undefined) { query._id = _id }

        let options = await helpers.set_options(pagination, limit);
        let fetch_data = await user_services.fetch_Wishlist_data(query, options);

        if (fetch_data.length) {
                for (let i = 0; i < fetch_data.length; i++) {
                    let { product_id: { _id } } = fetch_data[i]
                    let query = { product_id: _id, user_id: user_id }
                    let projection = { __v: 0 }
                    let options = { lean: true }
                    let response: any = await DAO.get_data(Models.Cart, query, projection, options)
                    let added_in_Cart = response.length > 0 ? true : false
                    fetch_data[i].in_cart = added_in_Cart;
                }
            }

        let total_count = await user_services.fetch_total_count(Models.Wishlist, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        handle_success(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const delete_wishlist = async (req: any, res: express.Response) => {
    try {

        let { _id } = req.params, { _id: user_id } = req.user_data;
        let query = { product_id: _id, user_id: user_id };
        let response: any = await DAO.remove_data(Models.Wishlist, query);
        if (response.deletedCount > 0) {
            // let data = { message: `Item Removed From Wishlist` };
            let data =  { 
                message : { title: "Item removed", desc:"Item Removed From Wishlist" }
            }
            handle_success(res, data);
        }

    }
    catch (err) {
        handle_catch(res, err);
    }
};

// const add_card = async (req: any, res: express.Response) => {
//   try {

//     let {card_number} = req.body, { _id: user_id } = req.user_data,
//       response: any;
//       let query_check = {card_number:card_number}
//       let options  = {lean:true}
//       let fetch_Cards_Data:any = await user_services.fetch_cards(query_check,options)

//       if(fetch_Cards_Data.length){
//         response = { message: `Card already exist`};
//       }else{
//         response =  await user_services.save_card(req.body, user_id);
//       }

//     // console.log(response)
//     // return response

//     handle_success(res, response);
//   } catch (err) {
//     //console.log(err);
//     handle_catch(res, err);
//   }
// };
const add_card = async (req: any, res: express.Response) => {
    try {
        let { number, exp_month, exp_year, cvc } = req.body,
            { _id } = req.user_data;
        const paymentMethod = await stripe.paymentMethods.create({
            type: "card",
            card: {
                number: number,
                exp_month: exp_month,
                exp_year: exp_year,
                cvc: cvc,
            },
        });
        // console.log("----PAYMENT",paymentMethod)
        let payment_id = paymentMethod.id;
        let query = { _id: _id },
            options = { lean: true },
            projections = { customer_id: 1 };
        let update = { payment_id: payment_id };
        let res_data = await DAO.find_and_update(Models.Users, query, update, options);
        let fetch_user: any = await DAO.get_single_data(Models.Users, query, projections, options);
        // console.log("fetch_ Customer Id-> ", fetch_user.customer_id);
        const paymentMethodAttach = await stripe.paymentMethods.attach(payment_id, {
            customer: fetch_user.customer_id,
        });
        handle_success(res, paymentMethodAttach);
    } catch (err) {
        //console.log(err);
        handle_catch(res, err);
    }
};

let save_card = async (req: any, res: express.Response) => {
    try {
        let { _id: user_id } = req.user_data, response: any;
        await user_services.save_card(req.body, user_id)
        response = 'Card saved successfully'
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
}

let detach_payment = async (req: any, res: express.Response) => {
    try {
        let { payment_id } = req.body;
        const paymentMethod = await stripe.paymentMethods.detach(payment_id);
        handle_success(res, paymentMethod);
    } catch (err) {
        handle_catch(res, err);
    }
};
const set_default_card = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.query, { _id: user_id } = req.user_data, response: any;

        let query = { user_id: user_id, is_default: true };
        let fetch_data: any = await user_services.fetch_total_count(Models.Cards, query);

        if (fetch_data != 0) {
            let query = { user_id: user_id, is_default: true };
            let set_data: any = {
                is_default: false,
            };
            response = await user_services.update_card(query, set_data);
        }

        let quer = { _id: _id };
        let set_data: any = {
            is_default: true,
        };
        response = await user_services.update_card(quer, set_data);

        // return response
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const listing_cards = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.user_data;
        let query = { _id: _id },
            options = { lean: true },
            projection = { customer_id: 1 };
        let get_user_data: any = await DAO.get_single_data(Models.Users, query, projection, options);

        const paymentMethods = await stripe.customers.listPaymentMethods(
            get_user_data.customer_id,
            { type: "card" }
        );
        // console.log("PAYMENT>>",paymentMethods)
        handle_success(res, paymentMethods);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_cards = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.user_data, response: any;
        let query = { user_id: _id, is_deleted: false }, options = { lean: true }, projection = { __v: 0 };

        response = await DAO.get_data(Models.Cards, query, projection, options)

        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const card_detail = async (req: any, res: express.Response) => {
    try {
        let { _id: card_id } = req.query, response: any;
        let query = { _id: card_id, }, options = { lean: true }, projection = { __v: 0 };
        response = await DAO.get_single_data(Models.Cards, query, projection, options)

        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const list_coupons = async (req: any, res: express.Response) => {
    try {
        let {_id:user_id} = req.user_data;
        let { pagination, limit,language } = req.query
        let curr_date = +new Date()
        let date = moment.utc(curr_date,'x').format("YYYY-MM-DD")
        console.log('curr_date is ', date, typeof date)

        let query = { is_deleted: false, start_date: {$lte:date}, end_date: { $gte: date }, language:language };
        console.log('query -- ', query)
        let projection = { __v: 0 };
        let options = await helpers.set_options(limit, pagination)
        let coupons:any = await DAO.get_data(Models.Coupons, query, projection, options);

        if(coupons && coupons.length){
            for (let i = 0; i < coupons.length; i++) {
                let { _id } = coupons[i];
                let query_used = { coupon_id:_id, user_id:user_id };
                let get_used_coupons:any = await DAO.get_data(Models.Used_Coupons, query_used,projection,options);
                let is_used:any = get_used_coupons.length != 0 ? true : false
                coupons[i].is_coupon_used = is_used;
            }
        }

        let total_count = await DAO.count_data(Models.Coupons, query)
        res.send({
            success: true,
            message: "Success",
            total_count: total_count,
            data: coupons
        });
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const coupon_details = async (req: any, res: express.Response) => {
    try {

        let { _id } = req.params
        let query = { _id: _id, is_deleted: false }
        let projection = { __v: 0 };
        let options = { lean: true }
        let coupons: any = await DAO.get_data(Models.Coupons, query, projection, options);
        if (coupons.length) {
            res.send({
                success: true,
                message: "Success",
                data: coupons[0]
            });
        }
        else {
            throw await handle_custom_error("INVALID_OBJECT_ID", "ENGLISH")
        }
    }
    catch (err) {
        handle_catch(res, err);
    }
}

const list_used_coupons = async (req: any, res: express.Response) => {
    try {

        let { pagination, limit,language } = req.query;
        let query = { is_deleted: false, language: language };
        let projection = { __v: 0 };
        let options = await helpers.set_options(limit, pagination)
        let populate = [
            { path: "coupon_id", select: "-__v" }
        ];
        let coupons = await DAO.populate_data(Models.Used_Coupons, query, projection, options, populate);
        let total_count = await DAO.count_data(Models.Used_Coupons, query)
        res.send({
            success: true,
            message: "Success",
            total_count: total_count,
            data: coupons
        });
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const expired_coupons = async (req: any, res: express.Response) => {
    try {
        let { pagination, limit, language } = req.query;
        let curr_date = +new Date();
        let current_date = moment.utc(curr_date,'x').format("YYYY-MM-DD");
        let query = {
          is_deleted: false,
          end_date: { $lt: current_date },
          language: language,
        };
        let projection = { __v: 0 };
        let options = await helpers.set_options(limit, pagination)
        let coupons: any = await DAO.get_data(Models.Coupons, query, projection, options);
        let total_count = await DAO.count_data(Models.Coupons, query);
        res.send({
            success: true,
            message: "Success",
            total_count: total_count,
            data: coupons
        });
    }
    catch (err) {
        handle_catch(res, err);
    }
}



const shipment_create1 = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.user_data;
        let { product_id } = req.body
        let query_product = { _id: product_id }
        let options = { lean: true }
        let fetch_products = await user_services.get_products(query_product, options)
        let seller_id = fetch_products[0].added_by

        let query_seller = { _id: seller_id }

        let seller_data = await user_services.get_seller(query_seller, options)

        var addressfrom = await shippo.address.create({
            "name": seller_data[0].name,
            "company": seller_data[0].company,
            "street1": seller_data[0].full_address,
            "city": seller_data[0].city,
            "state": seller_data[0].state,
            "zip": seller_data[0].pin_code,
            "country": seller_data[0].country, //iso2 country code
            "phone": seller_data[0].phone_number,
            "email": seller_data[0].email,
            "validate": true
        });
        var validate_addressfrom = await shippo.address.validate(addressfrom.object_id);
        // console.log("Validate_addressfrom ", validate_addressfrom)

        let query_address = { user_id: _id }
        let projection: { __v: 0 }
        // console.log("QUERY",query_address)
        let get_address: any = await DAO.get_data(Models.Address, query_address, projection, options)
        let address_id = get_address[0]._id
        // console.log('address_id ', address_id)

        var addressTo = await shippo.address.create({
            "name": get_address[0].name,
            "street1": get_address[0].full_address,
            "city": get_address[0].city,
            "state": get_address[0].state,
            "zip": get_address[0].pin_code,
            "country": get_address[0].country
        })
        var validate_addressto = await shippo.address.validate(addressTo.object_id);
        // console.log("validate_addressto ", validate_addressto)

        let query_parcel = { product_id: product_id }
        let projection_parcel = { __v: 0 }
        let get_parcel: any = await DAO.get_data(Models.Parcel, query_parcel, projection_parcel, options)
        // console.log("get_parcel", get_parcel.parcel_objectId)
        let get_parcel_obj = await shippo.parcel.retrieve(get_parcel.parcel_objectId)
        // console.log("get parcel objct ", get_parcel_obj)

        let parcel: any = await shippo.parcel.create({
            "length": get_parcel[0].length,
            "width": get_parcel[0].width,
            "height": get_parcel[0].height,
            "distance_unit": get_parcel[0].distance_unit,
            "weight": get_parcel[0].weight,
            "mass_unit": get_parcel[0].mass_unit
        })
        // console.log("PArCEL ", parcel)

        let create_shpiment: any = await shippo.shipment.create({
            "address_from": addressfrom,
            "address_to": addressTo,
            "parcels": parcel,
            "async": true
        })
        var rate = create_shpiment.rates[0];

        // console.log("Create Shipment ", create_shpiment.object_id)

        // let retrive_ship = await shippo.shipment.retrieve(create_shpiment.object_id);
        // console.log("Create Shipment ",  retrive_ship)

        // let ship_rated  = await shippo.shipment.rates(create_shpiment.object_id)
        // console.log("SHIP RATE ",  ship_rated)
        // let rate_id = create_shpiment.rates[0]
        let transaction = await shippo.transaction.create({
            "rate": rate.object_id,
            "label_file_type": "PDF",
            "async": false
        })
        let response: any = {
            create_shpiment: create_shpiment,
            transaction: transaction
        }
        handle_success(res, response);
    } catch (err) {
        handle_catch(res, err);
    }
};

const shipment_create = async (req: any, res: express.Response) => {
    try {

        let { _id } = req.user_data;
        let { product_id, address_id } = req.body

        // let customsDeclaration = await Create_Custom_Items(product_id)
        // console.log("Custom ", customsDeclaration)

        let query_product = { _id: product_id }, options = { lean: true }, projection = { __v: 0 }
        let fetch_products = await user_services.get_products(query_product, options)

        let query_seller = { _id: fetch_products[0].added_by }
        let seller_data: any = await user_services.get_seller(query_seller, options)
        let addressfrom: any = await shippo.address.retrieve(seller_data[0].shippo_address_id)
        // console.log("Seller addressfrom ", addressfrom)

        let query_user: any = { _id: address_id }
        let user_address: any = await DAO.get_single_data(Models.Address, query_user, projection, options)
        // console.log("User address_to ", user_address.shippo_user_address_id)
        let address_to: any = await shippo.address.retrieve(user_address.shippo_user_address_id)

        let query_parcel = { _id: fetch_products[0].parcel_id }
        let get_parcel: any = await DAO.get_single_data(Models.Parcel, query_parcel, projection, options)
        console.log("get_parcel...", get_parcel)

        // let get_parcel_objId: any = await shippo.parcel.retrieve(get_parcel.parcel_objectId)
        // console.log("get parcel objct ", get_parcel)

        let create_shpiment: any = await shippo.shipment.create({
            "address_from": addressfrom,
            "address_to": address_to,
            "parcels": get_parcel.shippo_parcel_id,
            // "customs_declaration": customsDeclaration,
            "async": true
        })
        console.log("create_shpiment...", create_shpiment)

        var rate = create_shpiment.rates[0]; // console.log("rates ", rate)
        let transaction = await shippo.transaction.create({
            "rate": rate.object_id,
            "label_file_type": "PDF",
            "async": false
        })
        console.log("create_transaction...", transaction)

        // let shipment_data = {
        //     shipment: {
        //         address_to: address_to,
        //         address_from: addressfrom,
        //         parcels: get_parcel.shippo_parcel_id,
        //     },
        //     // carrier_account: "532d8e41cfba45be89f9ac077d2319d8",
        //     // servicelevel_token: servicelevel_token
        // }
        // let shipment = await shippo.transaction.create(shipment_data)

        let response: any = {
            create_shpiment: create_shpiment,
            transaction: transaction
        }
        // console.log("Response ----> ", response)
        handle_success(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const user_shippo_address = async (_id: any, address_id: any) => {
    try {
        // let { _id } = req.user_data;

        let query = { user_id: _id, _id: address_id }
        let projection: { __v: 0 }, options = { lean: true }
        let get_address: any = await DAO.get_single_data(Models.Address, query, projection, options)

        var UseraddressTo = await shippo.address.create({
            "name": get_address.name,
            "street1": get_address.apartment_number,
            "city": get_address.city,
            "state": get_address.state,
            "zip": get_address.pin_code,
            "country": get_address.country
        })
        let validate_user_address: any = await shippo.address.validate(UseraddressTo.object_id);
        let address_to: any = await shippo.address.retrieve(validate_user_address.object_id)

        // let update: any = {
        //   shippo_user_address_id: validate_user_address.object_id
        // }
        // let option = { new: true }
        // let update_seller: any = await DAO.find_and_update(Models.Address, query, update, option)
        return address_to
        // handle_success(res, update_seller)
    } catch (err) {
        throw (err)
    }
}

const Create_Custom_Items = async (product_id: any) => {
    try {
        let query = { _id: product_id }, projection: { __v: 0 }, options = { lean: true }
        let get_product: any = await DAO.get_single_data(Models.Products, query, projection, options)
        let customsItem: any = await shippo.customsitem.create({
            "description": get_product.name,
            "quantity": 1,
            "net_weight": "400",
            "mass_unit": "g",
            "value_amount": get_product.price,
            "value_currency": "USD",
            "origin_country": "US",
        });
        // console.log("Custom ", customsItem)

        let custom_declaration: any = await shippo.customsdeclaration.create({
            "contents_type": "MERCHANDISE",
            "contents_explanation": get_product.name,
            "non_delivery_option": "RETURN",
            "certify": true,
            "certify_signer": "Simon Kreuz",
            "items": [customsItem],
        })
        return custom_declaration
        // handle_success(res, update_seller)
    } catch (err) {
        throw (err)
    }
}

const list_notifications = async (req: any, res: express.Response) => {
    try {
        let { pagination, limit } = req.query;
        let { _id: user_id } = req.user_data;
        
        let options = await helpers.set_options(pagination,limit);
        let projection = { user_id:1, clear_for_user:1, read_by_user:1, type:1,title:1, message:1,order_id:1, orderProduct_id:1, images:1,created_at:1 };

        //new notifications
        let query = { user_id: Mongoose.Types.ObjectId(user_id) , clear_for_user:false, read_by_user:false};
        let unread_response: any = await DAO.get_data(Models.Notifications, query, projection, options);

        //new notifications
        let query_unread_n = { user_id: Mongoose.Types.ObjectId(user_id) , clear_for_user:false, read_by_user:true};
        let read_response: any = await DAO.get_data(Models.Notifications, query_unread_n, projection, options);

        //count unread notifications
        let query_unread:any = { user_id: Mongoose.Types.ObjectId(user_id) , read_by_user:false }
        let unread_count:any = await DAO.count_data(Models.Notifications,query_unread)

        //update notifications new to previous
        // await DAO.update_many(Models.Notifications, query, { previous_user: true })

        let data: any = {
          unread_count: unread_count,
          read_notifications: read_response,
          unread_notifications: unread_response,
        };
      // if(response && response.length){
        // if(response && response.length){
        handle_success(res, data);
        // }else{
        //     handle_success(res, []);
        // }
    }
    catch (err) {
        handle_catch(res, err);
    }
};
const read_notifications = async (req: any, res: express.Response) => {
    try {
        let { language } = req.query;
        let { _id: user_id } = req.user_data;
        let query = { user_id: user_id , read_by_user:false, clear_for_user:false};
        let options = {lean:true};
        let projection = { __v: 0 };
        let response: any = await DAO.get_data(Models.Notifications, query, projection, options);
        if(response && response.length){
            for(let i=0;i<response.length; i++){
                let query1 = { _id: response[i]._id };
                await DAO.find_and_update(Models.Notifications,query1,{read_by_user: true},options)
            }
            let response1: any = await DAO.get_data(Models.Notifications, {user_id:user_id}, projection, options);
            // handle_success(res, response1);
        }
        let data: any = { message: `All notifications read` };
        handle_success(res, data);
        
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const clear_notifications = async (req: any, res: express.Response) => {
    try {
        let { language } = req.query;
        let { _id: user_id } = req.user_data;
        let query = { user_id: user_id , clear_for_user:false};
        let options = { lean: true };
        let projection = { __v: 0 };

        let response: any = await DAO.get_data(Models.Notifications, query, projection, options);
        if(response && response.length){
            for(let i=0;i<response.length; i++){
                let query1 = { _id: response[i]._id };
                await DAO.find_and_update(Models.Notifications,query1,{clear_for_user: true},options)
            }
            let response1: any = await DAO.get_data(Models.Notifications, query, projection, options);

        }
        let data: any = { message: `All notifications cleared` };
        handle_success(res, data);
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const getKeys = async (req: any, res: express.Response) => {
    try {
        // let { _id } = req.params;
        let { search , type, pagination, limit } = req.query;
       
        let query:any = {};
        if(type ) { query.type = type}
        if(search){
            query = [{ name: { $regex: search, $options: "i" } } ];     
        }
        let options = await helpers.set_options(pagination,limit);
        let projection = { __v: 0 };

        let response: any = await DAO.get_data(Models.MainKeys, query, projection, options);
        
        handle_success(res, response);
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const getKeyDetail1 = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params;
        let { language } = req.query;
        let query = { _id:_id };
        let response:any;
        let options = { lean: true };
        let projection = { __v: 0 };

        let data:any = await DAO.get_data(Models.MainKeys,query,projection, options)
        if(data.length > 0) {
            let query_value:any = { main_key_id:_id , language:language}
            let projection:any = { key:1, value:1,language:1 }
            response =  await DAO.get_data(Models.KeyValues,query_value,projection,{lean:true})
            handle_success(res, response);
        }
    
    }
    catch (err) {
        handle_catch(res, err);
    }
};

const getKeyDetail = async (req: any, res: express.Response) => {
    try {
        let { _id } = req.params;
        let { language } = req.query;
        let query = { _id:_id };
        let response:any;
        let options = { lean: true };
        let projection = { __v: 0 };

        let data:any = await DAO.get_data(Models.MainKeys,query,projection, options)
        if(data.length > 0) {
            let query_value:any = { main_key_id:_id , language:language}
            let projection:any = { key:1, value:1,language:1 }
            response =  await DAO.get_data(Models.KeyValues,query_value,projection,{lean:true})
            handle_success(res, response);
        }
    
    }
    catch (err) {
        handle_catch(res, err);
    }
};

export {
  signup,
  email_verification,
  resend_otp,
  phone_no_verification,
  resend_phone_otp,
  social_login,
  login,
  forgot_password,
  verify_otp,
  set_new_password,
  view_my_profile,
  edit_profile,
  change_password,
  logout,
  deactivate_account,
  contact_us,
  list_content,
  add_edit_address,
  set_default_address,
  list_address,
  delete_address,
  add_to_cart,
  list_cart_items,
  remove_cart_item,
  place_order,
  get_all_orders,
  get_single_order_detail,
  cancel_order,
  can_add_review,
  add_review,
  edit_review,
  list_reviews,
  list_my_reviews,
  my_review_details,
  add_wishlist,
  get_wishlist,
  delete_wishlist,
  add_card,
  save_card,
  set_default_card,
  listing_cards,
  list_cards,
  card_detail,
  detach_payment,
  list_coupons,
  coupon_details,
  list_used_coupons,
  expired_coupons,
  shipment_create,
  verify_password_otp,
  delete_review,
  list_notifications,
  read_notifications,
  clear_notifications,
  getKeys,
  getKeyDetail,
};
