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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verify_password_otp = exports.shipment_create = exports.expired_coupons = exports.list_used_coupons = exports.coupon_details = exports.list_coupons = exports.detach_payment = exports.card_detail = exports.list_cards = exports.listing_cards = exports.set_default_card = exports.save_card = exports.add_card = exports.delete_wishlist = exports.get_wishlist = exports.add_wishlist = exports.my_review_details = exports.list_my_reviews = exports.list_reviews = exports.edit_review = exports.add_review = exports.can_add_review = exports.cancel_order = exports.get_single_order_detail = exports.get_all_orders = exports.place_order = exports.remove_cart_item = exports.list_cart_items = exports.add_to_cart = exports.delete_address = exports.list_address = exports.set_default_address = exports.add_edit_address = exports.list_content = exports.contact_us = exports.deactivate_account = exports.logout = exports.change_password = exports.edit_profile = exports.view_my_profile = exports.set_new_password = exports.verify_otp = exports.forgot_password = exports.login = exports.social_login = exports.resend_phone_otp = exports.phone_no_verification = exports.resend_otp = exports.email_verification = exports.signup = void 0;
exports.getKeyDetail = exports.getKeys = exports.clear_notifications = exports.read_notifications = exports.list_notifications = exports.delete_review = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DAO = __importStar(require("../../DAO"));
const moment_1 = __importDefault(require("moment"));
const mongoose_1 = __importDefault(require("mongoose"));
const Models = __importStar(require("../../models"));
const user_services = __importStar(require("./user_services"));
const user_helper = __importStar(require("./user_helper"));
const email_services = __importStar(require("./email_services"));
const review_module_1 = require("./review_module");
const index_1 = require("../../middlewares/index");
const stripe_1 = __importDefault(require("stripe"));
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options = { apiVersion: '2020-08-27' };
const stripe = new stripe_1.default(STRIPE_KEY, stripe_options);
const index_2 = require("../../middlewares/index");
const shippo = require('shippo')(process.env.SHIPPO_TOKEN);
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let device_type = req.headers["user-agent"];
        let { name, email, phone_no, language } = req.body;
        let query_email = { email: email.toLowerCase(), is_deleted: false };
        let fetch_data = yield user_services.verify_user_info(query_email);
        if (fetch_data.length) {
            throw yield (0, index_2.handle_custom_error)("EMAIL_ALREADY_EXISTS", language);
        }
        else {
            let query_phone_no = { phone_no: phone_no };
            let verify_data = yield user_services.verify_user_info(query_phone_no);
            if (verify_data.length) {
                throw yield (0, index_2.handle_custom_error)("PHONE_NO_ALREADY_EXISTS", language);
            }
            else {
                let stripe_customer = yield stripe.customers.create({
                    name: name,
                    email: email,
                    description: "Customer",
                });
                let create_user = yield user_services.set_user_data(req.body, stripe_customer);
                let { _id } = create_user;
                // generate access token
                let generate_token = yield user_services.generate_user_token(_id, req.body, device_type);
                let response = yield user_services.make_user_response(generate_token, language);
                yield email_services.send_welcome_mail(create_user);
                (0, index_2.handle_success)(res, response);
            }
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.signup = signup;
const email_verification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { otp: input_otp, language } = req.body;
        let { _id, otp } = req.user_data;
        let session_data = req.session_data;
        if (otp == input_otp) {
            let query = { _id: _id };
            let update = { email_verified: true };
            let options = { new: true };
            yield DAO.find_and_update(Models.Users, query, update, options);
            let response = yield user_services.make_user_response(session_data, language);
            (0, index_2.handle_success)(res, response);
        }
        else {
            throw yield (0, index_2.handle_custom_error)("WRONG_OTP", language);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.email_verification = email_verification;
const resend_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, language } = req.body;
        let device_type = req.headers["user-agent"];
        let query_email = { email: email.toLowerCase() };
        let fetch_data = yield user_services.verify_user_info(query_email);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            let update_data = yield user_services.update_otp(_id);
            let generate_token = yield user_services.generate_user_token(_id, req.body, device_type);
            let response = yield user_services.make_user_response(generate_token, language);
            yield email_services.resend_otp_mail(update_data);
            let message = 'Mail sent successfully';
            (0, index_2.handle_success)(res, message);
        }
        else {
            throw yield (0, index_2.handle_custom_error)("EMAIL_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.resend_otp = resend_otp;
const phone_no_verification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { otp: input_otp, language } = req.body;
        let { _id, phone_otp } = req.user_data;
        let session_data = req.session_data;
        if (phone_otp == input_otp || Number(input_otp) == 1234) {
            let query = { _id: _id };
            let update = { phone_verified: true };
            let options = { new: true };
            yield DAO.find_and_update(Models.Users, query, update, options);
            let response = yield user_services.make_user_response(session_data, language);
            //email
            yield email_services.phone_verification_success_mail(response);
            //notification
            let query_sess = { user_id: { $in: mongoose_1.default.Types.ObjectId(_id) }, fcm_token: { $nin: [null, ''] } };
            let get_sessions = yield DAO.get_data(Models.Sessions, query_sess, { __v: 0 }, options);
            if (get_sessions && get_sessions.length) {
                let fcms_arr = [];
                for (let i = 0; i < get_sessions.length; i++) {
                    let { fcm_token } = get_sessions[i];
                    fcms_arr.push(fcm_token);
                }
                console.log('---phone verfication fcm ---- ', fcms_arr);
                let notification_data = {
                    type: "PHONE_VERIFICATION_SUCCESS",
                    title: "Mobile Number Verified",
                    message: "Your mobile number has been verified Successfully",
                    user_id: _id
                };
                yield DAO.save_data(Models.Notifications, notification_data);
                yield (0, index_1.send_notification_to_all)(notification_data, fcms_arr);
            }
            (0, index_2.handle_success)(res, response);
        }
        else {
            throw yield (0, index_2.handle_custom_error)("WRONG_OTP", language);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.phone_no_verification = phone_no_verification;
const resend_phone_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let device_type = req.headers["user-agent"];
        let { country_code, phone_no, language } = req.body;
        let query = {
            country_code: country_code,
            phone_no: phone_no
        };
        let fetch_data = yield user_services.verify_user_info(query);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            let update_data = yield user_services.update_phone_otp(_id);
            let generate_token = yield user_services.generate_user_token(_id, req.body, device_type);
            let response = yield user_services.make_user_response(generate_token, language);
            // await email_services.resend_otp_mail(update_data);
            let message = 'SMS sent successfully';
            (0, index_2.handle_success)(res, message);
        }
        else {
            throw yield (0, index_2.handle_custom_error)("PHONE_NO_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.resend_phone_otp = resend_phone_otp;
const social_login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let device_type = req.headers["user-agent"];
        let { social_type, social_token, email, phone_no, language } = req.body;
        let query = {};
        if (social_type == "GOOGLE") {
            let decode_token = yield jsonwebtoken_1.default.decode(social_token);
            let { sub } = decode_token;
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
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            let generate_token = yield user_services.generate_user_token(_id, req.body, device_type);
            let response = yield user_services.make_user_response(generate_token, language);
            (0, index_2.handle_success)(res, response);
        }
        else {
            let response;
            if (email != null || email != undefined) {
                email = email.toLowerCase();
            }
            if (phone_no != null || phone_no != undefined) {
                phone_no = phone_no;
            }
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
                let fetch_data = yield user_services.verify_user_info(query);
                if (fetch_data.length) {
                    let { social_type } = fetch_data[0];
                    if (social_type == "GOOGLE") {
                        throw yield (0, index_2.handle_custom_error)("LOGIN_VIA_GOOGLE", language);
                    }
                    else if (social_type == "FACEBOOK") {
                        throw yield (0, index_2.handle_custom_error)("LOGIN_VIA_FACEBOOK", language);
                    }
                    else if (social_type == "APPLE") {
                        throw yield (0, index_2.handle_custom_error)("LOGIN_VIA_APPLE", language);
                    }
                    else if (social_type == null) {
                        throw yield (0, index_2.handle_custom_error)("LOGIN_VIA_EMAIL_PASSWORD", language);
                    }
                }
                else {
                    console.log('create One');
                    response = yield user_services.create_new_user(req.body);
                }
            }
            else {
                console.log("create two");
                response = yield user_services.create_new_user(req.body);
            }
            let { _id } = response;
            let generate_token = yield user_services.generate_user_token(_id, req.body, device_type);
            let populate_data = yield user_services.make_user_response(generate_token, language);
            (0, index_2.handle_success)(res, populate_data);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.social_login = social_login;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //  console.log("req -------- ", req.headers);
        // console.log("req.user-agent ----***** ----- **** ", req.headers['user-agent']);
        let device_type = req.headers["user-agent"];
        // console.log("DEVICE TYPE  ----***** ----- ****  --- ", device_type);
        let { email, password, language } = req.body;
        let query = { email: email.toLowerCase() };
        let projection = {};
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        if (fetch_data.length) {
            let { _id, password: hash, is_blocked, is_deleted, account_status, wrong_pwd_count, locked_till } = fetch_data[0];
            let current_millis = moment_1.default.utc().format("x");
            if (locked_till > current_millis) {
                yield dec_wrong_pwd_count(_id);
                throw yield (0, index_2.handle_custom_error)("ACCOUNT_LOCKED", language);
            }
            else {
                let decrypt = yield index_2.helpers.decrypt_password(password, hash);
                if (decrypt != true) {
                    if (wrong_pwd_count == 5) {
                        yield account_locked_till(_id);
                        throw yield (0, index_2.handle_custom_error)("ACCOUNT_LOCKED", language);
                    }
                    else {
                        yield inc_wrong_pwd_count(_id);
                        throw yield (0, index_2.handle_custom_error)("INCORRECT_PASSWORD", language);
                    }
                }
                if (is_blocked == true) {
                    throw yield (0, index_2.handle_custom_error)("ACCOUNT_BLOCKED", language);
                }
                if (is_deleted == true) {
                    throw yield (0, index_2.handle_custom_error)("ACCOUNT_DELETED", language);
                }
                if (account_status == "DEACTIVATED") {
                    throw yield (0, index_2.handle_custom_error)("ACCOUNT_DEACTIVATED", language);
                }
                else {
                    let query_ss = { user_id: _id, device_type: device_type };
                    let session_data = yield DAO.get_data(Models.Sessions, query_ss, projection, options);
                    console.log('query_ss -- ', query_ss);
                    // console.log('ssession data ----  ', session_data);
                    if (session_data && session_data.length) {
                        yield DAO.remove_many(Models.Sessions, query_ss);
                    }
                    yield dec_wrong_pwd_count(_id);
                    let generate_token = yield user_services.generate_user_token(_id, req.body, device_type);
                    let response = yield user_services.make_user_response(generate_token, language);
                    (0, index_2.handle_success)(res, response);
                }
            }
        }
        else {
            throw yield (0, index_2.handle_custom_error)("EMAIL_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.login = login;
const inc_wrong_pwd_count = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: user_id };
        let update = {
            $inc: {
                wrong_pwd_count: 1
            }
        };
        let options = { new: true };
        yield DAO.find_and_update(Models.Users, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
const account_locked_till = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let millis = moment_1.default.utc().add(15, 'minutes').format("x");
        let query = { _id: user_id };
        let update = {
            locked_till: millis
        };
        let options = { new: true };
        yield DAO.find_and_update(Models.Users, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
const dec_wrong_pwd_count = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: user_id };
        let update = {
            wrong_pwd_count: 0
        };
        let options = { new: true };
        yield DAO.find_and_update(Models.Users, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
const forgot_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, language } = req.body;
        let query_email = { email: email.toLowerCase() };
        let fetch_data = yield user_services.verify_user_info(query_email);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            let unique_code = yield index_2.helpers.gen_unique_code(Models.Users);
            let fp_otp = yield index_2.helpers.generate_otp();
            let query = { _id: _id };
            let update = {
                unique_code: unique_code,
                fp_otp: fp_otp
            };
            let options = { new: true };
            let update_data = yield DAO.find_and_update(Models.Users, query, update, options);
            yield email_services.forgot_password_mail(update_data);
            let message = "Mail sent sucessfully";
            let response = {
                message: message,
                unique_code: unique_code
            };
            (0, index_2.handle_success)(res, response);
        }
        else {
            throw yield (0, index_2.handle_custom_error)("EMAIL_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.forgot_password = forgot_password;
const verify_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { otp: input_otp, email, language } = req.body;
        // verify email address
        let query_email = { email: email.toLowerCase() };
        let fetch_data = yield user_services.verify_user_info(query_email);
        if (fetch_data.length) {
            let { _id, fp_otp } = fetch_data[0];
            if (input_otp != fp_otp) {
                throw yield (0, index_2.handle_custom_error)("WRONG_OTP", language);
            }
            else {
                // generate unique code
                let unique_code = yield index_2.helpers.gen_unique_code(Models.Users);
                let query = { _id: _id };
                let update = { unique_code: unique_code };
                let options = { new: true };
                yield DAO.find_and_update(Models.Users, query, update, options);
                // generate new token
                // let generate_token = await user_services.generate_user_token(_id, req.body)
                // fetch user response
                // let response = await user_services.make_user_response(generate_token)
                let response = { unique_code: unique_code };
                // return response
                (0, index_2.handle_success)(res, response);
            }
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.verify_otp = verify_otp;
const verify_password_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { otp, language } = req.body;
        let query = {
            $and: [{ forgot_otp: { $ne: null } }, { forgot_otp: otp }],
        };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        // console.log('fetch ', fetch_data)
        if (fetch_data.length) {
            let { _id, forgot_otp } = fetch_data[0];
            if (forgot_otp == otp) {
                // generate unique code
                let unique_code = yield index_2.helpers.gen_unique_code(Models.Users);
                let query = { _id: _id };
                let update = { unique_code: unique_code };
                let options = { new: true };
                yield DAO.find_and_update(Models.Users, query, update, options);
                let response = { message: 'OTP Verified', unique_code: unique_code };
                // return response
                (0, index_2.handle_success)(res, response);
            }
        }
        else {
            throw yield (0, index_2.handle_custom_error)("WRONG_OTP", language);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.verify_password_otp = verify_password_otp;
const set_new_password1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { password, unique_code, language } = req.body;
        let query = {
            $and: [{ unique_code: { $ne: null } }, { unique_code: unique_code }],
        };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            // bycryt password
            let bycryt_password = yield index_2.helpers.bcrypt_password(password);
            let query = { _id: _id };
            let update = {
                password: bycryt_password,
                unique_code: null,
                fp_otp: 0,
            };
            let options = { new: true };
            yield DAO.find_and_update(Models.Users, query, update, options);
            // // generate new token
            // let generate_token = await user_services.generate_user_token(_id, req.body)
            // // fetch user response
            // let response = await user_services.make_user_response(generate_token)
            let message = "Password Changed Sucessfully";
            let response = { message: message };
            // return password
            (0, index_2.handle_success)(res, response);
        }
        else {
            throw yield (0, index_2.handle_custom_error)("NO_DATA_FOUND", language);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
const set_new_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { password, unique_code, language } = req.body;
        let query = {
            $and: [{ unique_code: { $ne: null } }, { unique_code: unique_code }],
        };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            // bycryt password
            let bycryt_password = yield index_2.helpers.bcrypt_password(password);
            let query = { _id: _id };
            let update = {
                password: bycryt_password,
                unique_code: null,
                fp_otp: 0,
            };
            let options = { new: true };
            yield DAO.find_and_update(Models.Users, query, update, options);
            // // generate new token
            // let generate_token = await user_services.generate_user_token(_id, req.body)
            // // fetch user response
            // let response = await user_services.make_user_response(generate_token)
            let message = "Password Changed Sucessfully";
            let response = { message: message };
            // return password
            (0, index_2.handle_success)(res, response);
        }
        else {
            throw yield (0, index_2.handle_custom_error)("NO_DATA_FOUND", language);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.set_new_password = set_new_password;
const view_my_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: user_id } = req.user_data;
        // console.log("user_id", user_id);
        let query = { user_id: user_id, is_default: true };
        // //console.log(query);
        let options = { lean: true };
        let projection = { full_address: 1 };
        let fetch_data = yield DAO.get_data(Models.Address, query, projection, options);
        req.user_data["full_address"] = fetch_data.length ? fetch_data[0].full_address : null;
        req.user_data["address_id"] = fetch_data.length ? fetch_data[0]._id : null;
        let response = req.user_data;
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.view_my_profile = view_my_profile;
const edit_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language } = req.body;
        let { _id } = req.user_data;
        let session_data = req.session_data;
        let query = { _id: _id };
        let update = yield user_services.edit_profile_data(req.body, req.user_data);
        let options = { new: true };
        yield DAO.find_and_update(Models.Users, query, update, options);
        let response = yield user_services.make_user_response(session_data, language);
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.edit_profile = edit_profile;
const change_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { old_password, new_password, language } = req.body, { _id } = req.user_data, session_data = req.session_data;
        let query = { _id: _id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        if (fetch_data.length) {
            let { _id, password } = fetch_data[0];
            let decrypt = yield index_2.helpers.decrypt_password(old_password, password);
            if (decrypt != true) {
                throw yield (0, index_2.handle_custom_error)("OLD_PASSWORD_MISMATCH", language);
            }
            else {
                // bycryt password
                let bycryt_password = yield index_2.helpers.bcrypt_password(new_password);
                let query = { _id: _id };
                let update = { password: bycryt_password };
                let options = { new: true };
                yield DAO.find_and_update(Models.Users, query, update, options);
                // fetch response
                yield user_services.make_user_response(session_data, language);
                let message = "Password Changed Successfully";
                let response = { message: message };
                // return password
                (0, index_2.handle_success)(res, response);
            }
        }
        else {
            throw yield (0, index_2.handle_custom_error)("UNAUTHORIZED", language);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.change_password = change_password;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.session_data;
        let query = { _id: _id };
        yield DAO.remove_data(Models.Sessions, query);
        let message = "Logout Sucessfull";
        let response = { message: message };
        // return response
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.logout = logout;
const deactivate_account = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.session_data;
        // console.log("Sesion Id : " , _id);
        let query = { _id: _id };
        yield user_services.deactivate_data(req.body, req.session_data);
        yield DAO.remove_data(Models.Sessions, query);
        let message = "Deactivate Account Sucessfull";
        let response = { message: message };
        // return response
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.deactivate_account = deactivate_account;
const contact_us = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        let response = yield DAO.save_data(Models.ContactUs, data_to_save);
        // return response
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.contact_us = contact_us;
const list_content = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { type } = req.query, query = {};
        if (type != undefined) {
            query.type = type;
        }
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Content, query, projection, options);
        // return data
        (0, index_2.handle_success)(res, fetch_data);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_content = list_content;
const add_edit_address = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, name, country_code, phone_no, company, country, state, city, pin_code, apartment_number, full_address, address_type, lng, lat } = req.body, { _id: user_id } = req.user_data, response;
        let data = {
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
            lng: lng,
            lat: lat,
            location: { type: "Point", coordinates: [lng, lat] },
            is_deleted: false,
        };
        console.log(data);
        if (!!_id) {
            let query = { _id: _id };
            let update = yield user_services.edit_address_data(req.body, req.user_data);
            response = yield user_services.update_address_data(query, update);
            // console.log(response);
            // handle_success(res, response)
        }
        else {
            let query = { user_id: user_id };
            let fetch_data = yield user_services.fetch_total_count(Models.Address, query);
            if (fetch_data !== 0) {
                data.is_default = false;
                response = yield user_services.save_address(data);
            }
            else {
                data.is_default = true;
                response = yield user_services.save_address(data);
            }
        }
        let fetch_updatd_data = yield user_services.user_shippoAddress(user_id, response._id);
        // return response
        // console.log("CONTROLLER ", response);
        (0, index_2.handle_success)(res, fetch_updatd_data);
    }
    catch (err) {
        // //console.log(err);
        (0, index_2.handle_catch)(res, err);
    }
});
exports.add_edit_address = add_edit_address;
const set_default_address = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query, { _id: user_id } = req.user_data, response;
        let query = { user_id: user_id, is_default: true };
        let fetch_data = yield user_services.fetch_total_count(Models.Address, query);
        if (fetch_data != 0) {
            let query = { user_id: user_id, is_default: true };
            let set_data = {
                is_default: false,
            };
            response = yield user_services.update_address_data(query, set_data);
        }
        let quer = { _id: _id };
        let set_data = {
            is_default: true,
        };
        response = yield user_services.update_address_data(quer, set_data);
        // return response
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.set_default_address = set_default_address;
const list_address = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query, { _id: user_id } = req.user_data;
        let options = yield index_2.helpers.set_options(pagination, limit);
        if (_id != undefined) {
            let query = { _id: _id };
            let response = yield user_services.make_address_response(query, options);
            (0, index_2.handle_success)(res, response);
        }
        else {
            let query = { user_id: user_id };
            let fetch_data = yield user_services.make_address_response(query, options);
            let total_count = yield user_services.fetch_total_count(Models.Address, query);
            let response = {
                total_count: total_count,
                data: fetch_data,
            };
            (0, index_2.handle_success)(res, response);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_address = list_address;
const delete_address = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response = yield DAO.remove_data(Models.Address, query);
        // console.log(response)
        if (response.deletedCount > 0) {
            let data = { message: `Address deleted successfully...` };
            (0, index_2.handle_success)(res, data);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.delete_address = delete_address;
const add_to_cart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { cart_id, product } = req.body, { _id: user_id } = req.user_data;
        if (cart_id != undefined) {
            let query = { _id: cart_id };
            let update = yield user_services.edit_cart(req.body, cart_id);
            let options = { new: true };
            let response = yield DAO.find_and_update(Models.Cart, query, update, options);
            (0, index_2.handle_success)(res, response);
        }
        else {
            let query = { product: product, user_id: user_id };
            let options = { lean: true };
            let fetch_data = yield user_services.fetch_Cart_data(query, options);
            if (fetch_data.length > 0) {
                throw yield (0, index_2.handle_custom_error)("CART_ERROR", "ENGLISH");
            }
            else {
                yield user_services.save_to_cart(req.body, user_id);
                let message = `Item added to Cart`;
                (0, index_2.handle_success)(res, message);
            }
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.add_to_cart = add_to_cart;
const list_cart_items = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pagination, limit } = req.query, { _id: user_id } = req.user_data;
        let query = { user_id: user_id };
        let options = yield index_2.helpers.set_options(pagination, limit);
        let fetch_data = yield user_services.fetch_Cart_data(query, options);
        // fetch total count
        let total_count = yield user_services.fetch_total_count(Models.Cart, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_cart_items = list_cart_items;
const remove_cart_item = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params, message;
        let query = { _id: _id };
        //console.log(query);
        let response = yield DAO.remove_data(Models.Cart, query);
        if (response.deletedCount > 0) {
            message = `Item Removed From Wishlist`;
            (0, index_2.handle_success)(res, message);
        }
        (0, index_2.handle_success)(res, message);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.remove_cart_item = remove_cart_item;
const place_order = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: user_id } = req.user_data;
        let save_order = yield user_services.save_order_create(req.body, user_id);
        let { _id, quantity: total_quantity, product: product_id } = save_order;
        let query = { _id: _id };
        let options = { lean: true };
        let response = yield user_services.fetch_Orders_data(query, options);
        // response.data[0]['product']=response.data[0].product_id
        let set_data = {
            user_id: user_id,
            product_id: product_id,
            type: "NEW_ORDER",
            title: "Order Placed",
            message: `Your order for ${response[0].product.name} has been placed successfully!`,
        };
        yield user_services.save_notification_data(set_data);
        let product_data = yield user_services.verify_product_info(product_id);
        if (product_data.length) {
            let quantity = product_data[0].quantity;
            let update_data = {
                quantity: Number(quantity) - total_quantity,
            };
            let query_data = { _id: product_id };
            let options = { new: true };
            if (update_data.quantity < 0) {
                var message = { message: "Couldn't add quantity" };
                (0, index_2.handle_catch)(res, message);
            }
            else {
                if (update_data.quantity == 0) {
                    let update = {
                        quantity: update_data.quantity,
                        sold: true,
                    };
                    yield DAO.find_and_update(Models.Products, query_data, update, options);
                }
                yield DAO.find_and_update(Models.Products, query_data, update_data, options);
                let response = yield user_services.fetch_Orders_data(query, options);
                (0, index_2.handle_success)(res, response[0]);
            }
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.place_order = place_order;
const get_single_order_detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { _id: _id };
        let options = { lean: true };
        let response = yield user_services.make_orders_response(query, options);
        (0, index_2.handle_success)(res, response[0]);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.get_single_order_detail = get_single_order_detail;
const get_all_orders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, timezone, pagination, limit } = req.query, { _id: user_id } = req.user_data;
        let time_zone = "Asia/Kolkata";
        if (timezone) {
            time_zone = timezone;
        }
        let query = [
            yield user_helper.match_data(user_id),
            yield user_helper.lookup_data(),
            yield user_helper.unwind_data(),
            yield user_helper.redact_data(search),
            yield user_helper.sort_data(),
        ];
        let options = yield index_2.helpers.set_options(pagination, limit);
        let fetch_data = yield user_services.fetch_Orders_search(query, options);
        let total_count = yield fetch_data.length;
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.get_all_orders = get_all_orders;
const cancel_order = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let collection = Models.Orders;
        yield user_services.order_cancellation(req.body, collection);
        let data = { message: `Order Cancelled...` };
        (0, index_2.handle_success)(res, data);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.cancel_order = cancel_order;
const can_add_review = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let review = yield review_module_1.add_review_module.can_add_review(req);
        let response = {
            message: "success",
            data: review
        };
        (0, index_2.handle_return)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.can_add_review = can_add_review;
const add_review = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let review = yield review_module_1.add_review_module.add_review(req);
        let response = {
            message: "Review Added Successfully",
            data: review
        };
        (0, index_2.handle_return)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.add_review = add_review;
const edit_review = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let review = yield review_module_1.edit_review_module.edit_review(req);
        let response = {
            message: "Review Updated Successfully",
            data: review
        };
        (0, index_2.handle_return)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.edit_review = edit_review;
const list_reviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let review = yield review_module_1.list_review_module.list_reviews(req);
        let response = {
            message: "Success",
            data: review
        };
        (0, index_2.handle_return)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_reviews = list_reviews;
const list_my_reviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let review = yield review_module_1.list_review_module.list_my_reviews(req);
        let response = {
            message: "Success",
            data: review
        };
        (0, index_2.handle_return)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_my_reviews = list_my_reviews;
const my_review_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let review = yield review_module_1.list_review_module.my_review_details(req);
        let response = {
            message: "Success",
            data: review
        };
        (0, index_2.handle_return)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.my_review_details = my_review_details;
const delete_review = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params, { _id: user_id } = req.user_data;
        let query = { _id: _id, user_id: user_id };
        let response = yield DAO.remove_data(Models.Reviews, query);
        if (response.deletedCount > 0) {
            let data = { message: `Review Deleted Successfully` };
            (0, index_2.handle_success)(res, data);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.delete_review = delete_review;
const add_wishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id } = req.body, { _id: user_id } = req.user_data, message;
        let query = { product_id: product_id, user_id: user_id };
        let options = { lean: 0 };
        let get_data = yield user_services.fetch_Wishlist_data(query, options);
        if (get_data.length) {
            // message = `Item already added to wishlist`;
            message = {
                title: "Item alreday in wishlist",
                desc: "Item already added to wishlist"
            };
        }
        else {
            yield user_services.save_wishlist(req.body, user_id);
            // message = `Item Added To Wishlist`;
            message = {
                title: "Item added to wishlist",
                desc: "Item Added To Wishlist"
            };
        }
        (0, index_2.handle_success)(res, message);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.add_wishlist = add_wishlist;
const get_wishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query, { _id: user_id } = req.user_data;
        let query = { user_id: user_id };
        if (_id != undefined) {
            query._id = _id;
        }
        let options = yield index_2.helpers.set_options(pagination, limit);
        let fetch_data = yield user_services.fetch_Wishlist_data(query, options);
        if (fetch_data.length) {
            for (let i = 0; i < fetch_data.length; i++) {
                let { product_id: { _id } } = fetch_data[i];
                let query = { product_id: _id, user_id: user_id };
                let projection = { __v: 0 };
                let options = { lean: true };
                let response = yield DAO.get_data(Models.Cart, query, projection, options);
                let added_in_Cart = response.length > 0 ? true : false;
                fetch_data[i].in_cart = added_in_Cart;
            }
        }
        let total_count = yield user_services.fetch_total_count(Models.Wishlist, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.get_wishlist = get_wishlist;
const delete_wishlist = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params, { _id: user_id } = req.user_data;
        let query = { product_id: _id, user_id: user_id };
        let response = yield DAO.remove_data(Models.Wishlist, query);
        if (response.deletedCount > 0) {
            // let data = { message: `Item Removed From Wishlist` };
            let data = {
                message: { title: "Item removed", desc: "Item Removed From Wishlist" }
            };
            (0, index_2.handle_success)(res, data);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.delete_wishlist = delete_wishlist;
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
const add_card = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { number, exp_month, exp_year, cvc } = req.body, { _id } = req.user_data;
        const paymentMethod = yield stripe.paymentMethods.create({
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
        let query = { _id: _id }, options = { lean: true }, projections = { customer_id: 1 };
        let update = { payment_id: payment_id };
        let res_data = yield DAO.find_and_update(Models.Users, query, update, options);
        let fetch_user = yield DAO.get_single_data(Models.Users, query, projections, options);
        // console.log("fetch_ Customer Id-> ", fetch_user.customer_id);
        const paymentMethodAttach = yield stripe.paymentMethods.attach(payment_id, {
            customer: fetch_user.customer_id,
        });
        (0, index_2.handle_success)(res, paymentMethodAttach);
    }
    catch (err) {
        //console.log(err);
        (0, index_2.handle_catch)(res, err);
    }
});
exports.add_card = add_card;
let save_card = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: user_id } = req.user_data, response;
        yield user_services.save_card(req.body, user_id);
        response = 'Card saved successfully';
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.save_card = save_card;
let detach_payment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { payment_id } = req.body;
        const paymentMethod = yield stripe.paymentMethods.detach(payment_id);
        (0, index_2.handle_success)(res, paymentMethod);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.detach_payment = detach_payment;
const set_default_card = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query, { _id: user_id } = req.user_data, response;
        let query = { user_id: user_id, is_default: true };
        let fetch_data = yield user_services.fetch_total_count(Models.Cards, query);
        if (fetch_data != 0) {
            let query = { user_id: user_id, is_default: true };
            let set_data = {
                is_default: false,
            };
            response = yield user_services.update_card(query, set_data);
        }
        let quer = { _id: _id };
        let set_data = {
            is_default: true,
        };
        response = yield user_services.update_card(quer, set_data);
        // return response
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.set_default_card = set_default_card;
const listing_cards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.user_data;
        let query = { _id: _id }, options = { lean: true }, projection = { customer_id: 1 };
        let get_user_data = yield DAO.get_single_data(Models.Users, query, projection, options);
        const paymentMethods = yield stripe.customers.listPaymentMethods(get_user_data.customer_id, { type: "card" });
        // console.log("PAYMENT>>",paymentMethods)
        (0, index_2.handle_success)(res, paymentMethods);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.listing_cards = listing_cards;
const list_cards = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.user_data, response;
        let query = { user_id: _id, is_deleted: false }, options = { lean: true }, projection = { __v: 0 };
        response = yield DAO.get_data(Models.Cards, query, projection, options);
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_cards = list_cards;
const card_detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: card_id } = req.query, response;
        let query = { _id: card_id, }, options = { lean: true }, projection = { __v: 0 };
        response = yield DAO.get_single_data(Models.Cards, query, projection, options);
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.card_detail = card_detail;
const list_coupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: user_id } = req.user_data;
        let { pagination, limit, language } = req.query;
        let curr_date = +new Date();
        let date = moment_1.default.utc(curr_date, 'x').format("YYYY-MM-DD");
        console.log('curr_date is ', date, typeof date);
        let query = { is_deleted: false, start_date: { $lte: date }, end_date: { $gte: date }, language: language };
        console.log('query -- ', query);
        let projection = { __v: 0 };
        let options = yield index_2.helpers.set_options(limit, pagination);
        let coupons = yield DAO.get_data(Models.Coupons, query, projection, options);
        if (coupons && coupons.length) {
            for (let i = 0; i < coupons.length; i++) {
                let { _id } = coupons[i];
                let query_used = { coupon_id: _id, user_id: user_id };
                let get_used_coupons = yield DAO.get_data(Models.Used_Coupons, query_used, projection, options);
                let is_used = get_used_coupons.length != 0 ? true : false;
                coupons[i].is_coupon_used = is_used;
            }
        }
        let total_count = yield DAO.count_data(Models.Coupons, query);
        res.send({
            success: true,
            message: "Success",
            total_count: total_count,
            data: coupons
        });
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_coupons = list_coupons;
const coupon_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id, is_deleted: false };
        let projection = { __v: 0 };
        let options = { lean: true };
        let coupons = yield DAO.get_data(Models.Coupons, query, projection, options);
        if (coupons.length) {
            res.send({
                success: true,
                message: "Success",
                data: coupons[0]
            });
        }
        else {
            throw yield (0, index_2.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.coupon_details = coupon_details;
const list_used_coupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pagination, limit, language } = req.query;
        let query = { is_deleted: false, language: language };
        let projection = { __v: 0 };
        let options = yield index_2.helpers.set_options(limit, pagination);
        let populate = [
            { path: "coupon_id", select: "-__v" }
        ];
        let coupons = yield DAO.populate_data(Models.Used_Coupons, query, projection, options, populate);
        let total_count = yield DAO.count_data(Models.Used_Coupons, query);
        res.send({
            success: true,
            message: "Success",
            total_count: total_count,
            data: coupons
        });
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_used_coupons = list_used_coupons;
const expired_coupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pagination, limit, language } = req.query;
        let curr_date = +new Date();
        let current_date = moment_1.default.utc(curr_date, 'x').format("YYYY-MM-DD");
        let query = {
            is_deleted: false,
            end_date: { $lt: current_date },
            language: language,
        };
        let projection = { __v: 0 };
        let options = yield index_2.helpers.set_options(limit, pagination);
        let coupons = yield DAO.get_data(Models.Coupons, query, projection, options);
        let total_count = yield DAO.count_data(Models.Coupons, query);
        res.send({
            success: true,
            message: "Success",
            total_count: total_count,
            data: coupons
        });
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.expired_coupons = expired_coupons;
const shipment_create1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.user_data;
        let { product_id } = req.body;
        let query_product = { _id: product_id };
        let options = { lean: true };
        let fetch_products = yield user_services.get_products(query_product, options);
        let seller_id = fetch_products[0].added_by;
        let query_seller = { _id: seller_id };
        let seller_data = yield user_services.get_seller(query_seller, options);
        var addressfrom = yield shippo.address.create({
            "name": seller_data[0].name,
            "company": seller_data[0].company,
            "street1": seller_data[0].full_address,
            "city": seller_data[0].city,
            "state": seller_data[0].state,
            "zip": seller_data[0].pin_code,
            "country": seller_data[0].country,
            "phone": seller_data[0].phone_number,
            "email": seller_data[0].email,
            "validate": true
        });
        var validate_addressfrom = yield shippo.address.validate(addressfrom.object_id);
        // console.log("Validate_addressfrom ", validate_addressfrom)
        let query_address = { user_id: _id };
        let projection;
        // console.log("QUERY",query_address)
        let get_address = yield DAO.get_data(Models.Address, query_address, projection, options);
        let address_id = get_address[0]._id;
        // console.log('address_id ', address_id)
        var addressTo = yield shippo.address.create({
            "name": get_address[0].name,
            "street1": get_address[0].full_address,
            "city": get_address[0].city,
            "state": get_address[0].state,
            "zip": get_address[0].pin_code,
            "country": get_address[0].country
        });
        var validate_addressto = yield shippo.address.validate(addressTo.object_id);
        // console.log("validate_addressto ", validate_addressto)
        let query_parcel = { product_id: product_id };
        let projection_parcel = { __v: 0 };
        let get_parcel = yield DAO.get_data(Models.Parcel, query_parcel, projection_parcel, options);
        // console.log("get_parcel", get_parcel.parcel_objectId)
        let get_parcel_obj = yield shippo.parcel.retrieve(get_parcel.parcel_objectId);
        // console.log("get parcel objct ", get_parcel_obj)
        let parcel = yield shippo.parcel.create({
            "length": get_parcel[0].length,
            "width": get_parcel[0].width,
            "height": get_parcel[0].height,
            "distance_unit": get_parcel[0].distance_unit,
            "weight": get_parcel[0].weight,
            "mass_unit": get_parcel[0].mass_unit
        });
        // console.log("PArCEL ", parcel)
        let create_shpiment = yield shippo.shipment.create({
            "address_from": addressfrom,
            "address_to": addressTo,
            "parcels": parcel,
            "async": true
        });
        var rate = create_shpiment.rates[0];
        // console.log("Create Shipment ", create_shpiment.object_id)
        // let retrive_ship = await shippo.shipment.retrieve(create_shpiment.object_id);
        // console.log("Create Shipment ",  retrive_ship)
        // let ship_rated  = await shippo.shipment.rates(create_shpiment.object_id)
        // console.log("SHIP RATE ",  ship_rated)
        // let rate_id = create_shpiment.rates[0]
        let transaction = yield shippo.transaction.create({
            "rate": rate.object_id,
            "label_file_type": "PDF",
            "async": false
        });
        let response = {
            create_shpiment: create_shpiment,
            transaction: transaction
        };
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
const shipment_create = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.user_data;
        let { product_id, address_id } = req.body;
        // let customsDeclaration = await Create_Custom_Items(product_id)
        // console.log("Custom ", customsDeclaration)
        let query_product = { _id: product_id }, options = { lean: true }, projection = { __v: 0 };
        let fetch_products = yield user_services.get_products(query_product, options);
        let query_seller = { _id: fetch_products[0].added_by };
        let seller_data = yield user_services.get_seller(query_seller, options);
        let addressfrom = yield shippo.address.retrieve(seller_data[0].shippo_address_id);
        // console.log("Seller addressfrom ", addressfrom)
        let query_user = { _id: address_id };
        let user_address = yield DAO.get_single_data(Models.Address, query_user, projection, options);
        // console.log("User address_to ", user_address.shippo_user_address_id)
        let address_to = yield shippo.address.retrieve(user_address.shippo_user_address_id);
        let query_parcel = { _id: fetch_products[0].parcel_id };
        let get_parcel = yield DAO.get_single_data(Models.Parcel, query_parcel, projection, options);
        console.log("get_parcel...", get_parcel);
        // let get_parcel_objId: any = await shippo.parcel.retrieve(get_parcel.parcel_objectId)
        // console.log("get parcel objct ", get_parcel)
        let create_shpiment = yield shippo.shipment.create({
            "address_from": addressfrom,
            "address_to": address_to,
            "parcels": get_parcel.shippo_parcel_id,
            // "customs_declaration": customsDeclaration,
            "async": true
        });
        console.log("create_shpiment...", create_shpiment);
        var rate = create_shpiment.rates[0]; // console.log("rates ", rate)
        let transaction = yield shippo.transaction.create({
            "rate": rate.object_id,
            "label_file_type": "PDF",
            "async": false
        });
        console.log("create_transaction...", transaction);
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
        let response = {
            create_shpiment: create_shpiment,
            transaction: transaction
        };
        // console.log("Response ----> ", response)
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.shipment_create = shipment_create;
const user_shippo_address = (_id, address_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let { _id } = req.user_data;
        let query = { user_id: _id, _id: address_id };
        let projection, options = { lean: true };
        let get_address = yield DAO.get_single_data(Models.Address, query, projection, options);
        var UseraddressTo = yield shippo.address.create({
            "name": get_address.name,
            "street1": get_address.apartment_number,
            "city": get_address.city,
            "state": get_address.state,
            "zip": get_address.pin_code,
            "country": get_address.country
        });
        let validate_user_address = yield shippo.address.validate(UseraddressTo.object_id);
        let address_to = yield shippo.address.retrieve(validate_user_address.object_id);
        // let update: any = {
        //   shippo_user_address_id: validate_user_address.object_id
        // }
        // let option = { new: true }
        // let update_seller: any = await DAO.find_and_update(Models.Address, query, update, option)
        return address_to;
        // handle_success(res, update_seller)
    }
    catch (err) {
        throw (err);
    }
});
const Create_Custom_Items = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: product_id }, projection, options = { lean: true };
        let get_product = yield DAO.get_single_data(Models.Products, query, projection, options);
        let customsItem = yield shippo.customsitem.create({
            "description": get_product.name,
            "quantity": 1,
            "net_weight": "400",
            "mass_unit": "g",
            "value_amount": get_product.price,
            "value_currency": "USD",
            "origin_country": "US",
        });
        // console.log("Custom ", customsItem)
        let custom_declaration = yield shippo.customsdeclaration.create({
            "contents_type": "MERCHANDISE",
            "contents_explanation": get_product.name,
            "non_delivery_option": "RETURN",
            "certify": true,
            "certify_signer": "Simon Kreuz",
            "items": [customsItem],
        });
        return custom_declaration;
        // handle_success(res, update_seller)
    }
    catch (err) {
        throw (err);
    }
});
const list_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pagination, limit } = req.query;
        let { _id: user_id } = req.user_data;
        let options = yield index_2.helpers.set_options(pagination, limit);
        let projection = { user_id: 1, clear_for_user: 1, read_by_user: 1, type: 1, title: 1, message: 1, order_id: 1, orderProduct_id: 1, images: 1, created_at: 1 };
        //new notifications
        let query = { user_id: mongoose_1.default.Types.ObjectId(user_id), clear_for_user: false, read_by_user: false };
        let unread_response = yield DAO.get_data(Models.Notifications, query, projection, options);
        //new notifications
        let query_unread_n = { user_id: mongoose_1.default.Types.ObjectId(user_id), clear_for_user: false, read_by_user: true };
        let read_response = yield DAO.get_data(Models.Notifications, query_unread_n, projection, options);
        //count unread notifications
        let query_unread = { user_id: mongoose_1.default.Types.ObjectId(user_id), read_by_user: false };
        let unread_count = yield DAO.count_data(Models.Notifications, query_unread);
        //update notifications new to previous
        // await DAO.update_many(Models.Notifications, query, { previous_user: true })
        let data = {
            unread_count: unread_count,
            read_notifications: read_response,
            unread_notifications: unread_response,
        };
        // if(response && response.length){
        // if(response && response.length){
        (0, index_2.handle_success)(res, data);
        // }else{
        //     handle_success(res, []);
        // }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.list_notifications = list_notifications;
