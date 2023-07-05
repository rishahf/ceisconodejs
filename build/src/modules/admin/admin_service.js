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
exports.edit_language = exports.get_variants_detail = exports.edit_faqs = exports.save_staff_data = exports.edit_coupon = exports.save_fashion_deals = exports.save_hot_deals = exports.save_deals = exports.make_products = exports.fetch_seller_data = exports.make_seller_response = exports.save_session_data_seller = exports.generate_seller_token = exports.set_seller_data = exports.verify_seller_info = exports.make_banners_response = exports.save_banners = exports.make_brand_response = exports.save_brands = exports.add_sub_subcategories = exports.save_sub_categories = exports.make_product_type_response = exports.make_subcategory_response = exports.make_category_response = exports.save_categories = exports.send_broadcast_push = exports.send_broadcast_email = exports.fetch_reviews_data = exports.fetch_Orders_data = exports.get_product_detail = exports.make_products_response = exports.verify_admin_info = exports.check_content = exports.fetch_user_data = exports.make_user_response = exports.generate_user_token = exports.total_ratings = exports.total_reviews = exports.total_earnings = exports.fetch_recent_products = exports.fetch_recent_users = exports.fetch_total_count = exports.activate_deactivate = exports.verify_unverify = exports.block_delete_data = exports.make_admin_response = exports.update_language = exports.save_session_data = exports.fetch_admin_token = exports.generate_admin_token = void 0;
exports.editKeyValue = exports.getAllKeys = exports.saveKeyValue = exports.getMainKeys = exports.saveMainKey = exports.fetch_seller = exports.fetch_sellers_emails = exports.listing_users_sellers = exports.ReadNotification = exports.clearNotifications = exports.markReadNotifications = exports.getNotifications = exports.fetch_sellers_fcm_token = exports.fetch_users_fcm_token = exports.fetch_sellers = exports.save_parcel = exports.make_fashion_deals_response = exports.get_fashiondeals_detail = exports.get_hotdeals_detail = exports.make_hot_deals_response = exports.get_deals_detail = exports.make_deals_response = void 0;
const DAO = __importStar(require("../../DAO/index"));
const Models = __importStar(require("../../models"));
const index_1 = require("../../config/index");
const admin_scope = index_1.app_constant.scope.admin;
const user_scope = index_1.app_constant.scope.user;
const seller_scope = index_1.app_constant.scope.seller;
const index_2 = require("../../middlewares/index");
const middlewares_1 = require("../../middlewares");
const middlewares_2 = require("../../middlewares");
const list_orders = __importStar(require("./list_orders"));
// const Moment = require('moment-timezone');
// const MomentRange = require('moment-range');
// const moment = MomentRange.extendMoment(Moment);
// const salt_rounds = app_constant.salt_rounds;
// const admin_scope = app_constant.scope.admin;
// const user_scope = app_constant.scope.user;
const generate_admin_token = (_id, req_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token_data = {
            _id: _id,
            scope: admin_scope,
            collection: Models.Admin,
            token_gen_at: +new Date()
        };
        let response = yield fetch_admin_token(token_data, req_data);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.generate_admin_token = generate_admin_token;
const fetch_admin_token = (token_data, req_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { fcm_token } = req_data;
        let access_token = yield (0, index_2.generate_token)(token_data);
        let response = yield save_session_data(access_token, token_data, fcm_token);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_admin_token = fetch_admin_token;
const save_session_data = (access_token, token_data, fcm_token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: admin_id, token_gen_at } = token_data;
        let set_data = {
            type: "ADMIN",
            admin_id: admin_id,
            access_token: access_token,
            token_gen_at: token_gen_at,
            fcm_token: fcm_token,
            created_at: +new Date()
        };
        let response = yield DAO.save_data(Models.Sessions, set_data);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.save_session_data = save_session_data;
const update_language = (_id, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: _id };
        let update = { language: language };
        let options = { new: true };
        yield DAO.find_and_update(Models.Admin, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
exports.update_language = update_language;
const make_admin_response = (data, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { admin_id, access_token, token_gen_at } = data;
        let query = { _id: admin_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Admin, query, projection, options);
        if (fetch_data.length) {
            fetch_data[0].access_token = access_token;
            fetch_data[0].token_gen_at = token_gen_at;
            return fetch_data[0];
        }
        else {
            throw yield (0, index_2.handle_custom_error)('UNAUTHORIZED', language);
        }
    }
    catch (err) {
        throw err;
    }
});
exports.make_admin_response = make_admin_response;
const block_delete_data = (data, collection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, is_blocked, is_deleted } = data;
        let message;
        let query = { _id: _id };
        let data_to_update = {};
        if (typeof is_blocked !== "undefined" && is_blocked !== null) {
            data_to_update.is_blocked = is_blocked;
            if (is_blocked == true || is_blocked == 'true') {
                message = "User blocked successfully.";
            }
            else if (is_blocked == false || is_blocked == 'false') {
                message = "User unblocked successfully.";
            }
        }
        if (typeof is_deleted !== "undefined" && is_deleted !== null) {
            data_to_update.is_deleted = is_deleted;
            if (is_deleted == true || is_deleted == 'true') {
                message = "User deleted successfully.";
            }
            else if (is_deleted == false || is_deleted == 'false') {
                message = "User active successfully.";
            }
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(collection, query, data_to_update, options);
        let query_data = {
            $or: [
                { seller_id: _id },
                { user_id: _id }
            ]
        };
        yield DAO.remove_data(Models.Sessions, query_data);
        return { message: message };
    }
    catch (err) {
        throw err;
    }
});
exports.block_delete_data = block_delete_data;
const verify_unverify = (data, collection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, admin_verified } = data;
        console.log(data);
        let message;
        let query = { _id: _id };
        let update = {};
        if (typeof admin_verified !== "undefined" && admin_verified !== null) {
            update.admin_verified = admin_verified;
            if (admin_verified == true || admin_verified == 'true') {
                message = "User verified successfully.";
            }
            else if (admin_verified == false || admin_verified == 'false') {
                message = "User unverified successfully.";
            }
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(collection, query, update, options);
        return { message: message };
    }
    catch (err) {
        throw err;
    }
});
exports.verify_unverify = verify_unverify;
const activate_deactivate = (data, collection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, account_status } = data;
        let message;
        let query = { _id: _id };
        let update = { account_status: account_status };
        let options = { new: true };
        let response = yield DAO.find_and_update(collection, query, update, options);
        // remove login details
        if (account_status == 'DEACTIVATED') {
            let query = {
                $or: [
                    { seller_id: _id },
                    { user_id: _id }
                ]
            };
            yield DAO.remove_many(Models.Sessions, query);
        }
        if (account_status == 'DEACTIVATED') {
            message = "User account deactivated successfully.";
        }
        else if (account_status == 'ACTIVATED') {
            message = "User account activated successfully.";
        }
        console.log('mess ', message);
        return { message: message };
    }
    catch (err) {
        throw err;
    }
});
exports.activate_deactivate = activate_deactivate;
const fetch_total_count = (collection, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield DAO.count_data(collection, query);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_total_count = fetch_total_count;
const fetch_recent_users = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { is_deleted: false };
        let projection = { __v: 0, password: 0, otp: 0, fp_otp: 0 };
        let options = { lean: true, sort: { _id: -1 }, limit: 20 };
        let response = yield DAO.get_data(Models.Users, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_recent_users = fetch_recent_users;
const fetch_recent_products = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { is_deleted: false };
        let projection = { __v: 0 };
        let options = { lean: true, sort: { _id: -1 }, limit: 20 };
        let populate = [
            { path: 'brand_id', select: 'name' }
        ];
        // let response = await DAO.get_data(Models.Products, query, projection, options)
        let response = yield DAO.populate_data(Models.Products, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_recent_products = fetch_recent_products;
const total_earnings = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { order_status: "DELIVERED" };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(Models.OrderProducts, query, projection, options);
        let total_earnings = 0;
        if (retrive_data.length) {
            for (let i = 0; i < retrive_data.length; i++) {
                total_earnings += retrive_data[i].admin_commision;
            }
        }
        return total_earnings;
    }
    catch (err) {
        throw err;
    }
});
exports.total_earnings = total_earnings;
const total_reviews = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        let count = yield DAO.count_data(Models.Reviews, query);
        return count;
    }
    catch (err) {
        throw err;
    }
});
exports.total_reviews = total_reviews;
const total_ratings = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        let projection = { __v: 0 };
        let options = { lean: true };
        let reviews = yield DAO.get_data(Models.Reviews, query, projection, options);
        let total_ratings = 0;
        if (reviews.length) {
            for (let i = 0; i < reviews.length; i++) {
                total_ratings += reviews[i].ratings;
            }
        }
        return total_ratings;
    }
    catch (err) {
        throw err;
    }
});
exports.total_ratings = total_ratings;
const generate_user_token = (_id, req_data, device_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token_data = {
            _id: _id,
            scope: user_scope,
            collection: Models.Users,
            token_gen_at: +new Date(),
        };
        let response = yield fetch_user_token(token_data, req_data, device_type);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.generate_user_token = generate_user_token;
const fetch_user_token = (token_data, req_data, device_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let access_token = yield (0, index_2.generate_token)(token_data);
        console.log('access _token ');
        let response = yield save_user_session_data(access_token, token_data, req_data, device_type);
        return response;
    }
    catch (err) {
        throw err;
    }
});
const save_user_session_data = (access_token, token_data, req_data, device_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: user_id, token_gen_at } = token_data, { fcm_token } = req_data;
        let set_data = {
            type: "USER",
            user_id: user_id,
            access_token: access_token,
            token_gen_at: token_gen_at,
            created_at: +new Date()
        };
        if (device_type != null || device_type != undefined) {
            set_data.device_type = device_type;
        }
        if (fcm_token != null || fcm_token != undefined) {
            set_data.fcm_token = fcm_token;
        }
        let response = yield DAO.save_data(Models.Sessions, set_data);
        return response;
    }
    catch (err) {
        throw err;
    }
});
const make_user_response = (token_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { user_id, access_token, device_type, fcm_token, language, token_gen_at } = token_data;
        let query = { _id: user_id };
        let projection = {
            __v: 0,
            password: 0,
            otp: 0,
            fp_otp: 0,
            unique_code: 0,
            fp_otp_verified: 0,
            is_blocked: 0,
            is_deleted: 0
        };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Users, query, projection, options);
        if (response.length) {
            response[0].access_token = access_token;
            response[0].device_type = device_type;
            response[0].fcm_token = fcm_token;
            response[0].token_gen_at = token_gen_at;
            return response[0];
        }
        else {
            throw yield (0, index_2.handle_custom_error)("UNAUTHORIZED", language);
        }
    }
    catch (err) {
        throw err;
    }
});
exports.make_user_response = make_user_response;
const fetch_user_data = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { password: 0, otp: 0, fp_otp: 0, unique_code: 0, __v: 0, forgot_otp: 0 };
        let response = yield DAO.get_data(Models.Users, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_user_data = fetch_user_data;
const check_content = (type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { type: type };
        let projection = { __v: 0 };
        let options = { lean: true };
        return yield DAO.get_data(Models.Content, query, projection, options);
    }
    catch (err) {
        throw err;
    }
});
exports.check_content = check_content;
const verify_admin_info = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Admin, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.verify_admin_info = verify_admin_info;
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
const save_staff_data = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, password, image, phone_number, country_code, roles } = data;
        let hassed_password = yield index_2.helpers.bcrypt_password(password);
        let set_data = {
            name: name,
            email: email,
            password: hassed_password,
            image: image,
            phone_number: phone_number,
            country_code: country_code,
            roles: roles,
            created_at: +new Date()
        };
        let response = yield DAO.save_data(Models.Admin, set_data);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.save_staff_data = save_staff_data;
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
const make_products_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield DAO.aggregate_data(Models.Products, query, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.make_products_response = make_products_response;
const make_products = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield DAO.aggregate_data(Models.Products, query, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.make_products = make_products;
const get_product_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'brand_id', select: 'name' },
            { path: 'subcategory_id', select: 'name' },
            { path: "sub_subcategory_id", select: 'name' },
            { path: 'product_details', select: 'key value' },
            // { path: 'deliverable_cities', select: 'city_name' }
        ];
        let respone = yield DAO.populate_data(Models.Products, query, projection, options, populate);
        // console.log("------RESPONSE-------",respone)
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_product_detail = get_product_detail;
const fetch_Orders_data = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: "product", select: "_id name price images  discount_price" },
            { path: "user_id", select: "name profile_pic" },
            { path: "address_id", select: "" }
        ];
        let respo = yield DAO.populate_data(Models.Orders, query, projection, options, populate);
        //   console.log("RESPO ", respo)
        return respo;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_Orders_data = fetch_Orders_data;
