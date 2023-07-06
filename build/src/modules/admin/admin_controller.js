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
exports.login_as_seller = exports.manage_sellers = exports.seller_details = exports.seller_listing = exports.list_banners = exports.add_banners = exports.add_brands = exports.add_sub_subcategories = exports.add_sub_category = exports.add_category = exports.send_notification = exports.delete_templates = exports.list_templates = exports.add_edit_templates = exports.delete_variables = exports.list_variables = exports.add_edit_variables = exports.manage_contact_us = exports.list_contact_us = exports.list_product_faqs = exports.delete_faqs = exports.list_faqs = exports.add_edit_faqs = exports.list_content = exports.content_detail = exports.add_edit_content = exports.delete_res_messages = exports.list_res_messages = exports.add_edit_res_msgs = exports.delete_a_user = exports.login_as_user = exports.manage_users = exports.list_user_details = exports.list_users = exports.mamage_staff_members = exports.staff_members_details = exports.list_staff_members = exports.edit_staff_members = exports.add_staff_members = exports.sales_graph = exports.product_graph = exports.seller_graph = exports.user_graph = exports.dashboard = exports.logout = exports.change_password = exports.edit_profile = exports.view_profile = exports.access_token_login = exports.login = void 0;
exports.editKeyValue = exports.getAllKeys = exports.keyValues = exports.getMainKeys = exports.mainKeys = exports.list_users_sellers = exports.clear_all_notifications = exports.read_notification = exports.marked_all_read_notifications = exports.get_notifications = exports.delete_a_parcel = exports.retrive_parcels = exports.add_a_parcel = exports.list_languagekeys = exports.add_edit_languagekeys = exports.backup_db = exports.list_orders = exports.list_product_variants = exports.product_details = exports.list_products = exports.delete_coupons = exports.get_coupons = exports.add_edit_coupons = exports.delete_fashiondeals = exports.delete_hotdeals = exports.delete_deals = exports.listing_fashion_deals_products = exports.list_fashion_deals = exports.listing_hot_deals_products = exports.list_hot_deals = exports.listing_deals_of_the_day_products = exports.list_deals_of_the_day = exports.add_fashion_deals = exports.add_hot_deals = exports.add_deals = exports.export_csv_products = exports.export_csv_seller = exports.export_csv_users = exports.delete_a_seller = void 0;
const DAO = __importStar(require("../../DAO/index"));
const Models = __importStar(require("../../models/index"));
const fastcsv = require('fast-csv');
const fs = require('fs');
const admin_helper = __importStar(require("./admin_helper"));
const admin_services = __importStar(require("./admin_service"));
const moment_1 = __importDefault(require("moment"));
const middlewares_1 = require("../../middlewares");
const joi_1 = require("joi");
const user_graph_1 = __importDefault(require("./user_graph"));
const seller_graph_1 = __importDefault(require("./seller_graph"));
const product_graph_1 = __importDefault(require("./product_graph"));
const order_graph_1 = __importDefault(require("./order_graph"));
const fetch_products = __importStar(require("./fetch_products"));
const shippo = require('shippo')(process.env.SHIPPO_TOKEN);
const index_1 = require("../../middlewares/index");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password: input_password, language } = req.body;
        let query = { email: email, is_deleted: false };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Admin, query, projection, options);
        if (fetch_data.length) {
            let { _id, password, is_blocked } = fetch_data[0];
            if (is_blocked == true) {
                throw yield (0, index_1.handle_custom_error)("ACCOUNT_BLOCKED", language);
            }
            else {
                let decrypt = yield index_1.helpers.decrypt_password(input_password, password);
                if (decrypt != true) {
                    throw yield (0, index_1.handle_custom_error)("INCORRECT_PASSWORD", language);
                }
                else {
                    // generate token
                    let generate_token = yield admin_services.generate_admin_token(_id, req.body);
                    let response = yield admin_services.make_admin_response(generate_token, language);
                    // return response
                    (0, index_1.handle_success)(res, response);
                }
            }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("NO_DATA_FOUND", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.login = login;
const access_token_login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // return response
        (0, index_1.handle_success)(res, req.user_data);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.access_token_login = access_token_login;
const view_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: admin_id } = req.user_data;
        let query = { _id: admin_id };
        // console.log(query);
        let options = { lean: true };
        let projection = { name: 1, image: 1, email: 1, phone_number: 1, city: 1, country: 1, state: 1, full_address: 1, company: 1 };
        let response = yield DAO.get_data(Models.Admin, query, projection, options);
        (0, index_1.handle_success)(res, response[0]);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.view_profile = view_profile;
const edit_profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, image, phone_number, country_code, company, country, state, city, full_address } = req.body;
        let { _id: admin_id } = req.user_data;
        console.log('req -bodyr ', req.body);
        let query = { _id: admin_id };
        let set_data = {};
        if (name != undefined) {
            set_data.name = name;
        }
        if (image != undefined) {
            set_data.image = image;
        }
        if (country_code != undefined) {
            set_data.country_code = country_code;
        }
        console.log('update ------ ', set_data);
        if (company != undefined) {
            set_data.company = company;
        }
        if (phone_number != undefined) {
            set_data.phone_number = phone_number;
        }
        if (country != undefined) {
            set_data.country = country;
        }
        if (state != undefined) {
            set_data.state = state;
        }
        if (city != undefined) {
            set_data.city = city;
        }
        if (full_address != undefined) {
            set_data.full_address = full_address;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Admin, query, set_data, options);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.edit_profile = edit_profile;
