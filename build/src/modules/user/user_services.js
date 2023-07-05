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
exports.update_phone_otp = exports.user_shippoAddress = exports.get_seller = exports.get_products = exports.fetch_order_detail = exports.get_seller_data = exports.edit_cart = exports.update_card = exports.fetch_cards = exports.save_card = exports.fetch_Cart_data = exports.save_to_cart = exports.fetch_Wishlist_data = exports.save_wishlist = exports.verify_product_info = exports.save_notification_data = exports.fetch_Orders_search = exports.save_order_create = exports.fetch_user_data = exports.order_cancellation = exports.update_address_data = exports.fetch_Orders_data = exports.make_orders_response = exports.make_address_response = exports.save_address = exports.fetch_total_count = exports.fetch_product_data = exports.edit_address_data = exports.edit_profile_data = exports.create_new_user = exports.set_user_data = exports.verify_user_info = exports.deactivate_data = exports.block_delete_data = exports.make_user_response = exports.save_session_data = exports.update_otp = exports.generate_user_token = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const index_1 = require("../../config/index");
const index_2 = require("../../middlewares/index");
const email_services = __importStar(require("./email_services"));
const stripe_1 = __importDefault(require("stripe"));
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options = { apiVersion: "2020-08-27" };
const stripe = new stripe_1.default(STRIPE_KEY, stripe_options);
const user_scope = index_1.app_constant.scope.user;
var shippo = require('shippo')(process.env.SHIPPO_TOKEN);
const generate_user_token = (_id, req_data, device_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token_data = {
            _id: _id,
            scope: user_scope,
            collection: Models.Users,
            token_gen_at: +new Date(),
        };
        let access_token = yield (0, index_2.generate_token)(token_data);
        let response = yield save_session_data(access_token, token_data, req_data, device_type);
        // console.log(response)
        return response;
    }
    catch (err) {
        // console.log(err)
        throw err;
    }
});
exports.generate_user_token = generate_user_token;
const update_otp = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // generate otp
        let otp = yield index_2.helpers.generate_otp();
        let query = { _id: user_id };
        let update = { otp: otp };
        let options = { new: true };
        return yield DAO.find_and_update(Models.Users, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
exports.update_otp = update_otp;
const update_phone_otp = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let otp = yield index_2.helpers.generate_phone_otp();
        let query = { _id: user_id };
        let update = { otp: otp };
        let options = { new: true };
        return yield DAO.find_and_update(Models.Users, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
exports.update_phone_otp = update_phone_otp;
const save_session_data = (access_token, token_data, req_data, device_type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let device_type: any = req_data.headers["user-agent"];
        // console.log('req_data headers -----USER ------  ',req_data.headers)
        // console.log("DEVICE TYPE  ----***** ----- ****  --- ", device_type);
        let { _id: user_id, token_gen_at } = token_data, { fcm_token } = req_data;
        let set_data = {
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
        let response = yield DAO.save_data(Models.Sessions, set_data);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.save_session_data = save_session_data;
const make_user_response = (token_data, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { user_id, access_token, device_type, fcm_token, token_gen_at } = token_data;
        let query = { _id: user_id };
        let projection = { __v: 0, password: 0, otp: 0 };
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
            throw yield (0, index_2.handle_custom_error)("INVALID_OBJECT_ID", language);
        }
    }
    catch (err) {
        throw err;
    }
});
exports.make_user_response = make_user_response;
const block_delete_data = (data, collection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, is_blocked, is_deleted } = data;
        let query = { _id: _id };
        let data_to_update = {};
        if (typeof is_blocked !== "undefined" && is_blocked !== null) {
            data_to_update.is_blocked = is_blocked;
        }
        if (typeof is_deleted !== "undefined" && is_deleted !== null) {
            data_to_update.is_deleted = is_deleted;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(collection, query, data_to_update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.block_delete_data = block_delete_data;
const deactivate_data = (data, session_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { deactivation_reason, password, language } = data, { user_id: _id } = session_data;
        console.log("User ID: ", _id);
        let update_set = {
            account_status: "Deactivated",
            deactivation_reason: deactivation_reason,
        };
        console.log(update_set);
        let query = { _id: _id };
        let options = { new: true };
        let projection = { _v: 0 };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        console.log(fetch_data);
        if (fetch_data.length) {
            let { password: hash } = fetch_data[0];
            let decrypt = yield index_2.helpers.decrypt_password(password, hash);
            if (decrypt != true) {
                throw yield (0, index_2.handle_custom_error)("INCORRECT_PASSWORD", language);
            }
            else {
                let response = yield DAO.find_and_update(Models.Users, query, update_set, options);
                console.log(response);
                return response;
            }
        }
    }
    catch (err) {
        throw err;
    }
});
exports.deactivate_data = deactivate_data;
const verify_user_info = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.verify_user_info = verify_user_info;
const set_user_data = (data, stripe_customer) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, email, country_code, phone_no, password, language } = data;
        let { id: customer_id } = stripe_customer;
        console.log("stripe_customer....", stripe_customer);
        let hassed_password = yield index_2.helpers.bcrypt_password(password);
        let otp = yield index_2.helpers.generate_otp();
        let phone_otp = yield index_2.helpers.generate_phone_otp();
        let data_to_save = {
            name: name,
            email: email.toLowerCase(),
            // country_code: country_code,
            // phone_no: phone_no,
            password: hassed_password,
            customer_id: customer_id,
            otp: otp,
            phone_otp: phone_otp,
            language: language,
            created_at: +new Date(),
        };
        if (data.profile_pic) {
            data_to_save.profile_pic = data.profile_pic;
        }
        if (data.country_code) {
            data_to_save.country_code = data.country_code;
        }
        if (data.phone_no) {
            data_to_save.phone_no = data.phone_no;
        }
        let response = yield DAO.save_data(Models.Users, data_to_save);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.set_user_data = set_user_data;