const fetch_reviews_data = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: "user_id", select: "name profile_pic" },
        ];
        let respo = yield DAO.populate_data(Models.Reviews, query, projection, options, populate);
        //   console.log("RESPO ", respo)
        return respo;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_reviews_data = fetch_reviews_data;
const make_category_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Category, query, projection, options);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_category_response = make_category_response;
const make_subcategory_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'category_id', select: 'name' }
        ];
        let response = yield DAO.populate_data(Models.SubCategory, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_subcategory_response = make_subcategory_response;
const make_product_type_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'subcategory_id', select: 'name' }
        ];
        let response = yield DAO.populate_data(Models.Sub_subcategories, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_product_type_response = make_product_type_response;
const make_brand_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'product_id', select: ' ' }
        ];
        let response = yield DAO.populate_data(Models.Brands, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_brand_response = make_brand_response;
const make_banners_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Banners, query, projection, options);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_banners_response = make_banners_response;
const save_categories = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name } = data;
        let set_data = {
            name: name,
            created_at: +new Date()
        };
        let response = yield DAO.save_data(Models.Category, set_data);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.save_categories = save_categories;
const save_sub_categories = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, category_id } = data;
        let set_data = {
            name: name,
            category_id: category_id,
            is_deleted: false,
            created_at: +new Date()
        };
        let response = yield DAO.save_data(Models.SubCategory, set_data);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.save_sub_categories = save_sub_categories;
