import * as DAO from "../../DAO";
import * as Models from "../../models";
import * as email_services from "./email_services";
import { helpers, handle_custom_error } from "../../middlewares/index";

export default class search_module {

    static verify_user_info = async (query: any) => {
        try {
            let projection = { __v: 0 };
            let options = { lean: true };
            let fetch_data = await DAO.get_data(Models.Users, query, projection, options);
            return fetch_data
        }
        catch (err) {
            throw err;
        }
    };

    static forogot_password = async (req: any) => {
        try {

            let { email, language } = req.body;
            let query_email = { email: email.toLowerCase() };
            let fetch_data: any = await this.verify_user_info(query_email);
            if (fetch_data.length) {
                let { _id } = fetch_data[0];
                let unique_code = await helpers.gen_unique_code(Models.Users);
                let fp_otp = await helpers.generate_otp();
                let query = { _id: _id };
                let update = { 
                    unique_code: unique_code,
                    fp_otp: fp_otp,
                    fp_otp_verified : false
                };
                let options = { new: true };
                let update_data: any = await DAO.find_and_update(Models.Users, query, update, options);
                await email_services.forgot_password_mail(update_data);
                let response = {
                    message : "Mail sent sucessfully",
                    unique_code: unique_code
                };
                return response
            } 
            else {
                throw await handle_custom_error("EMAIL_NOT_REGISTERED", language);
            }

        }
        catch (err) {
            throw err;
        }
    }

    static resend_fp_otp = async (req: any) => {
        try {

            let { unique_code, language } = req.body;

            let query = { unique_code: unique_code };
            let projection = { __v: 0 }
            let options = { lean: true }
            let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options)
            if (fetch_data.length) {
                let { _id } = fetch_data[0];
                // let unique_code = await helpers.gen_unique_code(Models.Users);
                let fp_otp = await helpers.generate_otp();
                let query = { _id: _id };
                let update = { 
                    // unique_code: unique_code,
                    fp_otp: fp_otp,
                    fp_otp_verified : false
                };
                let options = { new: true };
                let update_data: any = await DAO.find_and_update(Models.Users, query, update, options);
                await email_services.forgot_password_mail(update_data);
                let response = {
                    message : "Mail sent sucessfully",
                    unique_code: unique_code
                };
                return response
            } 
            else {
                throw await handle_custom_error("EMAIL_NOT_REGISTERED", language);
            }

        }
        catch (err) {
            throw err;
        }
    }

    static verify_fp_otp = async (req: any) => {
        try {
    
            let { unique_code, otp: input_otp, language } = req.body;
            let query = { unique_code: unique_code }
            let projection = { __v: 0 }
            let options = { lean: true }
            let response: any = await DAO.get_data(Models.Users, query, projection, options)
            if (response.length) {
                let { _id, fp_otp } = response[0]
                if (input_otp != fp_otp) {
                    throw await handle_custom_error("WRONG_OTP", language)
                }
                else {
                    let query = { _id: _id }
                    let update = { fp_otp : 0, fp_otp_verified : true }
                    let options = { new : true }
                    await DAO.find_and_update(Models.Users, query, update, options)
                    return {
                        message : "OTP verified",
                        unique_code : unique_code
                    }
                }
            }
            else {
                throw await handle_custom_error("WRONG_UNIQUE_CODE", language)
            }
        }
        catch (err) {
            throw err;
        }
    }
    
    static set_new_password = async (req: any) => {
        try {

            let { password, unique_code, language } = req.body;
            let query = { unique_code: unique_code }
            let projection = { __v: 0 };
            let options = { lean: true };
            let fetch_data: any = await DAO.get_data(Models.Users, query, projection, options);
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
                    await DAO.find_and_update(Models.Users, query, update, options);
                    let message = "Password Changed Sucessfully";
                    return message
                }
            }
            else {
                throw await handle_custom_error("WRONG_UNIQUE_CODE", language);
            }

        }
        catch (err) {
            throw err;
        }
    };




}