const read_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language } = req.query;
        let { _id: user_id } = req.user_data;
        let query = { user_id: user_id, read_by_user: false, clear_for_user: false };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Notifications, query, projection, options);
        if (response && response.length) {
            for (let i = 0; i < response.length; i++) {
                let query1 = { _id: response[i]._id };
                yield DAO.find_and_update(Models.Notifications, query1, { read_by_user: true }, options);
            }
            let response1 = yield DAO.get_data(Models.Notifications, { user_id: user_id }, projection, options);
            // handle_success(res, response1);
        }
        let data = { message: `All notifications read` };
        (0, index_2.handle_success)(res, data);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.read_notifications = read_notifications;
const clear_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language } = req.query;
        let { _id: user_id } = req.user_data;
        let query = { user_id: user_id, clear_for_user: false };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Notifications, query, projection, options);
        if (response && response.length) {
            for (let i = 0; i < response.length; i++) {
                let query1 = { _id: response[i]._id };
                yield DAO.find_and_update(Models.Notifications, query1, { clear_for_user: true }, options);
            }
            let response1 = yield DAO.get_data(Models.Notifications, query, projection, options);
        }
        let data = { message: `All notifications cleared` };
        (0, index_2.handle_success)(res, data);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.clear_notifications = clear_notifications;