const add_sub_subcategories = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, subcategory_id } = data;
        let set_data = {
            name: name,
            subcategory_id: subcategory_id,
            is_deleted: false,
            created_at: +new Date()
        };
        let response = yield DAO.save_data(Models.Sub_subcategories, set_data);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.add_sub_subcategories = add_sub_subcategories;
const save_brands = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name } = data;
        let set_data = {
            name: name,
            created_at: +new Date()
        };
        let response = yield DAO.save_data(Models.Brands, set_data);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.save_brands = save_brands;
const save_banners = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { images, description, image_place } = data;
        let set_data = {
            images: images,
            description: description,
            image_place: image_place,
            created_at: +new Date()
        };
        let response = yield DAO.save_data(Models.Banners, set_data);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.save_banners = save_banners;
const save_deals = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { image, subcategory_id, title, sub_title, price_description } = data;
        let set_data = {
            image: image,
            subcategory_id: subcategory_id,
            title: title,
            sub_title: sub_title,
            price_description: price_description,
            created_at: +new Date()
        };
        let response = yield DAO.save_data(Models.Deals_of_the_day, set_data);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.save_deals = save_deals;
const save_hot_deals = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { image, subcategory_id, title, sub_title, price_description } = data;
        let set_data = {
            image: image,
            subcategory_id: subcategory_id,
            title: title,
            sub_title: sub_title,
            price_description: price_description,
            created_at: +new Date()
        };
        let response = yield DAO.save_data(Models.Hot_deals, set_data);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.save_hot_deals = save_hot_deals;