const create_new_user = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { social_type, social_token, country_code, phone_no, name, email } = data;
        let stripe_customer = yield stripe.customers.create({
            name: name,
            email: email,
            description: "Customer",
        });
        let decode_token = yield jsonwebtoken_1.default.decode(social_token);
        console.log("decode_token....", decode_token);
        let { id: customer_id } = stripe_customer;
        if (social_type == "GOOGLE") {
            let decode_token = yield jsonwebtoken_1.default.decode(social_token);
            let { sub, email: google_email, name: google_name } = decode_token;
            console.log("decode_token....", decode_token);
            let data_to_save = {
                social_type: social_type,
                social_token: sub,
                name: google_name,
                email: google_email.toLowerCase(),
                email_verified: true,
                customer_id: customer_id,
                created_at: +new Date()
            };
            if (!!country_code) {
                data_to_save.country_code = country_code;
            }
            if (!!phone_no) {
                data_to_save.phone_no = phone_no;
            }
            let response = yield DAO.save_data(Models.Users, data_to_save);
            return response;
        }
        else {
            let data_to_save = {
                social_type: social_type,
                social_token: social_token,
                email_verified: true,
                customer_id: customer_id,
                created_at: +new Date(),
            };
            if (!!email) {
                data_to_save.email = email.toLowerCase();
            }
            if (!!country_code) {
                data_to_save.country_code = country_code;
            }
            if (!!phone_no) {
                data_to_save.phone_no = phone_no;
            }
            if (!!name) {
                data_to_save.name = name;
            }
            let response = yield DAO.save_data(Models.Users, data_to_save);
            return response;
        }
    }
    catch (err) {
        throw err;
    }
});
exports.create_new_user = create_new_user;
const edit_profile_data = (data, user_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: user_id, name, email, phone_no, country_code } = user_data;
        let set_data = {};
        if (data.profile_pic) {
            set_data.profile_pic = data.profile_pic;
        }
        if (data.name) {
            set_data.name = data.name;
        }
        if (data.work) {
            set_data.work = data.work;
        }
        if (data.about) {
            set_data.about = data.about;
        }
        if (data.email) {
            let to_lower_case = data.email.toLowerCase();
            let query = { _id: { $ne: user_id }, email: to_lower_case };
            let fetch_data = yield verify_user_info(query);
            if (fetch_data.length) {
                throw yield (0, index_2.handle_custom_error)("EMAIL_ALREADY_EXISTS", data.language);
            }
            else {
                if (to_lower_case != email) {
                    let otp = yield index_2.helpers.generate_otp();
                    set_data.email = to_lower_case;
                    set_data.otp = otp;
                    set_data.email_verified = false;
                    let set_name = data.name !== undefined ? data.name : name;
                    yield email_services.edit_profile_mail(to_lower_case, otp, set_name);
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
            let fetch_data = yield verify_user_info(query);
            if (fetch_data.length) {
                throw yield (0, index_2.handle_custom_error)("PHONE_NO_ALREADY_EXISTS", data.language);
            }
            else {
                if (country_code != data.country_code) {
                    set_data.country_code = data.country_code;
                }
                if (phone_no != data.phone_no) {
                    let phone_otp = yield index_2.helpers.generate_phone_otp();
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
});
exports.edit_profile_data = edit_profile_data;
const edit_address_data = (data, user_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let set_data = {};
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
        if (data.lng && data.lat) {
            set_data.location_from = {
                type: "Point",
                coordinates: [data.lng, data.lat],
            };
        }
        return set_data;
    }
    catch (err) {
        throw err;
    }
});
exports.edit_address_data = edit_address_data;
const fetch_product_data = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [{ path: "", select: "name price image_url" }];
        let response = yield DAO.populate_data(Models.Products, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_product_data = fetch_product_data;
const fetch_Orders_data = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [{ path: "product", select: "" }];
        let response = yield DAO.populate_data(Models.Orders, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_Orders_data = fetch_Orders_data;
const fetch_Wishlist_data = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [{ path: "product_id", select: "" }];
        let response = yield DAO.populate_data(Models.Wishlist, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_Wishlist_data = fetch_Wishlist_data;
const save_address = (data) => __awaiter(void 0, void 0, void 0, function* () {
    data.created_at = +new Date();
    let response = yield DAO.save_data(Models.Address, data);
    return response;
});
exports.save_address = save_address;
const update_address_data = (query, update) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Address, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.update_address_data = update_address_data;
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
const make_address_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let query = { user_id : user_id }
        let projection = { __v: 0 };
        let respone = yield DAO.get_data(Models.Address, query, projection, options);
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.make_address_response = make_address_response;
const make_orders_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: "product_id", select: "name image price image_url" },
        ];
        let respone = yield DAO.populate_data(Models.Orders, query, projection, options, populate);
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.make_orders_response = make_orders_response;
const order_cancellation = (data, collection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, cancellation_reason } = data;
        let query = { _id: _id };
        let projection = { __v: 0 };
        let options_order = { lean: true };
        let get_orders = yield DAO.get_data(Models.Orders, query, projection, options_order);
        // console.log("GET_Orders", get_orders)
        let transaction_id = get_orders[0].transaction_id;
        // console.log("TRANSACTION_ID", transaction_id)
        let refund = yield shippo.refund.create({
            "transaction": transaction_id,
            "async": false
        });
        // console.log("REFUND", refund)
        let refund_id = refund.object_id;
        // console.log("REFUND_ID",refund_id)
        let data_to_update = {
            order_status: "CANCELLED",
            refund_id: refund_id,
            is_removed: true,
            cancellation_reason: cancellation_reason,
        };
        let options = { new: true };
        let response = yield DAO.find_and_update(collection, query, data_to_update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.order_cancellation = order_cancellation;
const fetch_user_data = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { password: 0, otp: 0, fp_otp: 0, unique_code: 0, __v: 0 };
        let response = yield DAO.get_data(Models.Users, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_user_data = fetch_user_data;
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
const save_order_create = (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { quantity, product, address_id, card_id, delivery_charges, coupon_code, price, payment_mode, transaction_id, shipment_id } = data;
        let order_id = yield index_2.helpers.genrate_order_id();
        var calculate_price, coupon_off_price;
        let query = { _id: product };
        let projection = { price: 1, discount_price: 1, discount: 1 };
        let options = { lean: true };
        let product_data = yield DAO.get_single_data(Models.Products, query, projection, options);
        calculate_price = quantity * product_data.discount_price.toFixed(0);
        //COUPON
        if (coupon_code != null) {
            //check coupon is available
            let query_coupon = { code: coupon_code, is_available: true };
            let projections = { __v: 0 };
            let option = { lean: true };
            let coupon_data = yield DAO.get_single_data(Models.Coupons, query_coupon, projections, option);
            //verify coupon is already used
            let query = { coupon_id: coupon_data._id };
            let verify_coupon_used = yield DAO.get_data(Models.Used_Coupons, query, projections, options);
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
                let set_data = {
                    user_id: user_id,
                    coupon_id: coupon_data._id,
                    is_deleted: true,
                };
                yield DAO.save_data(Models.Used_Coupons, set_data);
            }
        }
        let get_shipment = yield shippo.shipment.retrieve(shipment_id);
        let get_transaction = yield shippo.transaction.retrieve(transaction_id);
        let parcel_id = get_transaction.parcel;
        let tracking_number = get_transaction.tracking_number;
        let label_url = get_transaction.label_url;
        let rate_id = get_shipment.rates[0].object_id;
        let estimated_days = get_shipment.rates[0].estimated_days;
        let servicelevel = get_shipment.rates[0].servicelevel.token;
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
        let response = yield DAO.save_data(Models.Orders, data_to_save);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.save_order_create = save_order_create;
const fetch_Orders_search = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield DAO.aggregate_data(Models.Orders, query, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_Orders_search = fetch_Orders_search;
const save_notification_data = (set_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield DAO.save_data(Models.Notifications, set_data);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.save_notification_data = save_notification_data;
const verify_product_info = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Products, query, projection, options);
        // console.log(fetch_data)
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.verify_product_info = verify_product_info;
const save_wishlist = (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id } = data;
        let set_data = {
            product_id: product_id,
            user_id: user_id,
            created_at: +new Date(),
        };
        let response = yield DAO.save_data(Models.Wishlist, set_data);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.save_wishlist = save_wishlist;
const save_to_cart = (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { quantity, product, delivery_charges, price } = data;
        let query = { _id: product }, projection = { price: 1, discount_price: 1 }, options = { lean: true };
        let product_data = yield DAO.get_single_data(Models.Products, query, projection, options);
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
        let response = yield DAO.save_data(Models.Cart, data_to_save);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.save_to_cart = save_to_cart;
const fetch_Cart_data = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [{ path: "product", select: "" }];
        let response = yield DAO.populate_data(Models.Cart, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_Cart_data = fetch_Cart_data;
const edit_cart = (data, cart_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: cart_id };
        let projection = { product: 1 };
        let options = { lean: true };
        let get_cart_data = yield DAO.get_single_data(Models.Cart, query, projection, options);
        let query_data = { _id: get_cart_data.product };
        let projections = { discount_price: 1 };
        let get_product = yield DAO.get_single_data(Models.Products, query_data, projections, options);
        let set_data = {};
        if (data.quantity) {
            set_data.quantity = data.quantity;
            set_data.total_price = data.quantity * get_product.discount_price;
        }
        let query_dta = { _id: cart_id };
        let response_data = yield DAO.find_and_update(Models.Cart, query_dta, set_data, options);
        return response_data;
    }
    catch (err) {
        throw err;
    }
});
exports.edit_cart = edit_cart;
const save_card = (data, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    let { number, holder_name, exp_month, exp_year, cvc } = data, response;
    let data_to_save = {
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
    let fetch_data = yield fetch_total_count(Models.Cards, query);
    if (fetch_data !== 0) {
        data_to_save.is_default = false;
        response = yield DAO.save_data(Models.Cards, data_to_save);
    }
    else {
        data_to_save.is_default = true;
        response = yield DAO.save_data(Models.Cards, data_to_save);
    }
    return response;
});
exports.save_card = save_card;
const get_seller_data = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: _id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_single_data(Models.Users, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.get_seller_data = get_seller_data;
const fetch_cards = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let query = { user_id : user_id }
        let projection = { __v: 0, cvv: 0 };
        let respone = yield DAO.get_data(Models.Cards, query, projection, options);
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_cards = fetch_cards;
const update_card = (query, update) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Cards, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.update_card = update_card;
const fetch_order_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { order_status: 1, total_price: 1 };
        let populate = [
            { path: "product", select: "_id images name price" },
            { path: "user_id", select: "name profile_pic address phone_no " },
            { path: "address_id", select: "" },
            { path: "parcel_id", select: "" },
        ];
        let fetch_data = yield DAO.populate_data(Models.Orders, query, projection, options, populate);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_order_detail = fetch_order_detail;
const get_products = (query_product, optionss) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let fetch_products = yield DAO.get_data(Models.Products, query_product, projection, optionss);
        // console.log("Fetch_Products", fetch_products)
        return fetch_products;
    }
    catch (err) {
        throw (err);
    }
});
exports.get_products = get_products;
const get_seller = (query_seller, options_seller) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let fetch_seller = yield DAO.get_data(Models.Sellers, query_seller, projection, options_seller);
        // console.log("Fetch_Seller", fetch_seller)
        return fetch_seller;
    }
    catch (err) {
        throw (err);
    }
});
exports.get_seller = get_seller;
const user_shippoAddress = (_id, address_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let { _id } = req.user_data;
        let query = { user_id: _id, _id: address_id };
        let projection, options = { lean: true };
        let get_address = yield DAO.get_single_data(Models.Address, query, projection, options);
        // console.log('-----------------------HEREEEE ')
        var UseraddressTo = yield shippo.address.create({
            "name": get_address.name,
            "street1": get_address.apartment_number,
            "city": get_address.city,
            "state": get_address.state,
            "zip": get_address.pin_code,
            "country": get_address.country
        });
        // console.log("User address id ", UseraddressTo.object_id)
        let validate_user_address = yield shippo.address.validate(UseraddressTo.object_id);
        // console.log("validate_user_address.object_id ", validate_user_address.object_id)
        let update = {
            shippo_user_address_id: validate_user_address.object_id
        };
        let option = { new: true };
        let update_seller = yield DAO.find_and_update(Models.Address, query, update, option);
        // console.log("SERVICE ", update_seller)
        return update_seller;
    }
    catch (err) {
        throw (err);
    }
});
exports.user_shippoAddress = user_shippoAddress;