const change_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { old_password, new_password, language } = req.body, { _id: admin_id } = req.user_data;
        let query = { _id: admin_id, super_admin: false };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Admin, query, projection, options);
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
                let response = yield DAO.find_and_update(Models.Admin, query, update, options);
                // return password
                (0, index_1.handle_success)(res, response);
            }
        }
        else {
            // throw await handle_custom_error("UNAUTHORIZED", language);
            throw yield (0, index_1.handle_custom_error)("CANNOT_CHANGE_PASSWORD", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.change_password = change_password;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: admin_id } = req.user_data;
        // console.log("REq USer_data-- >", req.user_data);
        let query = { admin_id: admin_id };
        // console.log("Query-- > ", query);
        var resp = yield DAO.remove_data(Models.Sessions, query);
        // console.log(resp);
        // return response
        let response = { message: "Logout Successful" };
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.logout = logout;
const dashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { is_deleted: false };
        let total_users = yield admin_services.fetch_total_count(Models.Users, query);
        let total_sellers = yield admin_services.fetch_total_count(Models.Sellers, query);
        let total_categories = yield admin_services.fetch_total_count(Models.Category, query);
        let total_brands = yield admin_services.fetch_total_count(Models.Brands, query);
        let total_products = yield admin_services.fetch_total_count(Models.Products, query);
        let total_orders = yield admin_services.fetch_total_count(Models.OrderProducts, {});
        let recent_users = yield admin_services.fetch_recent_users();
        let recent_products = yield admin_services.fetch_recent_products();
        let total_earnings = yield admin_services.total_earnings(req);
        let total_reviews = yield admin_services.total_reviews(req);
        let total_ratings = yield admin_services.total_ratings(req);
        let response = {
            total_users: total_users,
            total_sellers: total_sellers,
            total_categories: total_categories,
            total_brands: total_brands,
            total_products: total_products,
            total_orders: total_orders,
            total_earnings: total_earnings,
            total_reviews: total_reviews,
            total_ratings: total_ratings,
            recent_users: recent_users,
            recent_products: recent_products
        };
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.dashboard = dashboard;
const user_graph = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield user_graph_1.default.retrive_graph(req);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.user_graph = user_graph;
const seller_graph = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield seller_graph_1.default.retrive_graph(req);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.seller_graph = seller_graph;
const product_graph = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_graph_1.default.retrive_graph(req);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.product_graph = product_graph;
const sales_graph = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_graph_1.default.retrive_graph(req);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.sales_graph = sales_graph;
const add_staff_members = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, language } = req.body;
        let query_email = { email: email.toLowerCase() };
        let fetch_data = yield admin_services.verify_admin_info(query_email);
        if (fetch_data.length) {
            throw yield (0, index_1.handle_custom_error)("EMAIL_ALREADY_EXISTS", language);
        }
        else {
            let response = yield admin_services.save_staff_data(req.body);
            (0, index_1.handle_success)(res, response);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_staff_members = add_staff_members;
const edit_staff_members = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, name, image, phone_number, country_code, roles } = req.body;
        // let { _id: _id } = req.user_data;
        let query = { _id: _id };
        let set_data = {};
        if (name != undefined) {
            set_data.name = name;
        }
        if (image != undefined) {
            set_data.image = image;
        }
        if (country_code != undefined) {
            set_data.country_code = country_code;
        }
        if (phone_number != undefined) {
            set_data.phone_number = phone_number;
        }
        if (roles != undefined) {
            if (roles.includes("DASHBOARD")) {
                roles.push("GRAPH");
            }
            set_data.roles = roles;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Admin, query, set_data, options);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.edit_staff_members = edit_staff_members;