const save_fashion_deals = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { image, subcategory_id, brand_id, title, sub_title, price_description } = data;
        let set_data = {
            image: image,
            subcategory_id: subcategory_id,
            brand_id: brand_id,
            title: title,
            sub_title: sub_title,
            price_description: price_description,
            created_at: +new Date(),
        };
        let response = yield DAO.save_data(Models.FashionDeals, set_data);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.save_fashion_deals = save_fashion_deals;
const fetch_users = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { email: 1, _id: 1 };
        let options = { lean: true, sort: { _id: -1 } };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        // console.log(fetch_data)
        let user_ids = [];
        if (fetch_data.length) {
            for (let value of fetch_data) {
                user_ids.push(value._id);
                // user_ids.push(value.email)
            }
        }
        // console.log("user_ids --> ", user_ids)
        let user_emails = [];
        if (fetch_data.length) {
            for (let value of fetch_data) {
                // user_ids.push(value._id)
                user_emails.push(value.email);
            }
        }
        // console.log("user email s--> ", user_emails)
        return user_ids;
    }
    catch (err) {
        throw err;
    }
});
const fetch_sellers = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { email: 1, _id: 1 };
        let options = { lean: true, sort: { _id: -1 } };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        // console.log(fetch_data)
        let user_ids = [];
        if (fetch_data.length) {
            for (let value of fetch_data) {
                user_ids.push(value._id);
                // user_ids.push(value.email)
            }
        }
        // console.log("user_ids --> ", user_ids)
        let user_emails = [];
        if (fetch_data.length) {
            for (let value of fetch_data) {
                // user_ids.push(value._id)
                user_emails.push(value.email);
            }
        }
        // console.log("user email s--> ", user_emails)
        return user_ids;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_sellers = fetch_sellers;
