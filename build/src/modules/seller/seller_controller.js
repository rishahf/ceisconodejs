"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify_seller_info = exports.retrive_parcels = exports.dashboard = exports.logout = exports.set_new_password = exports.verify_fp_otp = exports.resend_fp_otp = exports.forgot_password = exports.change_password = exports.edit_profile = exports.view_my_profile = exports.resend_email_otp = exports.email_verification = exports.login = void 0;
const DAO = __importStar(require("../../DAO/index"));
const Models = __importStar(require("../../models/index"));
const seller_service = __importStar(require("./seller_service"));
const email_services = __importStar(require("./email_services"));
const index_1 = require("../../middlewares/index");
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
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password: input_password, language } = req.body;
        let device_type = req.headers["user-agent"];
        // console.log("DEVICE TYPE  ----***** ----- ****  --- ", device_type);
        // console.log('body ', req.body)
        let query = {
            email: email,
            // is_deleted: false
        };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        if (fetch_data.length) {
            let { _id, password, is_blocked, is_deleted, account_status } = fetch_data[0];
            if (is_blocked == true) {
                throw yield (0, index_1.handle_custom_error)("ACCOUNT_BLOCKED", language);
            }
            else if (is_deleted == true) {
                throw yield (0, index_1.handle_custom_error)("ACCOUNT_DELETED", language);
            }
            else if (account_status == "DEACTIVATED") {
                throw yield (0, index_1.handle_custom_error)("ACCOUNT_DEACTIVATED", language);
            }
            else {
                let decrypt = yield index_1.helpers.decrypt_password(input_password, password);
                if (decrypt != true) {
                    throw yield (0, index_1.handle_custom_error)("INCORRECT_PASSWORD", language);
                }
                else {
                    let query_ss = { user_id: _id, device_type: device_type };
                    let session_data = yield DAO.get_data(Models.Sessions, query_ss, projection, options);
                    console.log('query_ss -- ', query_ss);
                    // console.log('ssession data ----  ', session_data);
                    if (session_data && session_data.length) {
                        yield DAO.remove_many(Models.Sessions, query_ss);
                    }
                    // generate token
                    let generate_token = yield seller_service.generate_seller_token(_id, req.body, device_type);
                    let response = yield seller_service.make_seller_response(generate_token, language);
                    // return response
                    (0, index_1.handle_success)(res, response);
                }
            }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("EMAIL_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.login = login;
const email_verification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { otp: input_otp, language } = req.body;
        let { _id, email_otp } = req.user_data;
        let session_data = req.session_data;
        console.log('match seller -- otp -- ', email_otp, 'entered - ', input_otp);
        console.log('match seller 1 --- ', email_otp == input_otp);
        if (parseInt(email_otp) == parseInt(input_otp)) {
            let query = { _id: _id };
            let update = { email_otp: 0, email_verified: true };
            let options = { new: true };
            yield DAO.find_and_update(Models.Sellers, query, update, options);
            let response = yield seller_service.make_seller_response(session_data, language);
            (0, index_1.handle_success)(res, response);
        }
        else {
            throw yield (0, index_1.handle_custom_error)("WRONG_OTP", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.email_verification = email_verification;
const resend_email_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, language } = req.body;
        let query_email = { email: email.toLowerCase() };
        let fetch_data = yield seller_service.verify_seller_info(query_email);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            let update_data = yield seller_service.update_email_otp(_id);
            // let generate_token: any = await seller_service.generate_seller_token(_id, req.body);
            // let response = await seller_service.make_seller_response(generate_token, language);
            yield email_services.resend_otp_mail(update_data);
            let message = 'Mail sent successfully';
            (0, index_1.handle_success)(res, message);
        }
        else {
            throw yield (0, index_1.handle_custom_error)("EMAIL_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.resend_email_otp = resend_email_otp;
const view_my_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.user_data;
        let query = { _id: _id, is_deleted: false };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Sellers, query, projection, options);
        (0, index_1.handle_success)(res, response[0]);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.view_my_profile = view_my_profile;
const edit_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let { name, email, image, phone_number, country_code, company, country, state, city, pin_code, apartment_number, full_address, language } = req.body;
        // console.log('REQ_BODY ------ ', req.body)
        let query = { _id: seller_id };
        let set_data = {};
        if (!!name) {
            set_data.name = name;
        }
        if (!!email) {
            // set_data.email = email
            // set_data.email_verified = false
            let to_lower_case = email.toLowerCase();
            let query = { _id: { $ne: seller_id }, email: to_lower_case };
            let fetch_data = yield verify_seller_info(query);
            if (fetch_data.length) {
                throw yield (0, index_1.handle_custom_error)("EMAIL_ALREADY_EXISTS", language);
            }
            else {
                if (to_lower_case != email) {
                    let otp = yield index_1.helpers.generate_otp();
                    set_data.email = to_lower_case;
                    set_data.otp = otp;
                    set_data.email_verified = false;
                    let set_name = name !== undefined ? name : name;
                    yield email_services.edit_profile_mail(to_lower_case, otp, set_name);
                }
            }
        }
        if (!!image) {
            set_data.image = image;
        }
        if (!!country_code) {
            set_data.country_code = country_code;
        }
        if (!!phone_number) {
            set_data.phone_number = phone_number;
        }
        if (!!company) {
            set_data.company = company;
        }
        if (!!city) {
            set_data.city = city;
        }
        if (!!state) {
            set_data.state = state;
        }
        if (!!country) {
            set_data.country = country;
        }
        if (!!pin_code) {
            set_data.pin_code = pin_code;
        }
        if (apartment_number == '' || !!apartment_number) {
            set_data.apartment_number = apartment_number;
        }
        if (!!full_address) {
            set_data.full_address = full_address;
        }
        // console.log('set-data -------- ', set_data)
        let options = { new: true };
        let update_seller = yield DAO.find_and_update(Models.Sellers, query, set_data, options);
        // console.log('update seller -- -- ', update_seller)
        if (!!city && !!state && !!country && pin_code && !!apartment_number) {
            let set_address = {
                "name": name,
                "street1": apartment_number,
                "city": city,
                "state": state,
                "zip": pin_code,
                "country": country,
                "email": update_seller.email,
                "validate": true
            };
            if (!!company) {
                set_address.company = company;
            }
            let address_from = yield shippo.address.create(set_address);
            let validate_address = yield shippo.address.validate(address_from.object_id);
            let update = { shippo_address_id: validate_address.object_id };
            let response = yield DAO.find_and_update(Models.Sellers, query, update, options);
            (0, index_1.handle_success)(res, response);
        }
        else {
            (0, index_1.handle_success)(res, update_seller);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.edit_profile = edit_profile;
const verify_seller_info = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.verify_seller_info = verify_seller_info;
const change_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { old_password, new_password, language } = req.body, { _id: seller_id } = req.user_data;
        let query = { _id: seller_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        if (fetch_data.length) {
            let { _id, password } = fetch_data[0];
            let decrypt = yield index_1.helpers.decrypt_password(old_password, password);
            if (decrypt != true) {
                throw yield (0, index_1.handle_custom_error)("OLD_PASSWORD_MISMATCH", language);
            }
            else {
                // bycryt password
                let bycryt_password = yield index_1.helpers.bcrypt_password(new_password);
                let query = { _id: _id };
                let update = { password: bycryt_password };
                let options = { new: true };
                yield DAO.find_and_update(Models.Sellers, query, update, options);
                // return password
                let message = { message: "Password Changed Successfully!" };
                (0, index_1.handle_success)(res, message);
            }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("UNAUTHORIZED", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.change_password = change_password;
const forgot_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, language } = req.body;
        let query_email = { email: email.toLowerCase() };
        let fetch_data = yield seller_service.verify_user_info(query_email);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            let unique_code = yield index_1.helpers.gen_unique_code(Models.Sellers);
            let fp_otp = yield index_1.helpers.generate_otp();
            let query = { _id: _id };
            let update = {
                unique_code: unique_code,
                fp_otp: fp_otp,
                fp_otp_verified: false
            };
            let options = { new: true };
            let update_data = yield DAO.find_and_update(Models.Sellers, query, update, options);
            yield email_services.forgot_password_mail(update_data);
            let message = "Mail sent sucessfully";
            let response = {
                message: message,
                unique_code: unique_code
            };
            (0, index_1.handle_success)(res, response);
        }
        else {
            throw yield (0, index_1.handle_custom_error)("EMAIL_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.forgot_password = forgot_password;
const resend_fp_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { unique_code, language } = req.body;
        let query = { unique_code: unique_code };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            // let unique_code = await helpers.gen_unique_code(Models.Sellers);
            let fp_otp = yield index_1.helpers.generate_otp();
            let query = { _id: _id };
            let update = {
                // unique_code: unique_code,
                fp_otp: fp_otp,
                fp_otp_verified: false
            };
            let options = { new: true };
            let update_data = yield DAO.find_and_update(Models.Sellers, query, update, options);
            yield email_services.forgot_password_mail(update_data);
            let message = "Mail sent sucessfully";
            let response = {
                message: message,
                unique_code: unique_code
            };
            (0, index_1.handle_success)(res, response);
        }
        else {
            throw yield (0, index_1.handle_custom_error)("EMAIL_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.resend_fp_otp = resend_fp_otp;
const verify_fp_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { unique_code, otp: input_otp, language } = req.body;
        let query = { unique_code: unique_code };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Sellers, query, projection, options);
        if (response.length) {
            let { _id, fp_otp } = response[0];
            if (input_otp != fp_otp) {
                throw yield (0, index_1.handle_custom_error)("WRONG_OTP", language);
            }
            else {
                let query = { _id: _id };
                let update = { fp_otp: 0, fp_otp_verified: true };
                let options = { new: true };
                yield DAO.find_and_update(Models.Sellers, query, update, options);
                let response = {
                    message: "OTP verified",
                    unique_code: unique_code
                };
                (0, index_1.handle_success)(res, response);
            }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("WRONG_UNIQUE_CODE", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.verify_fp_otp = verify_fp_otp;
const set_new_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { password, unique_code, language } = req.body;
        let query = { unique_code: unique_code };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        if (fetch_data.length) {
            let { _id, fp_otp_verified } = fetch_data[0];
            if (fp_otp_verified != true) {
                throw yield (0, index_1.handle_custom_error)("OTP_NOT_VERIFIED", language);
            }
            else {
                let bycryt_password = yield index_1.helpers.bcrypt_password(password);
                let query = { _id: _id };
                let update = {
                    password: bycryt_password,
                    unique_code: null,
                    fp_otp_verified: false
                };
                let options = { new: true };
                yield DAO.find_and_update(Models.Sellers, query, update, options);
                let message = "Password Changed Sucessfully";
                let response = { message: message };
                (0, index_1.handle_success)(res, response);
            }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("WRONG_UNIQUE_CODE", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.set_new_password = set_new_password;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: _id } = req.session_data;
        let query = { type: "SELLER", _id: _id };
        // console.log("query: ", query);
        yield DAO.remove_data(Models.Sessions, query);
        let message = { message: "Logout Successfull" };
        // return response
        (0, index_1.handle_success)(res, message);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.logout = logout;
const dashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // fetch user count
        let { graph_type, timezone } = req.query;
        let { _id: seller_id } = req.user_data;
        let query = { is_deleted: false, added_by: seller_id };
        let total_products = yield seller_service.fetch_total_count(Models.Products, query);
        let projection = { __v: 0 }, option = { lean: true };
        let product = yield DAO.get_data(Models.Products, query, projection, option);
        let query_order = { product: product };
        // fetch products count
        let total_orders = yield seller_service.fetch_total_count(Models.Orders, query_order);
        // fetch recent users
        let response = {
            total_products: total_products,
            total_orders: total_orders,
        };
        // return response
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.dashboard = dashboard;
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
const retrive_parcels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query;
        let query = {};
        if (!!_id) {
            query._id = _id;
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let Parcels = yield DAO.get_data(Models.Parcel, query, projection, options);
        let total_count = yield DAO.count_data(Models.Parcel, query);
        let response = {
            total_count: total_count,
            data: Parcels
        };
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.retrive_parcels = retrive_parcels;