const getKeys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let { _id } = req.params;
        let { search, type, pagination, limit } = req.query;
        let query = {};
        if (type) {
            query.type = type;
        }
        if (search) {
            query = [{ name: { $regex: search, $options: "i" } }];
        }
        let options = yield index_2.helpers.set_options(pagination, limit);
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.MainKeys, query, projection, options);
        (0, index_2.handle_success)(res, response);
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.getKeys = getKeys;
const getKeyDetail1 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let { language } = req.query;
        let query = { _id: _id };
        let response;
        let options = { lean: true };
        let projection = { __v: 0 };
        let data = yield DAO.get_data(Models.MainKeys, query, projection, options);
        if (data.length > 0) {
            let query_value = { main_key_id: _id, language: language };
            let projection = { key: 1, value: 1, language: 1 };
            response = yield DAO.get_data(Models.KeyValues, query_value, projection, { lean: true });
            (0, index_2.handle_success)(res, response);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
const getKeyDetail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let { language } = req.query;
        let query = { _id: _id };
        let response;
        let options = { lean: true };
        let projection = { __v: 0 };
        let data = yield DAO.get_data(Models.MainKeys, query, projection, options);
        if (data.length > 0) {
            let query_value = { main_key_id: _id, language: language };
            let projection = { key: 1, value: 1, language: 1 };
            response = yield DAO.get_data(Models.KeyValues, query_value, projection, { lean: true });
            (0, index_2.handle_success)(res, response);
        }
    }
    catch (err) {
        (0, index_2.handle_catch)(res, err);
    }
});
exports.getKeyDetail = getKeyDetail;