const fetch_users_fcms = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { email: 1, _id: 1 };
        let options = { lean: true, sort: { _id: -1 } };
        let fetch_data = yield DAO.get_data(Models.Sessions, query, projection, options);
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
});
const fetch_sellers_fcms = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { email: 1, _id: 1 };
        let options = { lean: true, sort: { _id: -1 } };
        let fetch_data = yield DAO.get_data(Models.Sessions, query, projection, options);
        // console.log(fetch_data)
        let user_fcms = [];
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
});
const fetch_users_emails = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { email: 1, _id: 1 };
        let options = { lean: true, sort: { _id: -1 } };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        // console.log(fetch_data)
        let user_emails = [];
        if (fetch_data.length) {
            for (let value of fetch_data) {
                // user_ids.push(value._id)
                user_emails.push(value.email);
            }
        }
        console.log("user email s--> ", user_emails);
        return user_emails;
    }
    catch (err) {
        throw err;
    }
});
const fetch_sellers_emails = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { email: 1, _id: 1 };
        let options = { lean: true, sort: { _id: -1 } };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        // console.log(fetch_data)
        let seller_emails = [];
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
});
exports.fetch_sellers_emails = fetch_sellers_emails;
const fetch_user = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true, sort: { _id: -1 } };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        // console.log(fetch_data)
        // let user_ids: any = []
        // if (fetch_data.length) {
        //     for (let value of fetch_data) {
        //         user_ids.push(value._id)
        //         user_ids.push(value.email)
        //     }
        // }
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
const fetch_seller = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true, sort: { _id: -1 } };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        // console.log(fetch_data)
        // let user_ids: any = []
        // if (fetch_data.length) {
        //     for (let value of fetch_data) {
        //         user_ids.push(value._id)
        //         user_ids.push(value.email)
        //     }
        // }
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_seller = fetch_seller;
const fetch_users_token = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { user_id: user_id, fcm_token: { $ne: null } };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
const fetch_users_fcm_token = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { user_id: user_id, fcm_token: { $nin: [null, ''] } };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sessions, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_users_fcm_token = fetch_users_fcm_token;
const fetch_sellers_fcm_token = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { seller_id: user_id, fcm_token: { $nin: [null, ''] } };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sessions, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_sellers_fcm_token = fetch_sellers_fcm_token;
const send_broadcast_email = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("broadcast req.body ---- ", data);
        let { send_to, user_ids, subject, message, language } = data;
        let default_title;
        if (language == 'ENGLISH') {
            default_title = "Email Received";
        }
        else {
            default_title = "رسالة الكترونية تلقتها";
        }
        let users;
        let sellers;
        if (send_to == 1) {
            let query = { is_deleted: false };
            users = yield fetch_user(query);
            sellers = yield fetch_seller(query);
            if (users && users.length) {
                for (let value of users) {
                    let { email } = value;
                    // console.log("value ", value)
                    let data_to_save = {
                        user_id: value._id,
                        title: default_title,
                        message: message,
                        type: 'NEW_PRODUCTS_ADDED',
                        created_at: +new Date()
                    };
                    yield DAO.save_data(Models.Notifications, data_to_save);
                    // fetch device token
                    let user_token_data = yield fetch_users_fcm_token(value._id);
                    // await send_push(user_token_data, data_to_save)
                    console.log(' ---- sent to all users ---');
                    yield (0, middlewares_1.send_email)(email, subject, message);
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
                    yield DAO.save_data(Models.Notifications, data_to_save);
                    console.log(" ---- sent to all sellers ---");
                    yield (0, middlewares_1.send_email)(email, subject, message);
                }
            }
        }
        else {
            let query = { _id: { $in: user_ids }, is_deleted: false };
            users = yield fetch_user(query);
            sellers = yield fetch_seller(query);
            // console.log("Get Data: ",users)
            if (users && users.length) {
                for (let value of users) {
                    let { email } = value;
                    // console.log("email ", email)
                    let data_to_save = {
                        user_id: value._id,
                        title: default_title,
                        message: message,
                        type: 'NEW_PRODUCTS_ADDED',
                        created_at: +new Date()
                    };
                    yield DAO.save_data(Models.Notifications, data_to_save);
                    // fetch device token
                    let user_token_data = yield fetch_users_fcm_token(value._id);
                    // await send_push(user_token_data, data_to_save)
                    yield (0, middlewares_1.send_email)(email, subject, message);
                }
            }
            if (sellers && sellers.length) {
                for (let value of sellers) {
                    let { email } = value;
                    // console.log("email ", email)
                    let data_to_save = {
                        seller_id: value._id,
                        title: default_title,
                        message: message,
                        type: 'NEW_PRODUCTS_ADDED',
                        created_at: +new Date()
                    };
                    yield DAO.save_data(Models.Notifications, data_to_save);
                    yield (0, middlewares_1.send_email)(email, subject, message);
                }
            }
        }
    }
    catch (err) {
        throw err;
    }
});
exports.send_broadcast_email = send_broadcast_email;
const send_broadcast_push = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { send_to, user_ids, subject, message, language } = data;
        let default_title;
        if (language == "ENGLISH") {
            default_title = "New Notification Received";
        }
        else {
            default_title = "تم استلام إشعار جديد";
        }
        let users;
        let sellers;
        if (send_to == 1) {
            // let query = { type: { $in: ['USER'] } , fcm_token : { $nin: ['',null]}}
            let query = { is_deleted: false };
            users = yield fetch_users(query);
            sellers = yield fetch_sellers(query);
        }
        else {
            let query = { _id: { $in: user_ids }, is_deleted: false };
            console.log('query --- notification ----- ', query);
            users = yield fetch_users(query);
            sellers = yield fetch_sellers(query);
        }
        if (users && users.length) {
            for (let value of users) {
                let data_to_save = {
                    user_id: value._id,
                    title: default_title,
                    message: message,
                    type: 'NEW_NOTIFICATION',
                    created_at: +new Date()
                };
                yield DAO.save_data(Models.Notifications, data_to_save);
                // fetch device token
                let user_token_data = yield fetch_users_fcm_token(value);
                yield send_push(user_token_data, data_to_save);
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
                yield DAO.save_data(Models.Notifications, data_to_save);
                // fetch device token
                let user_token_data = yield fetch_sellers_fcm_token(value);
                yield send_push(user_token_data, data_to_save);
            }
        }
    }
    catch (err) {
        throw err;
    }
});
exports.send_broadcast_push = send_broadcast_push;
const send_push = (data, notification_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (data.length) {
            for (let value of data) {
                let { fcm_token } = value;
                if (fcm_token != undefined) {
                    yield (0, middlewares_2.send_notification)(notification_data, fcm_token);
                }
            }
        }
    }
    catch (err) {
        throw err;
    }
});
const verify_seller_info = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        // console.log(fetch_data)
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.verify_seller_info = verify_seller_info;
const set_seller_data = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, image, country_code, phone_number, password } = data;
        // bycryt password
        let hassed_password = yield index_2.helpers.bcrypt_password(password);
        // fetch otp
        let data_to_save = {
            name: name,
            email: email.toLowerCase(),
            country_code: country_code,
            phone_number: phone_number,
            password: hassed_password,
            image: image,
            created_at: +new Date()
        };
        let response = yield DAO.save_data(Models.Sellers, data_to_save);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.set_seller_data = set_seller_data;