const list_staff_members = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, start_date, end_date, pagination, limit } = req.query;
        let query = { email: { $ne: "admin@gmail.com" }, is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (start_date != undefined && end_date != undefined) {
            let set_start_date = moment_1.default.utc(start_date, "x").startOf('day').format('x');
            let set_end_date = moment_1.default.utc(end_date, "x").endOf('day').format('x');
            query.$and = [
                { created_at: { $gte: set_start_date } },
                { created_at: { $lte: set_end_date } }
            ];
        }
        let projection = { __v: 0, password: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.get_data(Models.Admin, query, projection, options);
        let total_count = yield admin_services.fetch_total_count(Models.Admin, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_staff_members = list_staff_members;
const staff_members_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Admin, query, projection, options);
        // return response
        (0, index_1.handle_success)(res, response[0]);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.staff_members_details = staff_members_details;
const mamage_staff_members = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let collection = Models.Admin;
        let update_data = yield admin_services.block_delete_data(req.body, collection);
        // return response
        (0, index_1.handle_success)(res, update_data);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.mamage_staff_members = mamage_staff_members;
const list_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, start_date, end_date, filter, pagination, limit } = req.query;
        let query = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                // { phone_no : parseInt(search) }
            ];
        }
        if (!!filter) {
            if (filter == "ACTIVE_USERS") {
                query.account_status = "ACTIVATED",
                    query.is_blocked = false,
                    query.is_deleted = false;
            }
            else if (filter == "DEACTIVE_USERS") {
                query.account_status = "DEACTIVATED",
                    query.is_blocked = false;
                query.is_deleted = false;
            }
            else if (filter == "BLOCKED_USERS") {
                query.is_blocked = true;
            }
        }
        if (start_date != undefined && end_date != undefined) {
            let set_start_date = moment_1.default.utc(start_date, "x").startOf('day').format('x');
            let set_end_date = moment_1.default.utc(end_date, "x").endOf('day').format('x');
            query.$and = [
                { created_at: { $gte: set_start_date } },
                { created_at: { $lte: set_end_date } }
            ];
        }
        if (filter === undefined || filter === null || filter === "") {
            query.account_status = "ACTIVATED",
                query.is_blocked = false,
                query.is_deleted = false;
        }
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield admin_services.fetch_user_data(query, options);
        let total_count = yield admin_services.fetch_total_count(Models.Users, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_users = list_users;
const list_user_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { _id: _id };
        let options = { lean: true };
        let response = yield admin_services.fetch_user_data(query, options);
        if (response.length) {
            let query = { user_id: _id };
            let projection = { __v: 0 };
            let options = { lean: true };
            let address = yield DAO.get_data(Models.Address, query, projection, options);
            response[0].address = address;
            (0, index_1.handle_return)(res, response[0]);
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_user_details = list_user_details;
const export_csv_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, timezone, start_date, end_date, pagination, limit } = req.query;
        let time_zone = "Asia/Kolkata";
        if (timezone) {
            time_zone = timezone;
        }
        if (start_date) {
            start_date = moment_1.default.utc(start_date, "DD/MM/YYYY").startOf("day").format("x");
        }
        if (end_date) {
            end_date = moment_1.default.utc(end_date, "DD/MM/YYYY").endOf("day").format("x");
        }
        let query = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (start_date != null && end_date != null) {
            query.$and = [
                { created_at: { $gte: start_date } },
                { created_at: { $lte: end_date } },
            ];
        }
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield admin_services.fetch_user_data(query, options);
        const ws = fs.createWriteStream("src/CSV/users.csv");
        fastcsv
            .write(fetch_data, { headers: true })
            .pipe(ws);
        // fetch total count
        let total_count = yield admin_services.fetch_total_count(Models.Users, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return response
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.export_csv_users = export_csv_users;
const manage_users = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { type, language } = req.body, fetch_data;
        if (type == "BLOCK/DELETE") {
            fetch_data = yield admin_services.block_delete_data(req.body, Models.Users);
        }
        else if (type == "VERIFY/UNVERIFY") {
            fetch_data = yield admin_services.verify_unverify(req.body, Models.Users);
        }
        else if (type == "ACTIVATE/DEACTIVATE") {
            fetch_data = yield admin_services.activate_deactivate(req.body, Models.Users);
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", language);
        }
        console.log('fe ', fetch_data);
        // if (fetch_data) {
        //     let { _id } = fetch_data;
        //     let query: any = { _id: _id };
        //     let options = { lean: true };
        //     let response:any = await admin_services.fetch_user_data(query, options);
        // return response
        (0, index_1.handle_success)(res, fetch_data);
        // } else {
        //     throw await handle_custom_error("INVALID_OBJECT_ID", language);
        // }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.manage_users = manage_users;
const login_as_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, language } = req.body;
        let device_type = req.headers['user-agent'];
        let query = { _id: _id, is_deleted: false };
        let projection = {};
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        if (fetch_data.length) {
            let query_ss = { user_id: _id, device_type: device_type };
            yield DAO.remove_many(Models.Sessions, query_ss);
            let generate_token = yield admin_services.generate_user_token(_id, req.body, device_type);
            let response = yield admin_services.make_user_response(generate_token);
            (0, index_1.handle_success)(res, response);
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.login_as_user = login_as_user;
const delete_a_user = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let update = { is_deleted: true };
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Users, query, update, options);
        if (response.is_deleted == true) {
            let data = { message: `User Deleted Successfully` };
            let query = { user_id: _id };
            yield DAO.remove_many(Models.Sessions, query);
            (0, index_1.handle_success)(res, data);
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.delete_a_user = delete_a_user;
const add_edit_res_msgs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, type, status_code, message_type, msg_in_english, msg_in_arabic } = req.body, response;
        let set_data = {
            type: type,
            status_code: status_code,
            message_type: message_type.toUpperCase(),
            msg_in_english: msg_in_english,
            msg_in_arabic: msg_in_arabic,
        };
        if (_id != undefined) {
            let query = { _id: _id };
            let options = { new: true };
            response = yield DAO.find_and_update(Models.ResMessages, query, set_data, options);
        }
        else {
            set_data.created_at = +new Date();
            response = yield DAO.save_data(Models.ResMessages, set_data);
        }
        // return response
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_edit_res_msgs = add_edit_res_msgs;
const list_res_messages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, pagination, limit } = req.query;
        let query = {};
        if (search != undefined) {
            query.$or = [
                { type: { $regex: search, $options: "i" } },
                { message_type: { $regex: search, $options: "i" } },
                { msg_in_english: { $regex: search, $options: "i" } },
                { msg_in_arabic: { $regex: search, $options: "i" } },
            ];
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.get_data(Models.ResMessages, query, projection, options);
        // fetch total count
        let total_count = yield admin_services.fetch_total_count(Models.ResMessages, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return response
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_res_messages = list_res_messages;
const delete_res_messages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response = yield DAO.remove_many(Models.ResMessages, query);
        if (response.deletedCount > 0) {
            let data = { message: `Response message deleted successfully...` };
            (0, index_1.handle_success)(res, data);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.delete_res_messages = delete_res_messages;
const add_edit_content = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('add_edit_content =---- ');
        console.log('add_edit_content =---- ', req.body);
        let { type, description, image_url, language } = req.body, response;
        let set_data = {
            type: type,
            description: description,
        };
        if (!!image_url) {
            set_data.image_url = image_url;
        }
        if (!!language) {
            set_data.language = language;
        }
        // check already added or not
        let fetch_content = yield admin_services.check_content(type);
        console.log('fetch_content -- ', fetch_content);
        // console.log('fetch_content -- ',fetch_content)
        if (fetch_content.length) {
            let { _id } = fetch_content[0];
            console.log('[fetch_content[0].id -- ', _id);
            let query = { _id: _id };
            let options = { new: true };
            response = yield DAO.find_and_update(Models.Content, query, set_data, options);
        }
        else {
            set_data.created_at = +new Date();
            response = yield DAO.save_data(Models.Content, set_data);
        }
        // return response
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_edit_content = add_edit_content;
const list_content = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { type, language } = req.query, query = { language: language };
        let response;
        if (type != undefined) {
            query.type = type;
        }
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Content, query, projection, options);
        if (type != undefined) {
            response = fetch_data[0];
        }
        else {
            response = fetch_data;
        }
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_content = list_content;
const content_detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        if (_id != undefined) {
            let query = { _id: _id };
            let projection = { __v: 0 };
            let options = { lean: true };
            let fetch_data = yield DAO.get_data(Models.Content, query, projection, options);
            // return data
            (0, index_1.handle_success)(res, fetch_data[0]);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.content_detail = content_detail;
const add_edit_faqs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, question, answer, language } = req.body, response;
        let set_data = {
            question: question,
            answer: answer,
            language: language
        };
        if (_id != undefined) {
            let query = { _id: _id, language: language };
            let options = { new: true };
            let setData = yield admin_services.edit_faqs(req.body);
            response = yield DAO.find_and_update(Models.Faqs, query, setData, options);
        }
        else {
            set_data.created_at = +new Date();
            response = yield DAO.save_data(Models.Faqs, set_data);
        }
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_edit_faqs = add_edit_faqs;
const list_faqs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language } = req.query;
        let query = { is_deleted: false, language: language };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Faqs, query, projection, options);
        // fetch total orders
        let total_count = fetch_data.length;
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_faqs = list_faqs;
const delete_faqs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response = yield DAO.remove_many(Models.Faqs, query);
        if (response.deletedCount > 0) {
            let data = { message: `Faq deleted successfully...` };
            (0, index_1.handle_success)(res, data);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.delete_faqs = delete_faqs;
const list_product_faqs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: product_id, pagination, limit } = req.query, query = { product_id: product_id };
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.get_data(Models.FaqsProducts, query, projection, options);
        // fetch total count
        let total_count = fetch_data.length;
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_product_faqs = list_product_faqs;
const list_contact_us = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, pagination, limit } = req.query;
        let query = { is_deleted: false };
        if (search != null || search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.get_data(Models.ContactUs, query, projection, options);
        // fetch total orders
        let total_count = yield admin_services.fetch_total_count(Models.ContactUs, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_contact_us = list_contact_us;
const manage_contact_us = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, type } = req.body, response;
        let update = {};
        if (type == "RESOLVE") {
            update = { resolved: true };
        }
        else if (type == "DELETE") {
            update = { is_deleted: true };
        }
        let query = { _id: _id };
        let options = { new: true };
        response = yield DAO.find_and_update(Models.ContactUs, query, update, options);
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.manage_contact_us = manage_contact_us;
const add_edit_variables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, name } = req.body, response;
        let set_data = { name: name };
        if (_id != undefined) {
            let query = { _id: _id };
            let options = { new: true };
            response = yield DAO.find_and_update(Models.Variables, query, set_data, options);
        }
        else {
            set_data.created_at = +new Date();
            response = yield DAO.save_data(Models.Variables, set_data);
        }
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_edit_variables = add_edit_variables;
const list_variables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, search, pagination, limit } = req.query, query = {};
        if (_id != undefined) {
            query._id = _id;
        }
        if (search != undefined) {
            query.name = { $regex: search, $options: "i" };
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.get_data(Models.Variables, query, projection, options);
        // fetch total count
        let total_count = yield admin_services.fetch_total_count(Models.Variables, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_variables = list_variables;
const delete_variables = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response = yield DAO.remove_many(Models.Variables, query);
        if (response.deletedCount > 0) {
            let data = { message: `Variable deleted successfully...` };
            (0, index_1.handle_success)(res, data);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.delete_variables = delete_variables;
const add_edit_templates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, title, subject, html, variables } = req.body, response;
        let set_data = {
            title: title,
            type: title.toUpperCase(),
            subject: subject,
            html: html,
            variables: variables,
        };
        if (_id != undefined) {
            let query = { _id: _id };
            let options = { new: true };
            response = yield DAO.find_and_update(Models.Templates, query, set_data, options);
        }
        else {
            set_data.created_at = +new Date();
            response = yield DAO.save_data(Models.Templates, set_data);
        }
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_edit_templates = add_edit_templates;
const list_templates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, search, pagination, limit } = req.query, query = {};
        if (_id != undefined) {
            query._id = _id;
        }
        if (search != undefined) {
            query.$and = [
                { title: { $regex: search, $options: "i" } },
                { short_content: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } },
            ];
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let populate = [{ path: "variables", select: "name" }];
        let fetch_data = yield DAO.populate_data(Models.Templates, query, projection, options, populate);
        //fetch total count
        let total_count = yield admin_services.fetch_total_count(Models.Templates, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_templates = list_templates;
const delete_templates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response = yield DAO.remove_many(Models.Templates, query);
        if (response.deletedCount > 0) {
            let data = { message: `Template deleted successfully...` };
            (0, index_1.handle_success)(res, data);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.delete_templates = delete_templates;
const send_notification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { type } = req.body;
        console.log('REQ BODY BROADCAST ------- ', req.body);
        if (type == 1) {
            yield admin_services.send_broadcast_email(req.body);
        }
        else {
            yield admin_services.send_broadcast_push(req.body);
        }
        let response = "Notification sent sucessfully!!!";
        // return data
        (0, index_1.handle_success)(res, response);
        // console.log(response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.send_notification = send_notification;
const add_category = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_services.save_categories(req.body);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_category = add_category;
const add_sub_category = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_services.save_sub_categories(req.body);
        // console.log(response);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_sub_category = add_sub_category;
const add_sub_subcategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_services.add_sub_subcategories(req.body);
        // console.log(response);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_sub_subcategories = add_sub_subcategories;
const add_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_services.save_deals(req.body);
        // console.log(response);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_deals = add_deals;
const delete_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response = yield DAO.remove_data(Models.Deals_of_the_day, query);
        // console.log(response)
        if (response.deletedCount > 0) {
            let data = { message: ` Deal Deleted Successfully` };
            (0, index_1.handle_success)(res, data);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.delete_deals = delete_deals;
const add_hot_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_services.save_hot_deals(req.body);
        // console.log(response);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_hot_deals = add_hot_deals;
const delete_hotdeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response = yield DAO.remove_many(Models.Hot_deals, query);
        if (response.deletedCount > 0) {
            let data = { message: `Hot Deal deleted successfully...` };
            (0, index_1.handle_success)(res, data);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.delete_hotdeals = delete_hotdeals;
const add_fashion_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_services.save_fashion_deals(req.body);
        // console.log(response);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_fashion_deals = add_fashion_deals;
const delete_fashiondeals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response = yield DAO.remove_many(Models.FashionDeals, query);
        if (response.deletedCount > 0) {
            let data = { message: `Fashion Deal deleted successfully...` };
            (0, index_1.handle_success)(res, data);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.delete_fashiondeals = delete_fashiondeals;
const export_csv_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search } = req.query, { _id: seller_id } = req.user_data;
        let query = [
            yield admin_helper.redact_data(search),
            yield admin_helper.lookup_data("subcategories", "$subcategory_id"),
            yield admin_helper.unwind_data("$subcategory_id"),
            yield admin_helper.lookup_data("sub_subcategories", "$sub_subcategory_id"),
            yield admin_helper.unwind_data("$sub_subcategory_id"),
            yield admin_helper.lookup_data("brands", "$brand_id"),
            yield admin_helper.unwind_data("$brand_id"),
            yield admin_helper.lookup_data("product_types", "$product_type_id"),
            yield admin_helper.unwind_data("$product_type_id"),
            yield admin_helper.lookup_data("sellers", "$added_by"),
            yield admin_helper.unwind_data("$added_by"),
            yield admin_helper.sort_data()
        ];
        let fetch_data;
        fetch_data = yield admin_services.make_products(query, joi_1.options);
        const ws = fs.createWriteStream("src/CSV/products.xlsx");
        fastcsv
            .write(fetch_data, { headers: true })
            .pipe(ws);
        let response = {
            total_count: yield fetch_data.length,
            data: fetch_data
        };
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.export_csv_products = export_csv_products;
const list_deals_of_the_day = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query;
        let query = {};
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield admin_services.make_deals_response(query, options);
        // fetch total count
        let total_count = yield admin_services.fetch_total_count(Models.Deals_of_the_day, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // console.log(response);
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_deals_of_the_day = list_deals_of_the_day;
const listing_deals_of_the_day_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response = yield admin_services.get_deals_detail(query, options);
        let subCategories_id = response[0].subcategory_id._id;
        // console.log("-------check SUB-------", subCategories_id);
        let query_data = { subcategory_id: subCategories_id };
        let fetch_product_data = yield DAO.get_data(Models.Products, query_data, projection, options);
        (0, index_1.handle_success)(res, fetch_product_data);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.listing_deals_of_the_day_products = listing_deals_of_the_day_products;
const list_hot_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query;
        let query = {};
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield admin_services.make_hot_deals_response(query, options);
        // fetch total count
        let total_count = yield admin_services.fetch_total_count(Models.Hot_deals, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // console.log(response);
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_hot_deals = list_hot_deals;
const listing_hot_deals_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response = yield admin_services.get_hotdeals_detail(query, options);
        // console.log("response", response)
        let subCategories_id = response[0].subcategory_id._id;
        // console.log("-------check SUB-------", subCategories_id);
        let query_data = { subcategory_id: subCategories_id };
        let fetch_product_data = yield DAO.get_data(Models.Products, query_data, projection, options);
        (0, index_1.handle_success)(res, fetch_product_data);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.listing_hot_deals_products = listing_hot_deals_products;
const list_fashion_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query;
        let query = {};
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield admin_services.make_fashion_deals_response(query, options);
        // fetch total count
        let total_count = yield admin_services.fetch_total_count(Models.FashionDeals, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // console.log(response);
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_fashion_deals = list_fashion_deals;
const listing_fashion_deals_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response = yield admin_services.get_fashiondeals_detail(query, options);
        let brand_id = response[0].brand_id._id;
        // console.log("-------check SUB-------", brand_id);
        let query_data = { brand_id: brand_id };
        let fetch_product_data = yield DAO.get_data(Models.Products, query_data, projection, options);
        (0, index_1.handle_success)(res, fetch_product_data);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.listing_fashion_deals_products = listing_fashion_deals_products;
const add_brands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_services.save_brands(req.body);
        // console.log(response);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_brands = add_brands;
const add_banners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_services.save_banners(req.body);
        // console.log(response);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_banners = add_banners;
const list_banners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, timezone, pagination, limit } = req.query;
        let time_zone = "Asia/Kolkata";
        if (timezone) {
            time_zone = timezone;
        }
        let query = {};
        // if (_id != undefined) { query._id = _id }
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield admin_services.make_banners_response(query, options);
        // fetch total count
        let total_count = yield admin_services.fetch_total_count(Models.Banners, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // console.log(response);
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_banners = list_banners;
// const seller_signup = async (req: express.Request, res: express.Response) => {
//     try {
//         let { email, password, phone_number, language } = req.body;
//         let device_type: any = req.headers["user-agent"] 
//         // verify email address
//         let query_email = { email: email.toLowerCase() };
//         let fetch_data: any = await admin_services.verify_seller_info(query_email);
//         if (fetch_data.length) {
//             throw await handle_custom_error("EMAIL_ALREADY_EXISTS", language);
//         } else {
//             // verify phone_no
//             let query_phone_no = { phone_number: phone_number };
//             let verify_data: any = await admin_services.verify_seller_info(query_phone_no);
//             if (verify_data.length) {
//                 throw await handle_custom_error("PHONE_NO_ALREADY_EXISTS", language);
//             } else {
//                 // create new user
//                 let create_user = await admin_services.set_seller_data(req.body);
//                 let { _id } = create_user;
//                 // generate access token
//                 let generate_token: any = await admin_services.generate_seller_token(_id, req.body, device_type);
//                 // fetch user response
//                 let response = await admin_services.make_seller_response(generate_token, language);
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
//seller_listing
const seller_listing = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, start_date, end_date, filter, pagination, limit } = req.query;
        let query = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }
        if (!!filter) {
            if (filter == "ACTIVE_USERS") {
                query.account_status = "ACTIVATED";
            }
            else if (filter == "DEACTIVE_USERS") {
                query.account_status = "DEACTIVATED";
            }
            else if (filter == "BLOCKED_USERS") {
                query.is_blocked = true;
            }
        }
        if (start_date != undefined && end_date != undefined) {
            let set_start_date = moment_1.default.utc(start_date, "x").startOf('day').format('x');
            let set_end_date = moment_1.default.utc(end_date, "x").endOf('day').format('x');
            query.$and = [
                { created_at: { $gte: set_start_date } },
                { created_at: { $lte: set_end_date } }
            ];
        }
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data;
        fetch_data = yield admin_services.fetch_seller_data(query, options);
        // fetch total count
        let total_count = yield admin_services.fetch_total_count(Models.Sellers, query);
        let response = { total_count: total_count, data: fetch_data, };
        // return response
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.seller_listing = seller_listing;
const seller_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let response;
        if (_id != 'undefined') {
            let query = { _id: _id };
            let options = { lean: true };
            response = yield admin_services.fetch_seller_data(query, options);
        }
        // return response
        (0, index_1.handle_success)(res, response[0]);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.seller_details = seller_details;
const export_csv_seller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, timezone, start_date, end_date, pagination, limit } = req.query;
        let time_zone = "Asia/Kolkata";
        if (timezone) {
            time_zone = timezone;
        }
        if (start_date) {
            start_date = moment_1.default.utc(start_date, "DD/MM/YYYY").startOf("day").format("x");
        }
        if (end_date) {
            end_date = moment_1.default.utc(end_date, "DD/MM/YYYY").endOf("day").format("x");
        }
        let query = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }
        if (start_date != null && end_date != null) {
            query.$and = [
                { created_at: { $gte: start_date } },
                { created_at: { $lte: end_date } },
            ];
        }
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data;
        fetch_data = yield admin_services.fetch_seller_data(query, options);
        const ws = fs.createWriteStream("src/CSV/sellers.csv");
        fastcsv
            .write(fetch_data, { headers: true })
            .pipe(ws);
        // fetch total count
        let total_count = yield admin_services.fetch_total_count(Models.Sellers, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return response
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.export_csv_seller = export_csv_seller;
//Manage Sellers
const manage_sellers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { type, language } = req.body, fetch_data;
        if (type == "BLOCK/DELETE") {
            fetch_data = yield admin_services.block_delete_data(req.body, Models.Sellers);
        }
        else if (type == "VERIFY/UNVERIFY") {
            fetch_data = yield admin_services.verify_unverify(req.body, Models.Sellers);
        }
        else if (type == "ACTIVATE/DEACTIVATE") {
            fetch_data = yield admin_services.activate_deactivate(req.body, Models.Sellers);
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", language);
        }
        // if (fetch_data) {
        //     let { _id } = fetch_data;
        //     let query: any = { _id: _id };
        //     let options = { lean: true };
        //     let projection = { password: 0, otp: 0, fp_otp: 0, unique_code: 0, __v: 0, forgot_otp: 0 }
        //     let response:any = await DAO.get_data(Models.Sellers, query, projection, options)
        // return response
        (0, index_1.handle_success)(res, fetch_data);
        // } 
        // else {
        //     throw await handle_custom_error("INVALID_OBJECT_ID", language);
        // }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.manage_sellers = manage_sellers;
const login_as_seller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language } = req.body;
        let { email } = req.user_data;
        // console.log('req.headers ---', req.headers)
        // console.log("req.headers.[user-agent] ---", req.headers['user-agent']);
        let device_type = req.headers["user-agent"];
        let query = { email: email, is_deleted: false };
        let projection = {
            is_deleted: 0,
            unique_code: 0,
            fp_otp: 0,
            fp_otp_verified: 0,
            password: 0,
            is_blocked: 0
        };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sellers, query, projection, options);
        let _id = fetch_data[0]._id;
        if (fetch_data.length) {
            let query_ss = { seller_id: _id, device_type: device_type };
            yield DAO.remove_many(Models.Sessions, query_ss);
            let generate_token = yield admin_services.generate_seller_token(_id, req.body, device_type);
            let response = yield admin_services.make_seller_response(generate_token, language);
            (0, index_1.handle_success)(res, response);
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", language);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.login_as_seller = login_as_seller;
const delete_a_seller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let update = { is_deleted: true };
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Sellers, query, update, options);
        if (response.is_deleted == true) {
            let data = { message: `Seller Deleted Successfully` };
            let query = { seller_id: _id };
            yield DAO.remove_many(Models.Sellers, query);
            (0, index_1.handle_success)(res, data);
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.delete_a_seller = delete_a_seller;
const add_edit_coupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, name, start_date, end_date, price, max_discount, coupon_type } = req.body, response;
        let code = yield index_1.helpers.genrate_coupon_code();
        let set_data = {
            name: name,
            code: code,
            start_date: start_date,
            end_date: end_date,
            price: price,
            max_discount: max_discount,
            coupon_type: coupon_type,
            is_deleted: false
        };
        if (_id != undefined) {
            let query = { _id: _id };
            let options = { new: true };
            let data = yield admin_services.edit_coupon(req.body);
            response = yield DAO.find_and_update(Models.Coupons, query, data, options);
        }
        else {
            set_data.created_at = +new Date();
            response = yield DAO.save_data(Models.Coupons, set_data);
        }
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_edit_coupons = add_edit_coupons;
const get_coupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search } = req.query;
        let query = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { code: { $regex: search, $options: "i" } },
            ];
        }
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Coupons, query, projection, options);
        let total_count = fetch_data.length;
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return response
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.get_coupons = get_coupons;
const delete_coupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response = yield DAO.remove_many(Models.Coupons, query);
        if (response.deletedCount > 0) {
            let data = { message: `Coupon deleted successfully...` };
            (0, index_1.handle_success)(res, data);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.delete_coupons = delete_coupons;
const list_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = [
            yield fetch_products.match_data(),
            yield fetch_products.lookup_brands(),
            yield fetch_products.unwind_brands(),
            yield fetch_products.lookup_categories(),
            yield fetch_products.unwind_categories(),
            yield fetch_products.lookup_subcategories(),
            yield fetch_products.unwind_subcategories(),
            yield fetch_products.lookup_sub_subcategories(),
            yield fetch_products.unwind_sub_subcategories(),
            yield fetch_products.lookup_seller(),
            yield fetch_products.unwind_seller(),
            yield fetch_products.ratings(),
            yield fetch_products.product_highlights(),
            yield fetch_products.group_data(),
            yield fetch_products.filter_data(req.query),
            yield fetch_products.sort_data(req.query),
            yield fetch_products.skip_data(req.query),
            yield fetch_products.limit_data(req.query),
        ];
        let { min_price, max_price } = req.query;
        let options = { lean: true };
        let products = yield DAO.aggregate_data(Models.Products, query, options);
        let query_count = [
            yield fetch_products.match_data(),
            yield fetch_products.lookup_brands(),
            yield fetch_products.unwind_brands(),
            yield fetch_products.lookup_categories(),
            yield fetch_products.unwind_categories(),
            yield fetch_products.lookup_subcategories(),
            yield fetch_products.unwind_subcategories(),
            yield fetch_products.lookup_sub_subcategories(),
            yield fetch_products.unwind_sub_subcategories(),
            yield fetch_products.lookup_seller(),
            yield fetch_products.unwind_seller(),
            yield fetch_products.ratings(),
            yield fetch_products.product_highlights(),
            yield fetch_products.group_data(),
            yield fetch_products.filter_data(req.query),
            yield fetch_products.sort_data(req.query),
        ];
        let count_products = yield DAO.aggregate_data(Models.Products, query_count, options);
        let response = {
            total_count: count_products.length,
            data: products
        };
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_products = list_products;
const list_product_variants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { product_id: _id };
        let options = { lean: true };
        let response = yield admin_services.get_variants_detail(query, options);
        // console.log(response);
        // return response
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_product_variants = list_product_variants;
const list_orders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query, fetch_data, total_count;
        let query = {}, options;
        if (_id != undefined) {
            query = { _id: _id };
            options = { lean: true };
            let get_data = yield admin_services.fetch_Orders_data(query, options);
            let query_dta = { user_id: get_data[0].user_id._id, product_id: get_data[0].product._id };
            let response_reviews = yield admin_services.fetch_reviews_data(query_dta, options);
            get_data[0]['reviews'] = response_reviews;
            fetch_data = get_data[0];
        }
        else {
            options = yield index_1.helpers.set_options(pagination, limit);
            fetch_data = yield admin_services.fetch_Orders_data(query, options);
            total_count = fetch_data.length;
        }
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_orders = list_orders;
const product_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { _id: _id, is_deleted: false };
        let options = { lean: true };
        let response_product = yield admin_services.get_product_detail(query, options);
        let query_data = { product_id: _id }, projection = { __v: 0 };
        let populate_data = [
            { path: 'user_id', select: "name profile_pic " }
        ];
        let response_reviews = yield DAO.populate_data(Models.Reviews, query_data, projection, options, populate_data);
        let count_reviews = response_reviews.length;
        let response = {
            product: response_product[0],
            reviews: response_reviews,
            total_review_count: count_reviews
        };
        // return response
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.product_details = product_details;
const backup_db = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language } = req.body;
        let create_backup = yield (0, middlewares_1.backup_using_cron)(language);
        // console.log("create backup ", create_backup)
        let { file_url } = create_backup;
        let response = {
            base_url: 'https://sharedecommerce.nyc3.digitaloceanspaces.com/sharedecommerce/',
            folders: ['backup'],
            file_url: file_url
        };
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.backup_db = backup_db;
const add_edit_languagekeys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, key, english, arabic } = req.body, response;
        let set_data = {
            key: key,
            english: english,
            arabic: arabic
        };
        if (_id != undefined) {
            let query = { _id: _id };
            let options = { new: true };
            let data = yield admin_services.edit_language(req.body);
            response = yield DAO.find_and_update(Models.LanguageKeys, query, data, options);
        }
        else {
            response = yield DAO.save_data(Models.LanguageKeys, set_data);
        }
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_edit_languagekeys = add_edit_languagekeys;
const list_languagekeys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pagination, limit, language, search, _id } = req.query;
        let query = { "is_deleted": false };
        if (search != undefined) {
            query.$or = [
                { english: { $regex: search, $options: 'i' } }
            ];
        }
        if (_id) {
            query = { "is_deleted": false, _id: _id };
            let count = yield admin_services.fetch_total_count(Models.LanguageKeys, query);
            let fetch_content = yield DAO.get_data(Models.LanguageKeys, query, {}, {});
            let data = fetch_content;
            let response = {
                data,
                count: count
            };
            if (fetch_content.length) {
                (0, index_1.handle_success)(res, response);
            }
        }
        else {
            // console.log(` query >>.  `, query ); 
            let projection = { __v: 0 };
            let options = yield index_1.helpers.set_options(pagination, limit);
            // check already added or not
            let count = yield admin_services.fetch_total_count(Models.LanguageKeys, query);
            let fetch_content = yield DAO.get_data(Models.LanguageKeys, query, projection, options);
            let data = fetch_content;
            let response = {
                data,
                count: count
            };
            if (fetch_content.length) {
                (0, index_1.handle_success)(res, response);
            }
        }
        // return response
    }
    catch (err) {
        // console.log(`err ^^^^^^^^^^^^^^^^^^^   `, err);
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_languagekeys = list_languagekeys;
const add_a_parcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, description, length, width, height, distance_unit, weight, mass_unit } = req.body;
        let parcel_data = {
            "length": length,
            "width": width,
            "height": height,
            "distance_unit": distance_unit,
            "weight": weight,
            "mass_unit": mass_unit
        };
        let parcel = yield shippo.parcel.create(parcel_data);
        let set_parcel_data = {
            name: name,
            description: description,
            length: length,
            width: width,
            height: height,
            distance_unit: distance_unit,
            weight: weight,
            mass_unit: mass_unit,
            shippo_parcel_id: parcel.object_id,
            created_at: +new Date()
        };
        let save_parcel = yield DAO.save_data(Models.Parcel, set_parcel_data);
        (0, index_1.handle_return)(res, save_parcel);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.add_a_parcel = add_a_parcel;
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
const delete_a_parcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let response = yield DAO.remove_many(Models.Parcel, query);
        if (response.deletedCount > 0) {
            let data = { message: `Parcel deleted successfully...` };
            (0, index_1.handle_return)(res, data);
        }
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.delete_a_parcel = delete_a_parcel;
const get_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: admin_id } = req.user_data;
        let response = yield admin_services.getNotifications(admin_id, req.query);
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.get_notifications = get_notifications;
const marked_all_read_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: admin_id } = req.user_data;
        let response = yield admin_services.markReadNotifications(req);
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.marked_all_read_notifications = marked_all_read_notifications;
const clear_all_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: admin_id } = req.user_data;
        let response = yield admin_services.clearNotifications(req);
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.clear_all_notifications = clear_all_notifications;
const read_notification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(' ====== ');
        let { _id: admin_id } = req.user_data;
        let response = yield admin_services.ReadNotification(req);
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.read_notification = read_notification;
const list_users_sellers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(" ====== ");
        let { _id: admin_id } = req.user_data;
        let response = yield admin_services.listing_users_sellers(req);
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_users_sellers = list_users_sellers;
const mainKeys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.body", req.body);
        let response = yield admin_services.saveMainKey(req);
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.mainKeys = mainKeys;
const getMainKeys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.body", req.body);
        let response = yield admin_services.getMainKeys(req);
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.getMainKeys = getMainKeys;
const keyValues = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.body", req.body);
        let response = yield admin_services.saveKeyValue(req);
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.keyValues = keyValues;
const editKeyValue = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("edit req.param", req.params);
        console.log("req.query", req.params);
        console.log("req.body", req.body);
        let response = yield admin_services.editKeyValue(req);
        console.log("rRESP", response);
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.editKeyValue = editKeyValue;
const getAllKeys = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req.param", req.params);
        console.log("req.query", req.params);
        console.log("req.body", req.body);
        let response = yield admin_services.getAllKeys(req);
        (0, index_1.handle_return)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.getAllKeys = getAllKeys;