const generate_seller_token = (_id, req_data, device_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token_data = {
            _id: _id,
            scope: seller_scope,
            collection: Models.Sellers,
            token_gen_at: +new Date(),
        };
        let access_token = yield (0, index_2.generate_token)(token_data);
        let response = yield save_session_data_seller(access_token, token_data, req_data, device_type);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.generate_seller_token = generate_seller_token;
const save_session_data_seller = (access_token, token_data, req_data, device_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id, token_gen_at } = token_data;
        let set_data = {
            type: "SELLER",
            seller_id: seller_id,
            access_token: access_token,
            token_gen_at: token_gen_at,
            created_at: +new Date(),
        };
        if (device_type != null || device_type != undefined) {
            set_data.device_type = device_type;
        }
        let response = yield DAO.save_data(Models.Sessions, set_data);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.save_session_data_seller = save_session_data_seller;
const make_seller_response = (data, language) => __awaiter(void 0, void 0, void 0, function* () {
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
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        if (fetch_data.length) {
            fetch_data[0].access_token = access_token;
            fetch_data[0].token_gen_at = token_gen_at;
            return fetch_data[0];
        }
        else {
            throw yield (0, index_2.handle_custom_error)("UNAUTHORIZED", language);
        }
    }
    catch (err) {
        throw err;
    }
});
exports.make_seller_response = make_seller_response;
const fetch_seller_data = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { password: 0, __v: 0 };
        let response = yield DAO.get_data(Models.Sellers, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_seller_data = fetch_seller_data;
const edit_coupon = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let set_data = {};
        if (data.name) {
            set_data.name = data.name;
        }
        if (data.start_date) {
            set_data.start_date = data.start_date;
        }
        if (data.end_date) {
            set_data.end_date = data.end_date;
        }
        if (data.coupon_type) {
            set_data.coupon_type = data.coupon_type;
            if (data.coupon_type == 'FIXED') {
                set_data.price = data.price;
                set_data.max_discount = 0;
            }
            else {
                set_data.max_discount = data.max_discount;
                set_data.price = 0;
            }
        }
        // if (data.price) { set_data.price = data.price }
        // if (data.max_discount) { set_data.max_discount = data.max_discount }
        // console.log("SET DATA --> ", set_data)
        return set_data;
    }
    catch (err) {
        throw err;
    }
});
exports.edit_coupon = edit_coupon;
const edit_language = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let set_data = {};
        if (data.key) {
            set_data.key = data.key;
        }
        if (data.english) {
            set_data.english = data.english;
        }
        if (data.arabic) {
            set_data.arabic = data.arabic;
        }
        return set_data;
    }
    catch (err) {
        throw err;
    }
});
exports.edit_language = edit_language;
const edit_faqs = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let set_data = {};
        if (data.question) {
            set_data.question = data.question;
        }
        if (data.answer) {
            set_data.answer = data.answer;
        }
        return set_data;
    }
    catch (err) {
        throw err;
    }
});
exports.edit_faqs = edit_faqs;
const get_variants_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        // let populate = [
        //     { path:"product_id", select:"name"}
        // ]
        let respone = yield DAO.get_data(Models.Product_Variations, query, projection, options);
        // console.log(respone)
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_variants_detail = get_variants_detail;
const make_deals_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Deals_of_the_day, query, projection, options);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_deals_response = make_deals_response;
const get_deals_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'subcategory_id', select: '' },
        ];
        let respone = yield DAO.populate_data(Models.Deals_of_the_day, query, projection, options, populate);
        // console.log("------RESPONSE-------",respone)
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_deals_detail = get_deals_detail;
const make_hot_deals_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Hot_deals, query, projection, options);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_hot_deals_response = make_hot_deals_response;
const get_hotdeals_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'subcategory_id', select: 'name' },
        ];
        let respone = yield DAO.populate_data(Models.Hot_deals, query, projection, options, populate);
        // console.log("------RESPONSE-------",respone)
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_hotdeals_detail = get_hotdeals_detail;
const get_fashiondeals_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'brand_id', select: 'name' },
        ];
        let respone = yield DAO.populate_data(Models.FashionDeals, query, projection, options, populate);
        // console.log("------RESPONSE-------",respone)
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_fashiondeals_detail = get_fashiondeals_detail;
const make_fashion_deals_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.FashionDeals, query, projection, options);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_fashion_deals_response = make_fashion_deals_response;
const save_parcel = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { order_id, length, width, height, distance_unit, weight, mass_unit } = data;
        let set_data = {
            order_id: order_id,
            length: length,
            width: width,
            height: height,
            distance_unit: distance_unit,
            weight: weight,
            mass_unit: mass_unit
        };
        let response = yield DAO.save_data(Models.Parcel, set_data);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.save_parcel = save_parcel;
const getNotifications = (admin_id, req_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pagination, limit } = req_data;
        let options = yield index_2.helpers.set_options(pagination, limit);
        let projection = { admin_id: 1, read_by_admin: 1, clear_for_admin: 1, order_product_id: 1, order_id: 1, title: 1, type: 1, message: 1, created_at: 1, };
        let query = { admin_id: admin_id, read_by_admin: false, clear_for_admin: false };
        let unread_notifications = yield DAO.get_data(Models.Notifications, query, projection, options);
        let query1 = { admin_id: admin_id, read_by_admin: true, clear_for_admin: false };
        let read_notifications = yield DAO.get_data(Models.Notifications, query1, projection, options);
        //unreead count 
        let unread_count = yield DAO.count_data(Models.Notifications, query);
        let response = {
            unread_count: unread_count,
            unread_notifications: unread_notifications,
            read_notifications: read_notifications,
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.getNotifications = getNotifications;
const markReadNotifications = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language } = req.query;
        let { _id: admin_id } = req.user_data;
        let qury = { admin_id: admin_id, read_by_admin: false };
        let options = { lean: true };
        let projection = { __v: 0 };
        let update = {
            read_by_admin: true,
        };
        let resp = yield DAO.get_data(Models.Notifications, qury, projection, options);
        if (resp && resp.length) {
            // for(let i=0; i<resp.length;i++){
            //   let query1 = { _id: resp[i]._id };
            //   await DAO.find_and_update(Models.Notifications,query1, update,options)
            // }
            yield DAO.update_many(Models.Notifications, qury, update);
        }
        // let response:any = await DAO.get_data(Models.Notifications,qury,projection,options)
        // if(response && response.length){
        //   return response
        // }
        let data = { message: 'All notifications read' };
        return data;
    }
    catch (err) {
        throw err;
    }
});
exports.markReadNotifications = markReadNotifications;
const clearNotifications = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language } = req.query;
        let { _id: admin_id } = req.user_data;
        let qury = { admin_id: admin_id, clear_for_admin: false };
        let options = { lean: true };
        let projection = { __v: 0 };
        let update = {
            clear_for_admin: true,
        };
        let resp = yield DAO.get_data(Models.Notifications, qury, projection, options);
        if (resp && resp.length) {
            yield DAO.update_many(Models.Notifications, qury, update);
            // for(let i=0; i<resp.length;i++){
            //   let query1 = { _id:resp[i]._id }
            //   await DAO.find_and_update(Models.Notifications,query1, update,options)
            // }
        }
        let response = yield DAO.get_data(Models.Notifications, qury, projection, options);
        // if(response && response.length){
        //   return response
        // }
        let data = { message: "All notifications cleared" };
        return data;
    }
    catch (err) {
        throw err;
    }
});
exports.clearNotifications = clearNotifications;
const ReadNotification = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, language } = req.params;
        let { _id: admin_id } = req.user_data;
        let query = { _id: _id, admin_id: admin_id };
        let options = { new: true };
        let projection = { __v: 0 };
        let update = {
            read_by_admin: true
        };
        let response = yield DAO.find_and_update(Models.Notifications, query, update, options);
        // let response:any = await DAO.get_data(Models.Notifications,query,projection,options)
        let data = { message: "Notification Read" };
        return data;
    }
    catch (err) {
        throw err;
    }
});
exports.ReadNotification = ReadNotification;
const listing_users_sellers = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language, search } = req.query;
        let { _id: admin_id } = req.user_data;
        let query1 = [
            yield list_orders.match_delete(),
            yield list_orders.set_type(),
            yield list_orders.filter_search(req.query)
        ];
        let query2 = [
            yield list_orders.match_delete(),
            yield list_orders.set_seller_type(),
            yield list_orders.filter_search(req.query),
        ];
        let options = { new: true };
        let projection = { __v: 0 };
        let users_list = yield DAO.aggregate_data(Models.Users, query1, options);
        let sellers_list = yield DAO.aggregate_data(Models.Sellers, query2, options);
        let data = [...users_list, ...sellers_list];
        return { data: data };
    }
    catch (err) {
        throw err;
    }
});
exports.listing_users_sellers = listing_users_sellers;
const saveMainKey = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, type } = req.body;
        let save_data = { name: name, type: type };
        let data = yield DAO.save_data(Models.MainKeys, save_data);
        return { message: 'Key Saved', data: data };
    }
    catch (err) {
        throw err;
    }
});
exports.saveMainKey = saveMainKey;
const getMainKeys = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, type } = req.query;
        let query = { type: type };
        if (search != undefined) {
            query = [
                { name: { $regex: search, $options: "i" } }
            ];
        }
        let projection = { __v: 0 }, options = { lean: true };
        let data = yield DAO.get_data(Models.MainKeys, query, projection, options);
        return data;
    }
    catch (err) {
        throw err;
    }
});
exports.getMainKeys = getMainKeys;
const saveKeyValue = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, key, value, language } = req.body;
        let save_data = { main_key_id: _id, key: key.trim(), value: value.trim(), language: language };
        let data = yield DAO.save_data(Models.KeyValues, save_data);
        return { message: 'Value Saved', data: data };
    }
    catch (err) {
        throw err;
    }
});
exports.saveKeyValue = saveKeyValue;
const editKeyValue = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let { key, value, language } = req.body;
        let query = { _id: _id };
        let options = { new: true };
        let update = {};
        if (key) {
            update.key = key.trim();
        }
        ;
        if (value) {
            update.value = value.trim();
        }
        ;
        if (language) {
            update.language = language;
        }
        ;
        console.log('updated key-value', update);
        yield DAO.find_and_update(Models.KeyValues, query, update, options);
        let projection = { key: 1, value: 1, language: 1 };
        let response = yield DAO.get_data(Models.KeyValues, query, projection, { lean: true });
        return { message: 'Edit successfully', data: response[0] };
    }
    catch (err) {
        throw err;
    }
});
exports.editKeyValue = editKeyValue;
const getAllKeys = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        console.log('query', query);
        let response = {};
        let projection = { __v: 0 }, options = { lean: true };
        let data = yield DAO.get_data(Models.MainKeys, query, projection, options);
        if (data.length > 0) {
            let query_value = { main_key_id: _id, language: 'ENGLISH' };
            let projection = { key: 1, value: 1, language: 1 };
            let English = yield DAO.get_data(Models.KeyValues, query_value, projection, { lean: true });
            response.English = English;
            let query_value1 = { main_key_id: _id, language: 'ARABIC' };
            let Arabic = yield DAO.get_data(Models.KeyValues, query_value1, projection, { lean: true });
            response.Arabic = Arabic;
        }
        return { data: response };
    }
    catch (err) {
        throw err;
    }
});
exports.getAllKeys = getAllKeys;
