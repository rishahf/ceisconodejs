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
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel_order_module = exports.order_listing_module = exports.order_module = void 0;
const DAO = __importStar(require("../../DAO"));
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../../models");
const index_1 = require("../../middlewares/index");
const shippo = require('shippo')(process.env.SHIPPO_TOKEN);
const stripe_1 = __importDefault(require("stripe"));
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options = { apiVersion: '2020-08-27' };
const stripe = new stripe_1.default(STRIPE_KEY, stripe_options);
const list_orders = __importStar(require("./list_orders"));
const order_details = __importStar(require("./order_details"));
const order_response = __importStar(require("./order_response"));
const moment_1 = __importDefault(require("moment"));
const email_services = __importStar(require("./email_services"));
const index_2 = require("../../middlewares/index");
const common_1 = require("../../middlewares/common");
class stripe_payments {
}
_a = stripe_payments;
stripe_payments.create_pi = (req, price_data, order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { card_id } = req.body;
        let { _id: user_id, name, email, customer_id } = req.user_data;
        let card_details = yield _a.retrive_card_details(card_id, user_id);
        console.log("+++++ card details", card_details);
        if (card_details.length) {
            let { payment_method } = card_details[0];
            let { total_price, total_cd, total_earnings } = price_data;
            let amount = Number(total_price) * 100;
            let fixed_amount = parseInt(amount.toFixed(2));
            let admin_fess = parseInt(total_earnings.toFixed(2)) * 100;
            let payment_intent = yield stripe.paymentIntents.create({
                amount: fixed_amount,
                currency: 'usd',
                payment_method: payment_method,
                customer: customer_id,
                description: `name ${name}, email ${email}`,
                // application_fee_amount: admin_fess,
                metadata: {
                    name: name,
                    email: email
                }
            });
            console.log("-----payment++++======intent=====", payment_intent);
            // confirm_intent
            let options = { payment_method: payment_method };
            yield stripe.paymentIntents.confirm(payment_intent.id, options);
            return { payment_intent: payment_intent.id };
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INAVLID_CARD_ID", "ENGLISH");
        }
    }
    catch (err) {
        console.log("stripe_err...", err);
        yield _a.delete_order_if_error(order_id);
        throw err.raw.message;
    }
});
stripe_payments.retrive_card_details = (card_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: card_id, user_id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(models_1.Cards, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
stripe_payments.delete_order_if_error = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // delete order products
        yield DAO.remove_many(models_1.OrderProducts, { order_id: order_id });
        // delete order
        yield DAO.remove_data(models_1.Orders, { _id: order_id });
    }
    catch (err) {
        throw err;
    }
});
class order_module extends stripe_payments {
    static check_coupon1(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name, product_id, amount: tt_price } = req.body, { _id: user_id } = req.user_data;
                let curr_date = +new Date();
                let current_date = moment_1.default.utc(curr_date, "x").format("YYYY-MM-DD");
                let projection = { __v: 0 };
                let options = { lean: true };
                let query = { code: name, is_available: true, is_deleted: false, end_date: { $gte: current_date } };
                //   product_id: { $in: [mongoose.Types.ObjectId(product_id)] };
                let resp = yield DAO.get_data(models_1.Coupons, query, projection, options);
                let check_expiry = yield DAO.get_data(models_1.Coupons, { code: name, end_date: { $lt: current_date } }, projection, options);
                if (check_expiry && check_expiry.length) {
                    throw yield (0, index_1.handle_custom_error)("COUPON_NOT_AVAILABLE", "ENGLISH");
                }
                if (resp.length) {
                    if (resp[0].applicable_for == "LIMITED") {
                        console.log('--inside limited products --');
                        query.product_ids = { $in: product_id };
                    }
                    let response = yield DAO.get_data(models_1.Coupons, query, projection, options);
                    if (response.length) {
                        let { _id } = response[0];
                        let query = { coupon_id: _id, user_id: user_id };
                        let used_coupons = yield DAO.get_data(models_1.Used_Coupons, query, projection, options);
                        if (used_coupons.length) {
                            throw yield (0, index_1.handle_custom_error)("COUPON_ALREADY_USED", "ENGLISH");
                        }
                        else {
                            let { type, price: fixed_price, max_discount, percentage, } = response[0];
                            let coupon_discount = 0;
                            if (type == "FIXED") {
                                coupon_discount = Number(fixed_price);
                            }
                            else {
                                let percent = Number(percentage);
                                let percent_discount = Number(percent / 100) * Number(tt_price);
                                if (percent_discount > max_discount) {
                                    coupon_discount = max_discount;
                                }
                                else {
                                    coupon_discount = percent_discount;
                                }
                            }
                            console.log("tt price ", tt_price, "coupon discount ", coupon_discount);
                            if (tt_price > coupon_discount) {
                                return response[0];
                            }
                            else {
                                throw yield (0, index_1.handle_custom_error)("THIS_COUPON_IS_NOT_APPLICABLE", "ENGLISH");
                            }
                        }
                    }
                    else {
                        throw yield (0, index_1.handle_custom_error)("COUPON_NOT_AVAILABLE", "ENGLISH");
                    }
                }
                else {
                    throw yield (0, index_1.handle_custom_error)("INVALID_COUPON", "ENGLISH");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    static check_coupon(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { name } = req.body, { _id: user_id } = req.user_data;
                let availblity_response = [];
                let coupon_discount = 0;
                let cp_discount = 0;
                let curr_date = +new Date();
                let current_date = moment_1.default.utc(curr_date, "x").format("YYYY-MM-DD");
                let projection = { __v: 0 };
                let options = { lean: true };
                let query = { code: name, is_available: true, is_deleted: false, end_date: { $gte: current_date } };
                //   product_id: { $in: [mongoose.Types.ObjectId(product_id)] };
                let resp = yield DAO.get_data(models_1.Coupons, query, projection, options);
                if (resp && resp.length) {
                    let chck_used = yield DAO.get_data(models_1.Used_Coupons, { coupon_id: resp[0]._id, user_id: user_id }, projection, options);
                    if (chck_used && chck_used.length) {
                        throw yield (0, index_1.handle_custom_error)("COUPON_ALREADY_USED", "ENGLISH");
                    }
                    let check_expiry = yield DAO.get_data(models_1.Coupons, { code: name, end_date: { $lt: current_date } }, projection, options);
                    if (check_expiry && check_expiry.length) {
                        throw yield (0, index_1.handle_custom_error)("COUPON_NOT_AVAILABLE", "ENGLISH");
                    }
                    let cart_data = yield DAO.get_data(models_1.Cart, { user_id: user_id }, projection, options);
                    // console.log('cart_data ', cart_data);
                    for (let i = 0; i < cart_data.length; i++) {
                        if (resp[0].applicable_for == "LIMITED") {
                            console.log('--inside limited products --');
                            query.product_ids = { $in: cart_data[i].product_id };
                        }
                        let response = yield DAO.get_data(models_1.Coupons, query, projection, options);
                        let get_product = yield DAO.get_data(models_1.Products, { _id: cart_data[i].product_id }, projection, options);
                        // console.log("product ", get_product);
                        let product_price = get_product[0].discount_price;
                        if (response.length) {
                            let { type, price: fixed_price, max_discount, percentage } = response[0];
                            if (type == "FIXED") {
                                coupon_discount = Number(fixed_price);
                            }
                            else {
                                let percent = Number(percentage);
                                let percent_discount = Number(percent / 100) * Number(product_price);
                                if (percent_discount > max_discount) {
                                    coupon_discount = max_discount;
                                }
                                else {
                                    coupon_discount = percent_discount;
                                }
                            }
                            console.log("tt price ", product_price, "coupon discount ", coupon_discount, 'quantity ', cart_data[i].quantity);
                            if (product_price > coupon_discount) {
                                // for(let qty=0; qty < cart_data[i].quantity; qty++){
                                cp_discount += coupon_discount * cart_data[i].quantity;
                                // }
                                availblity_response.push({ product_id: cart_data[i].product_id, price: product_price, coupon_discount: coupon_discount * cart_data[i].quantity });
                                //   return response[0];
                            }
                            else {
                                cp_discount += 0;
                                availblity_response.push({ product_id: cart_data[i].product_id, price: product_price, coupon_discount: 0 });
                                //   throw await handle_custom_error("THIS_COUPON_IS_NOT_APPLICABLE","ENGLISH");
                            }
                        }
                        else {
                            // throw await handle_custom_error("COUPON_NOT_AVAILABLE","ENGLISH");
                            cp_discount += 0;
                            availblity_response.push({
                                product_id: cart_data[i].product_id,
                                price: product_price,
                                coupon_discount: 0,
                            });
                        }
                    }
                    if (cp_discount != 0) {
                        return {
                            coupon_discount: cp_discount,
                            // availblity_response: availblity_response,
                            response: resp[0],
                        };
                    }
                    else {
                        throw yield (0, index_1.handle_custom_error)("THIS_COUPON_IS_NOT_APPLICABLE", "ENGLISH");
                    }
                }
                else {
                    throw yield (0, index_1.handle_custom_error)("INVALID_COUPON", "ENGLISH");
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    static check_delivery(req) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { _id } = req.params, { _id: user_id } = req.user_data;
                let response_ = 0;
                let response;
                console.log("req.query 2 ", req.params);
                let projection = { __v: 0 };
                let options = { lean: true };
                let query = { _id: mongoose_1.default.Types.ObjectId(_id) };
                let address_response = yield DAO.get_data(models_1.Address, query, projection, options);
                let cart_response = yield DAO.get_data(models_1.Cart, { user_id: user_id }, projection, options);
                // console.log('address_response ', address_response)
                let unmatch_count = 0;
                if (cart_response && cart_response.length) {
                    yield Promise.all(cart_response.map((cart_item) => __awaiter(this, void 0, void 0, function* () {
                        let product_id = cart_item.product_id;
                        console.log('product_id ', product_id);
                        let product_details = yield DAO.get_data(models_1.Products, { _id: product_id }, projection, options);
                        let { is_delivery_available } = product_details[0];
                        if (is_delivery_available == true) {
                            console.log('is_delivery available--- ', is_delivery_available);
                            unmatch_count = 1;
                        }
                        else {
                            console.log('is_delivery available--- ', is_delivery_available);
                            let query = [
                                yield this.match_product_id(product_id),
                                yield this.find_nearest(address_response[0].lng, address_response[0].lat),
                            ];
                            response = yield DAO.aggregate_data(models_1.Delivery_Locations, query, { lean: true });
                            console.log("response ", response.length);
                            if (response && response.length) {
                                let query_new = [
                                    yield this.find_geo_near(address_response[0].lng, address_response[0].lat, Number(response[0].radius), product_id),
                                ];
                                let get_data = yield DAO.aggregate_data(models_1.Delivery_Locations, query_new, { lean: true });
                                if (get_data && get_data.length) {
                                    unmatch_count = 1;
                                    console.log("unmatch_count1", unmatch_count);
                                }
                                else {
                                    unmatch_count = 0;
                                    console.log("unmatch_count2", unmatch_count);
                                    return false;
                                    // throw await handle_custom_error("DELIVERY_NOT_AVAILABLE", "ENGLISH")
                                }
                                console.log('out ', unmatch_count);
                            }
                            else {
                                unmatch_count = 0;
                                return false;
                                // throw await handle_custom_error("DELIVERY_NOT_AVAILABLE", "ENGLISH")
                            }
                        }
                    })));
                    console.log("unmatch_count > 0 ", unmatch_count, unmatch_count > 0);
                    if (unmatch_count > 0) {
                        console.log("unmatch_count -- inside", unmatch_count);
                        return true;
                    }
                    else {
                        return false;
                        // throw await handle_custom_error("DELIVERY_NOT_AVAILABLE", "ENGLISH")
                    }
                }
            }
            catch (err) {
                throw err;
            }
        });
    }
    static find_nearest(long_from, lat_from) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("find-nearest.... lng, lat.....", long_from, lat_from);
                var earthRadiusInMiles = 3963.19;
                let result = 100 / earthRadiusInMiles;
                return {
                    $match: {
                        "location.coordinates": {
                            $geoWithin: {
                                $centerSphere: [[Number(long_from), Number(lat_from)], result],
                            },
                        },
                    },
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
    static find_geo_near(long, lat, get_kms, product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                //      console.log("find_geo_near..... lng lat ....", get_kms);
                //   console.log("get_kms...", get_kms);
                let radius = Number(get_kms) * 1000;
                //   console.log("radius...", radius);
                return {
                    $geoNear: {
                        near: { type: "Point", coordinates: [Number(long), Number(lat)] },
                        key: "location",
                        distanceField: "distance",
                        maxDistance: radius,
                        spherical: true,
                        query: {
                            product_id: mongoose_1.default.Types.ObjectId(product_id),
                        },
                    },
                };
            }
            catch (err) {
                throw err;
            }
        });
    }
}
exports.order_module = order_module;
_b = order_module;
order_module.createInvoice = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let res = yield index_1.helpers.generate_invoice_id();
        return res;
    }
    catch (err) {
        throw err;
    }
});
order_module.create = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { address_id, card_id, coupon_code, payment_mode, products } = req.body;
        let { _id: user_id } = req.user_data;
        let order_id = yield index_1.helpers.genrate_order_id();
        let coupon_data = coupon_code != undefined ? yield _b.check_coupon_code(coupon_code, user_id) : null;
        // console.log('coupon_data 1 ---- ', coupon_data);
        let data_to_save = {
            order_id: order_id,
            user_id: user_id,
            address_id: address_id,
            payment_mode: payment_mode,
            updated_at: +new Date(),
            created_at: +new Date()
        };
        if (!!card_id) {
            data_to_save.card_id = card_id;
        }
        if (!!coupon_code) {
            data_to_save.coupon_code = coupon_code;
        }
        let create_order = yield DAO.save_data(models_1.Orders, data_to_save);
        let { _id: create_order_id = null } = create_order;
        if (create_order_id != null) {
            let save_order_products = yield _b.save_order_products(create_order_id, req, coupon_data);
            let update_order = yield _b.update_total_price(req, create_order, save_order_products);
            console.log("++==update order ", update_order);
            let response = yield _b.order_response(create_order_id);
            response["_id"] = create_order._id;
            // console.log("response...", response)
            let { images_array } = save_order_products;
            console.log('------ response ----- ', response);
            //notification
            let customer_fcms = yield common_1.common_module.customer_fcms_arr(user_id);
            console.log('create order fcms customer ---- ---- ', customer_fcms);
            if (customer_fcms && customer_fcms.length) {
                let notification_customer = {
                    type: "ORDER_CREATED",
                    title: "Order Placed",
                    message: "Your Order has been Placed Successfully",
                    user_id: user_id,
                    order_id: create_order_id,
                    images: images_array,
                    created_at: +new Date(),
                };
                yield DAO.save_data(models_1.Notifications, notification_customer);
                yield (0, index_2.send_notification_to_all)(notification_customer, customer_fcms);
            }
            //notification to admin
            let notification_admin = {
                type: "ORDER_CREATED",
                title: "Order Placed",
                message: "New Order Placed",
                //   user_id: user_id,
                order_id: create_order_id,
                created_at: +new Date(),
            };
            yield common_1.common_module.send_notification_to_admin(notification_admin);
            //email
            let user_detail = yield common_1.common_module.get_user_detail(user_id);
            yield _b.send_order_mail(user_detail, create_order_id, products);
            return response;
        }
        else {
            throw yield (0, index_1.handle_custom_error)("ORDER_CREATION_FAILED", "ENGLISH");
        }
    }
    catch (err) {
        console.log("err...case1...", err);
        throw err;
    }
});
order_module.send_order_mail1 = (user_detail, order_id, products_to_order) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let arr_orders = {};
        let query_order = { _id: order_id };
        let get_order = yield DAO.get_data(models_1.Orders, query_order, projection, options);
        let { order_id: orderId, total_price: total_paid_amount, address_id, coupon_code, created_at } = get_order[0];
        let get_address = yield DAO.get_data(models_1.Address, { _id: address_id }, projection, options);
        let { full_address } = get_address[0];
        let query_order_prods = { order_id: order_id };
        let get_order_products = yield DAO.get_data(models_1.OrderProducts, query_order_prods, projection, options);
        let sub_total = 0, del_price = 0, cp_discount = 0;
        let orders_arr = [];
        for (let k = 0; k < products_to_order.length; k++) {
            let { quantity, product_id } = products_to_order[k];
            if (quantity > 1) {
                orders_arr.push({});
            }
        }
        if (get_order_products && get_order_products.length) {
            for (let i = 0; i < get_order_products.length; i++) {
                let { seller_id, product_id, total_price, delivery_price, coupon_discount } = get_order_products[i];
                let get_seller_comp = yield DAO.get_data(models_1.Sellers, { _id: seller_id }, projection, options);
                let get_prduct = yield DAO.get_data(models_1.Products, { _id: product_id }, projection, options);
                let { images } = get_prduct[0];
                let image_path = `${process.env.IMAGE_PATH}${images[0]}`;
                get_order_products[i].seller_company = get_seller_comp[0].company;
                get_order_products[i].product_image = image_path;
                sub_total += total_price;
                del_price += delivery_price;
                cp_discount += coupon_discount;
            }
            arr_orders = {
                orders_id: orderId,
                total_paid_amount: total_paid_amount,
                sub_total: sub_total,
                delivery_price: del_price,
                coupon_code: coupon_code,
                coupon_discount: cp_discount,
                user_address: full_address,
                created_at: created_at,
                orders: get_order_products
            };
            console.log('arr_orders --- ', arr_orders);
            yield email_services.create_order_mail_to_customer(user_detail, arr_orders);
        }
    }
    catch (err) {
        console.log("err..", err);
        throw err;
    }
});
order_module.send_order_mail = (user_detail, order_id, products_to_order) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let arr_orders = {};
        let query_order = { _id: order_id };
        let get_order = yield DAO.get_data(models_1.Orders, query_order, projection, options);
        let { order_id: orderId, total_price: total_paid_amount, address_id, coupon_code, created_at } = get_order[0];
        let get_address = yield DAO.get_data(models_1.Address, { _id: address_id }, projection, options);
        let { full_address } = get_address[0];
        let sub_total = 0, del_price = 0, cp_discount = 0;
        let orders_arr = [];
        let get_order_products;
        for (let i = 0; i < products_to_order.length; i++) {
            let { product_id, quantity, is_deleted } = products_to_order[i];
            let query_order_prods = { order_id: order_id, product_id: product_id };
            get_order_products = yield DAO.get_data(models_1.OrderProducts, query_order_prods, projection, options);
            if (get_order_products && get_order_products.length) {
                let { seller_id, product_id, total_price, delivery_price, coupon_discount } = get_order_products[0];
                let get_seller_comp = yield DAO.get_data(models_1.Sellers, { _id: seller_id }, projection, options);
                let get_prduct = yield DAO.get_data(models_1.Products, { _id: product_id }, projection, options);
                let { images } = get_prduct[0];
                let image_path = `${process.env.IMAGE_PATH}${images[0]}`;
                get_order_products[0].seller_company = get_seller_comp[0].company;
                get_order_products[0].product_image = image_path;
                get_order_products[0].quantity = quantity;
                get_order_products[0].discount_price = quantity * get_order_products[0].discount_price;
                sub_total += total_price * quantity;
                del_price += delivery_price;
                cp_discount += coupon_discount * quantity;
                orders_arr.push(get_order_products[0]);
            }
        }
        ;
        arr_orders = {
            orders_id: orderId,
            total_paid_amount: total_paid_amount,
            sub_total: sub_total,
            delivery_price: del_price,
            coupon_code: coupon_code,
            coupon_discount: cp_discount,
            user_address: full_address,
            created_at: created_at,
            orders: orders_arr
        };
        console.log('arr_orders --- ', arr_orders);
        yield email_services.create_order_mail_to_customer(user_detail, arr_orders);
    }
    catch (err) {
        console.log("err..", err);
        throw err;
    }
});
// static seller_mail_notify = async(req_data:any,user_id:string)=>{
//     let projection = { __v: 0 };
//     let options = { lean: true };
//     let { products } = req_data;
//     if(products && products.length){
//         for(let i=0; i<products.length; i++){
//             let { _id, added_by } = products[i]
//             let query_order = { product_id: mongoose.Types.ObjectId(_id), };
//             let orderProduct = DAO.get_data(OrderProducts,query_order,projection, options)
//             let seller_detail: any = await this.get_user_detail(added_by);
//             // await email_services.create_order_mail_to_customer(seller_detail,response);
//             //notification
//             let customer_fcms = await this.customer_fcms_arr(user_id);
//             if(customer_fcms && customer_fcms.length){
//                 let notification_customer: any = {
//                   type: "NEW_ORDER",
//                   title: "Order Placed",
//                   message: "Your Order has been Placed Successfully",
//                   user_id: added_by,
//                   order_id: create_order_id,
//                 };
//                 await DAO.save_data(Notifications,notification_customer);
//                 await send_notification_to_all(notification_customer,customer_fcms);
//             }
//         }
//     }
// }
order_module.check_coupon_code = (coupon_code, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let curr_date = +new Date();
        let current_date = moment_1.default.utc(curr_date, 'x').format("YYYY-MM-DD");
        let query = {
            code: coupon_code,
            is_available: true,
            is_deleted: false,
            end_date: { $gte: current_date },
        };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(models_1.Coupons, query, projection, options);
        console.log("coupon check ", response);
        if (response.length) {
            let { _id } = response[0];
            let query = { coupon_id: _id, user_id: mongoose_1.default.Types.ObjectId(user_id) };
            console.log('quer ', query);
            let used_coupons = yield DAO.get_data(models_1.Used_Coupons, query, projection, options);
            console.log("coupon check used_coupons ", used_coupons);
            if (used_coupons.length) {
                throw yield (0, index_1.handle_custom_error)("COUPON_ALREADY_USED", "ENGLISH");
            }
            else {
                // let data_to_save = {
                //     user_id: user_id,
                //     coupon_id: _id,
                //     created_at: +new Date()
                // }
                // await DAO.save_data(Used_Coupons, data_to_save);
                return response[0];
            }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("COUPON_NOT_AVAILABLE", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
//old to save order products with total quantity
// static save_order_products1 = async (order_id: string, req: any, coupon_data: any) => {
//     try {
//         let { products } = req.body, { _id: user_id } = req.user_data;
//         let total_product_price = 0, total_coupon_discount = 0, total_earnings = 0, tax_price;
//         if (products.length) {
//             for (let i = 0; i < products.length; i++) {
//                 let { product_id, quantity, delivery_price, shipment_id, transaction_id } = products[i]
//                 let query = { _id: product_id }
//                 let projection = { __v: 0 }
//                 let options = { lean: true }
//                 let retrive_products: any = await DAO.get_data(Products, query, projection, options)
//                 if (retrive_products.length) {
//                     let { discount_price, added_by, quantity: quantity_2, tax_percentage,price:actual_price } = retrive_products[0];
//                     if (Number(quantity) > Number(quantity_2)) {
//                         throw await handle_custom_error("INSUFFICIENT_QUANTITY", "ENGLISH")
//                     }
//                     else {
//                         let set_delivery_price = delivery_price == undefined ? 0 : delivery_price
//                         let total_pp = Number(discount_price) * Number(quantity);
//                         let coupon_discount: number;
//                         if(!!coupon_data){
//                             if(coupon_data.applicable_for == 'ALL'){
//                             coupon_discount = await this.cal_coupon_discount(coupon_data, total_pp, user_id )
//                         }else if(coupon_data.applicable_for == 'LIMITED'){
//                             console.log('cpn prd_ids ', coupon_data.product_ids)
//                             let query_cpn = { _id:coupon_data._id, product_ids:{$in:[product_id]}}
//                             let getCoupon:any = await DAO.get_data(Coupons,query_cpn, projection,options)
//                             if(getCoupon && getCoupon.length){
//                                 console.log('product _id present in coupn ')
//                                 coupon_discount = await this.cal_coupon_discount(coupon_data, total_pp,user_id)
//                             } else{
//                                 console.log('not present in coupn ',product_id in coupon_data.product_ids)
//                                 coupon_discount = 0
//                             }
//                         }
//                         }else{
//                             coupon_discount = 0;
//                         }
//                         console.log("coupon_discount -- ", coupon_discount);
//                         let total_cd = Number(coupon_discount) * Number(quantity);
//                         let total_price = Number(total_pp) + Number(set_delivery_price) - Number(total_cd);
//                         let admin_fees = await this.admin_fees()
//                         console.log("admin_fees...", admin_fees)
//                         let cal_admin_earnings = total_pp * admin_fees;
//                         console.log("cal_earnings...", cal_admin_earnings,'total_price...', total_price);
//                         // total_product_price += total_price;
//                         // total_coupon_discount += total_cd;
//                         // total_earnings = total_price - cal_admin_earnings;
//                         if(!!coupon_data){
//                             if (coupon_data.added_by == "ADMIN") {
//                               cal_admin_earnings -= coupon_discount;
//                             } else if (coupon_data.added_by == "SELLER") {
//                               total_earnings -= coupon_discount;
//                             }
//                         }
//                         total_product_price += total_price;
//                         total_coupon_discount += total_cd;
//                         total_earnings = total_price - cal_admin_earnings;
//                         let tax_percent = tax_percentage == undefined ? 0 : tax_percentage
//                         tax_price = (Number(tax_percent) / 100) * Number(total_price);
//                         console.log("tax_price", tax_price);
//                         console.log('total_earnings ', total_earnings);
//                         console.log("total_product_price...", total_product_price);
//                         console.log("total_coupon_discount...", total_coupon_discount);
//                         // console.log("total_product_price...", total_product_price);
//                         let product_order_id = await helpers.genrate_product_order_id()
//                         let tax_no = await helpers.generate_tax_no()
//                         let data_to_save: any = {
//                           order_id: order_id,
//                           product_order_id: product_order_id,
//                           tax_no: Number(tax_no),
//                           product_id: product_id,
//                           user_id: user_id,
//                           seller_id: added_by,
//                           quantity: quantity,
//                           price: discount_price,
//                           delivery_price: set_delivery_price,
//                           coupon_discount: total_cd,
//                           total_price: total_price,
//                           total_earnings: total_earnings,
//                           admin_commision: cal_admin_earnings,
//                           tax_percentage: tax_percentage,
//                           tax_amount: Number(tax_price),
//                           order_status: "PLACED",
//                           // delivery_status: "PENDING",
//                           updated_at: +new Date(),
//                           created_at: +new Date(),
//                         };
//                         // shippo shipment
//                         if (!!shipment_id) {
//                             let shipment_data = await shippo.shipment.retrieve(shipment_id);
//                             let { rates } = shipment_data;
//                             let { object_id, estimated_days, servicelevel: { token } } = rates[0];
//                             data_to_save.shippo_data = {
//                                 shipment_id: shipment_id,
//                                 rate_id: object_id,
//                                 service_level: token,
//                                 estimated_days: estimated_days
//                             }
//                         }
//                         // shippo transaction
//                         if (!!transaction_id) {
//                             let transaction_data: any = await shippo.transaction.retrieve(transaction_id)
//                             let { parcel, tracking_number, label_url } = transaction_data;
//                             data_to_save.shippo_data = {
//                                 transaction_id: transaction_id,
//                                 parcel_id: parcel,
//                                 tracking_no: tracking_number,
//                                 label_url: label_url
//                             }
//                         }
//                         //removing item from cart 
//                         let query_cart = { user_id:user_id, product_id:product_id}
//                         let get_cart:any = await DAO.get_data(Cart,query_cart,projection,options)
//                         if(!!get_cart){
//                             console.log('--inside card-- product id -- ', product_id);
//                             get_cart.forEach(async(item:any) => {
//                                 let query_cart2 = { _id:item._id }
//                                 await DAO.remove_data(Cart, query_cart2)
//                             });
//                         }
//                         let OrderProduct:any = await DAO.save_data(OrderProducts, data_to_save)
//                         await this.save_invoice(OrderProduct._id);
//                         await this.dec_product_quantity(product_id, quantity)
//                     }
//                 }
//             }
//         }
//         return {
//             total_price: total_product_price,
//             total_cd: total_coupon_discount,
//             total_earnings : total_earnings
//         }
//     }
//     catch (err) {
//         console.log("err...case2...", err)
//         throw err;
//     }
// }
//new to save order products with single - single quantity
order_module.save_order_products = (order_id, req, coupon_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { products, address_id } = req.body, { _id: user_id } = req.user_data;
        let images_arr = [];
        let total_product_price = 0, total_coupon_discount = 0, total_earnings = 0, tax_price;
        if (products.length) {
            for (let i = 0; i < products.length; i++) {
                let { product_id, quantity, delivery_price, shipment_id, transaction_id } = products[i];
                let query = { _id: product_id };
                let projection = { __v: 0 };
                let options = { lean: true };
                let retrive_products = yield DAO.get_data(models_1.Products, query, projection, options);
                if (retrive_products.length) {
                    let { price, discount_price, discount_percantage, added_by, quantity: quantity_2, tax_percentage, price: actual_price, images, is_deleted } = retrive_products[0];
                    console.log("PRoduvt deleted ", is_deleted);
                    if (is_deleted == 'true' || is_deleted == true) {
                        console.log("IS DELETED ");
                        throw yield (0, index_1.handle_custom_error)("YOU_CANNO_PLACE_THIS_ORDER", "ENGLISH");
                    }
                    if (images && images.length) {
                        images_arr.push(images[0]);
                    }
                    if (Number(quantity) > Number(quantity_2)) {
                        throw yield (0, index_1.handle_custom_error)("INSUFFICIENT_QUANTITY", "ENGLISH");
                    }
                    else {
                        for (let i = 0; i < quantity; i++) {
                            let set_delivery_price = delivery_price == undefined ? 0 : delivery_price;
                            let new_quantity = 1;
                            // let total_pp = Number(discount_price) * Number(quantity);
                            let total_pp = Number(discount_price);
                            let coupon_discount;
                            if (!!coupon_data) {
                                if (coupon_data.applicable_for == 'ALL') {
                                    coupon_discount = yield _b.cal_coupon_discount(coupon_data, total_pp, user_id);
                                }
                                else if (coupon_data.applicable_for == 'LIMITED') {
                                    console.log('cpn prd_ids ', coupon_data.product_ids);
                                    let query_cpn = { _id: coupon_data._id, product_ids: { $in: [product_id] } };
                                    let getCoupon = yield DAO.get_data(models_1.Coupons, query_cpn, projection, options);
                                    if (getCoupon && getCoupon.length) {
                                        console.log('product _id present in coupn ');
                                        coupon_discount = yield _b.cal_coupon_discount(coupon_data, total_pp, user_id);
                                    }
                                    else {
                                        console.log('not present in coupn ', product_id in coupon_data.product_ids);
                                        coupon_discount = 0;
                                    }
                                }
                            }
                            else {
                                coupon_discount = 0;
                            }
                            console.log("coupon_discount -- ", coupon_discount);
                            // let total_cd = Number(coupon_discount) * Number(quantity);
                            let total_cd = Number(coupon_discount);
                            let total_price = Number(total_pp) + Number(set_delivery_price) - Number(total_cd);
                            let admin_fees = yield _b.admin_fees();
                            console.log("admin_fees...", admin_fees);
                            let cal_admin_earnings = total_pp * admin_fees;
                            console.log("cal_earnings...", cal_admin_earnings, 'total_price...', total_price);
                            // total_product_price += total_price;
                            // total_coupon_discount += total_cd;
                            // total_earnings = total_price - cal_admin_earnings;
                            if (!!coupon_data) {
                                if (coupon_data.added_by == "ADMIN") {
                                    cal_admin_earnings -= coupon_discount;
                                }
                                else if (coupon_data.added_by == "SELLER") {
                                    total_earnings -= coupon_discount;
                                }
                            }
                            total_product_price += total_price;
                            total_coupon_discount += total_cd;
                            total_earnings = total_price - cal_admin_earnings;
                            let tax_percent = tax_percentage == undefined ? 0 : tax_percentage;
                            tax_price = (Number(tax_percent) / 100) * Number(total_price);
                            console.log("tax_price", tax_price);
                            console.log('total_earnings ', total_earnings);
                            console.log("total_product_price...", total_product_price);
                            console.log("total_coupon_discount...", total_coupon_discount);
                            console.log("added ...", added_by);
                            let product_order_id = yield index_1.helpers.genrate_product_order_id();
                            let tax_no = yield index_1.helpers.generate_tax_no();
                            //address
                            let address = yield _b.get_address_detail(address_id);
                            console.log('address ', address);
                            let data_to_save = {
                                order_id: order_id,
                                product_order_id: product_order_id,
                                tax_no: Number(tax_no),
                                product_id: product_id,
                                user_id: user_id,
                                seller_id: added_by,
                                quantity: new_quantity,
                                discount_percantage: discount_percantage,
                                price: price,
                                discount_price: discount_price,
                                delivery_price: set_delivery_price,
                                coupon_discount: total_cd,
                                total_price: total_price,
                                total_earnings: total_earnings,
                                admin_commision: cal_admin_earnings,
                                tax_percentage: tax_percentage,
                                tax_amount: Number(tax_price),
                                order_status: "PLACED",
                                payment_status: "SUCCESS",
                                // delivery_status: "PENDING",
                                address_data: {
                                    name: address.name,
                                    country_code: address.country_code,
                                    phone_no: address.phone_no,
                                    company: address.company,
                                    country: address.country,
                                    state: address.state,
                                    city: address.city,
                                    pin_code: address.pin_code,
                                    apartment_number: address.apartment_number,
                                    full_address: address.full_address,
                                    address_type: address.address_type,
                                    lat: address.lat,
                                    lng: address.lng,
                                },
                                updated_at: +new Date(),
                                created_at: +new Date(),
                            };
                            // shippo shipment
                            if (!!shipment_id) {
                                let shipment_data = yield shippo.shipment.retrieve(shipment_id);
                                let { rates } = shipment_data;
                                let { object_id, estimated_days, servicelevel: { token } } = rates[0];
                                data_to_save.shippo_data = {
                                    shipment_id: shipment_id,
                                    rate_id: object_id,
                                    service_level: token,
                                    estimated_days: estimated_days
                                };
                            }
                            // shippo transaction
                            if (!!transaction_id) {
                                let transaction_data = yield shippo.transaction.retrieve(transaction_id);
                                let { parcel, tracking_number, label_url } = transaction_data;
                                data_to_save.shippo_data = {
                                    transaction_id: transaction_id,
                                    parcel_id: parcel,
                                    tracking_no: tracking_number,
                                    label_url: label_url
                                };
                            }
                            //removing item from cart 
                            let query_cart = { user_id: user_id, product_id: product_id };
                            let get_cart = yield DAO.get_data(models_1.Cart, query_cart, projection, options);
                            if (!!get_cart) {
                                console.log('--inside cart-- product id -- ', product_id);
                                get_cart.forEach((item) => __awaiter(void 0, void 0, void 0, function* () {
                                    let query_cart2 = { _id: item._id };
                                    yield DAO.remove_data(models_1.Cart, query_cart2);
                                }));
                            }
                            let OrderProduct = yield DAO.save_data(models_1.OrderProducts, data_to_save);
                            yield _b.save_invoice(OrderProduct._id);
                            yield _b.dec_product_quantity(product_id, quantity);
                            //email & notification
                            let seller_detail = yield common_1.common_module.get_seller_detail(added_by);
                            yield email_services.create_order_mail_to_seller(seller_detail, OrderProduct);
                            console.log('seller ', added_by);
                            let seller_fcms = yield common_1.common_module.seller_fcms_arr(added_by);
                            if (seller_fcms && seller_fcms.length) {
                                let notification_seller = {
                                    type: "NEW_ORDER",
                                    title: "New Order",
                                    message: "Your have a new order",
                                    seller_id: added_by,
                                    product_id: product_id,
                                    orderProduct_id: OrderProduct._id,
                                    created_at: +new Date(),
                                };
                                console.log('Notification --- to --- seller --- sent --- On ORDER');
                                yield DAO.save_data(models_1.Notifications, notification_seller);
                                console.log('seller -- fcms -- array ---  2 ', seller_fcms);
                                yield (0, index_2.send_notification_to_all)(notification_seller, seller_fcms);
                            }
                        }
                    }
                }
            }
        }
        return {
            total_price: total_product_price,
            total_cd: total_coupon_discount,
            total_earnings: total_earnings,
            images_array: images_arr
        };
    }
    catch (err) {
        console.log("err...case2...", err);
        throw err;
    }
});
order_module.get_address_detail = (address_id) => __awaiter(void 0, void 0, void 0, function* () {
    let projection = { __v: 0 };
    let options = { lean: true };
    let query = { _id: mongoose_1.default.Types.ObjectId(address_id) };
    let response = yield DAO.get_data(models_1.Address, query, projection, options);
    return response[0];
});
order_module.save_invoice = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let invoice_id = yield index_1.helpers.generate_invoice_id();
        let save_data = {
            order_product_id: order_id,
            invoice_id: invoice_id,
            created_at: +new Date()
        };
        yield DAO.save_data(models_1.OrderInvoices, save_data);
    }
    catch (err) {
        console.log("err..", err);
        throw err;
    }
});
order_module.admin_fees = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let retrive_fees = yield DAO.get_data(models_1.AdminFees, {}, {}, { lean: true });
        let fee_percentage = retrive_fees.length > 0 ? Number(retrive_fees[0].fee_percent) / 100 : 0;
        // console.log('admin_fee_percantage....', fee_percentage);
        return fee_percentage;
    }
    catch (err) {
        throw err;
    }
});
order_module.dec_product_quantity = (product_id, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: product_id };
        let update = {
            $inc: {
                quantity: -Number(quantity)
            }
        };
        let options = { new: true };
        yield DAO.find_and_update(models_1.Products, query, update, options);
        let response = yield DAO.get_data(models_1.Products, query, { __v: 0 }, { lean: true });
        if (response) {
            let update_stock = {};
            let stock_value = response[0].quantity != 0 ? false : true;
            update_stock.sold = stock_value;
            yield DAO.find_and_update(models_1.Products, query, update_stock, options);
        }
    }
    catch (err) {
        console.log("err...case3...", err);
        throw err;
    }
});
order_module.update_total_price = (req, order_data, price_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: order_id, address_id, payment_mode } = order_data;
        let { total_price, total_cd, total_earnings } = price_data;
        let query = { _id: order_id };
        let update = {
            coupon_discount: total_cd,
            total_price: total_price,
            total_earnings: total_earnings,
            updated_at: +new Date()
        };
        // payment mode
        if (payment_mode == "BY_CARD") {
            let payment_intent = yield _b.create_pi(req, price_data, order_id);
            let { payment_intent: pi } = payment_intent;
            update.stripe_data = { payment_intent: pi };
            console.log("-----add payment intent ", payment_intent);
        }
        let options = { new: true };
        let pi = yield DAO.find_and_update(models_1.Orders, query, update, options);
        console.log(pi);
        return pi;
    }
    catch (err) {
        console.log("err...case4...", err);
        throw err;
    }
});
order_module.cal_coupon_discount = (coupon_data, tt_price, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('---- coupon data ------ ',coupon_data)
        if (coupon_data != null) {
            let { type, price: fixed_price, max_discount, percentage } = coupon_data;
            let coupon_discount = 0;
            console.log(' coupon type ---- ', type);
            if (type == "FIXED") {
                coupon_discount = Number(fixed_price);
            }
            else {
                let percent = Number(percentage);
                let percent_discount = Number(percent / 100) * Number(tt_price);
                if (percent_discount > max_discount) {
                    coupon_discount = max_discount;
                }
                else {
                    coupon_discount = percent_discount;
                }
            }
            console.log('tt price ', tt_price, "coupon discount ", coupon_discount);
            if (tt_price > coupon_discount) {
                let data_to_save = {
                    user_id: user_id,
                    coupon_id: coupon_data._id,
                    created_at: +new Date(),
                };
                yield DAO.save_data(models_1.Used_Coupons, data_to_save);
                return coupon_discount;
            }
            else {
                throw yield (0, index_1.handle_custom_error)("THIS_COUPON_IS_NOT_APPLICABLE", "ENGLISH");
            }
        }
        else {
            let coupon_discount = 0;
            return coupon_discount;
        }
    }
    catch (err) {
        throw err;
    }
});
order_module.check_product_in_coupon = (product_id, coupon_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_ids: { $in: [product_id] } };
    }
    catch (err) {
        throw err;
    }
});
order_module.order_response = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("order_id...", order_id)
        let query = [
            yield order_response.match_data(order_id),
            yield order_response.lookup_orders(),
            yield order_response.unwind_orders(),
            yield order_response.lookup_order_products(),
            yield order_response.unwind_order_products(),
            yield order_response.lookup_products(),
            yield order_response.unwind_products(),
            yield order_response.lookup_address(),
            yield order_response.unwind_address(),
            yield order_response.group_data(),
            yield order_response.sort_data()
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(models_1.OrderProducts, query, options);
        return orders;
    }
    catch (err) {
        throw err;
    }
});
order_module.match_product_id = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        $match: {
            product_id: mongoose_1.default.Types.ObjectId(product_id),
        },
    };
});
class order_listing_module {
}
exports.order_listing_module = order_listing_module;
_c = order_listing_module;
order_listing_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: user_id } = req.user_data;
        let query = [
            yield list_orders.match_data(user_id),
            yield list_orders.lookup_order_products(),
            yield list_orders.unwind_order_products(),
            yield list_orders.lookup_reviewd_products(user_id),
            yield list_orders.unwind_products(),
            yield list_orders.group_data(),
            yield list_orders.filter_data(req.query),
            yield list_orders.sort_data(),
            yield list_orders.skip_data(req.query),
            yield list_orders.limit_data(req.query),
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(models_1.Orders, query, options);
        let query_count = [
            yield list_orders.match_data(user_id),
            yield list_orders.lookup_order_products(),
            yield list_orders.unwind_order_products(),
            yield list_orders.lookup_products(),
            yield list_orders.unwind_products(),
            yield list_orders.group_data(),
            yield list_orders.filter_data(req.query),
        ];
        let count_data = yield DAO.aggregate_data(models_1.Orders, query_count, options);
        return {
            total_count: count_data.length,
            data: orders
        };
    }
    catch (err) {
        throw err;
    }
});
order_listing_module.retrive_product_ratings = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let populate = [
            {
                path: "user_id",
                select: "profile_pic name"
            }
        ];
        let response = yield DAO.populate_data(models_1.Reviews, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw err;
    }
});
order_listing_module.details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: order_id } = req.params, { _id } = req.user_data;
        let query = [
            yield order_details.lookup_order_products(),
            yield order_details.unwind_order_products(),
            yield order_details.lookup_products(),
            yield order_details.unwind_products(),
            yield order_details.lookup_reviews_data(_id),
            //   await order_details.lookup_address(),
            //   await order_details.unwind_address(),
            yield order_details.group_data(),
            yield order_details.match_data(order_id, _id),
            yield order_details.sort_data(),
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(models_1.Orders, query, options);
        if (orders.length) {
            console.log("orders[0].order_id", orders[0].order_id);
            let query_others = [
                yield order_details.match_order_id(orders[0].order_id, _id, orders[0]._id),
                yield order_details.lookup_other_product(),
                yield order_details.unwind_products(),
                yield order_details.group_other_items()
            ];
            let other_order_items = yield DAO.aggregate_data(models_1.OrderProducts, query_others, options);
            // console.log(other_order_items)
            orders[0].other_order_items = other_order_items;
            return orders[0];
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
order_listing_module.order_products_details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: order_id } = req.params, { _id } = req.user_data;
        let query = [
            yield order_details.match_data(order_id, _id),
            yield order_details.lookup_ordered_products(),
            // await order_details.lookup_products(),
            // await order_details.unwind_products(),
            // await order_details.lookup_address(),
            // await order_details.unwind_address(),
            yield order_details.group_data1(),
            yield order_details.sort_data(),
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(models_1.Orders, query, options);
        if (orders.length) {
            return orders[0];
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
order_listing_module.order_products_invoice_details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: order_id } = req.params, { _id: user_id } = req.user_data;
        let query = [
            yield order_details.match(order_id, user_id),
            yield order_details.lookup_order(),
            yield order_details.unwind_orders(),
            yield order_details.lookup_sellers(),
            yield order_details.unwind_sellers(),
            yield order_details.lookup_users(),
            yield order_details.unwind_users(),
            //   await order_details.lookup_address(),
            //   await order_details.unwind_address(),
            yield order_details.lookup_product_invoice(),
            yield order_details.unwind_products(),
            yield order_details.lookup_order_invoice(order_id),
            yield order_details.unwind_invoice(),
            yield order_details.group_invoice_data(),
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(models_1.OrderProducts, query, options);
        if (orders.length) {
            return orders[0];
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
order_listing_module.payment_status = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { order_id } = req.query, { _id } = req.user_data;
        let query = { _id: order_id, user_id: _id };
        let projection = { stripe_data: 1 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(models_1.Orders, query, projection, options);
        if (fetch_data.length) {
            let { stripe_data: { payment_intent } } = fetch_data[0];
            let response = yield stripe.paymentIntents.retrieve(payment_intent);
            return response;
        }
    }
    catch (err) {
        throw err;
    }
});
class cancel_order_module {
}
exports.cancel_order_module = cancel_order_module;
_d = cancel_order_module;
//old
cancel_order_module.cancel1 = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: order_id, cancellation_reason, description } = req.body;
        let { _id: user_id } = req.user_data;
        let query = { _id: order_id, user_id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(models_1.Orders, query, projection, options);
        if (retrive_data.length) {
            let { _id, stripe_data: { payment_intent, refund_id } } = retrive_data[0];
            if (!!refund_id) {
                throw yield (0, index_1.handle_custom_error)("ORDER_ALREADY_CANCELLED", "ENGLISH");
            }
            else {
                // let retrive_refund_id = await this.create_refund(payment_intent)
                let query = { _id: _id };
                let data_to_update = {
                    cancelled_by: "BY_USER",
                    cancellation_reason: cancellation_reason,
                    // "stripe_data.refund_id": retrive_refund_id,
                    description: description,
                    cancel_requested: true,
                    cancelled_at: +new Date(),
                    updated_at: +new Date()
                };
                let options = { new: true };
                yield DAO.find_and_update(models_1.Orders, query, data_to_update, options);
                yield _d.update_order_products(_id);
                return {
                    message: "Order Cancelled Sucessfully"
                };
            }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
cancel_order_module.cancel = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, order_id, cancellation_reason, description } = req.body;
        let { _id: user_id } = req.user_data;
        let query = { _id: order_id, user_id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(models_1.Orders, query, projection, options);
        let retrive_orderProduct = yield DAO.get_data(models_1.OrderProducts, { _id: _id }, projection, options);
        if (retrive_data.length) {
            let { _id, product_id, quantity, order_status, seller_id } = retrive_orderProduct[0];
            let retrive_product = yield DAO.get_data(models_1.Products, { _id: product_id }, projection, { lean: true });
            let { images } = retrive_product[0];
            // let { _id, stripe_data: { payment_intent, refund_id } } = retrive_data[0]
            // if (!!refund_id) {
            //     throw await handle_custom_error("ORDER_ALREADY_CANCELLED", "ENGLISH")
            // }
            // else {
            // let retrive_refund_id = await this.create_refund(payment_intent)
            let query = { _id: _id };
            let data_to_update = {
                cancelled_by: "BY_USER",
                cancellation_reason: cancellation_reason,
                // "stripe_data.refund_id": retrive_refund_id,
                description: description,
                cancel_requested: true,
                previous_status: order_status,
                order_status: "PENDING_CANCELLATION",
                cancelled_at: +new Date(),
                updated_at: +new Date(),
            };
            let options = { new: true };
            yield DAO.find_and_update(models_1.OrderProducts, query, data_to_update, options);
            // await this.update_order_products(_id)
            // await this.inc_product_quantity(product_id, quantity);
            let user_detail = yield DAO.get_data(models_1.Users, { _id: mongoose_1.default.Types.ObjectId(user_id) }, projection, options);
            let seller_detail = yield DAO.get_data(models_1.Sellers, { _id: mongoose_1.default.Types.ObjectId(seller_id) }, projection, options);
            let product_detail = yield DAO.get_data(models_1.Products, { _id: mongoose_1.default.Types.ObjectId(product_id) }, projection, options);
            //notification to seller
            let seller_fcm_ids = yield common_1.common_module.seller_fcms(seller_id);
            if (seller_fcm_ids && seller_fcm_ids.length) {
                let notification_to_seller = {
                    type: "ORDER_CANCELLED_REQUEST",
                    title: "Order Cancelled Request",
                    message: "Cancellation request on order, check and approve the request",
                    seller_id: seller_id,
                    orderProduct_id: _id,
                    product_id: product_id,
                    created_at: +new Date(),
                };
                yield DAO.save_data(models_1.Notifications, notification_to_seller);
                yield (0, index_2.send_notification_to_all)(notification_to_seller, seller_fcm_ids);
            }
            //notification to customer
            let customer_fcm_ids = yield common_1.common_module.customer_fcms(user_id);
            if (customer_fcm_ids && customer_fcm_ids.length) {
                let notification_to_customer = {
                    type: "ORDER_CANCELLED_REQUESTED",
                    title: "Order Cancelled Request",
                    message: "Your order cancelled request has been sent",
                    images: images,
                    user_id: user_id,
                    orderProduct_id: _id,
                    order_id: order_id,
                    product_id: product_id,
                    created_at: +new Date(),
                };
                yield DAO.save_data(models_1.Notifications, notification_to_customer);
                yield (0, index_2.send_notification_to_all)(notification_to_customer, customer_fcm_ids);
            }
            let { order_id: orderIdString, coupon_code } = retrive_data[0];
            retrive_orderProduct[0].orders_id = orderIdString;
            retrive_orderProduct[0].coupon_code = coupon_code;
            //email
            // await email_services.cancel_requested_to_seller(seller_detail[0],retrive_orderProduct[0],user_detail[0],product_detail[0]);
            let html_template1 = "../../public/views/orderReturn.hbs";
            yield email_services.cancel_requested_to_customer(user_detail[0], retrive_orderProduct[0], product_detail[0], html_template1);
            let html_template2 = "../../public/views/orderReturnRecieve.hbs";
            yield email_services.cancel_requested_to_customer(user_detail[0], retrive_orderProduct[0], product_detail[0], html_template2);
            return {
                message: "Order Cancelled Sucessfully"
            };
            // }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
cancel_order_module.seller_fcms = (seller_id) => __awaiter(void 0, void 0, void 0, function* () {
    let projection = { __v: 0 };
    let options = { lean: true };
    let query = { seller_id: { $in: mongoose_1.default.Types.ObjectId(seller_id) }, fcm_token: { $nin: [null, ''] } };
    let get_seller = yield DAO.get_data(models_1.Sessions, query, projection, options);
    let fcm_arr = [];
    if (get_seller && get_seller.length) {
        for (let i = 0; i < get_seller.length; i++) {
            let { fcm_token } = get_seller[i];
            fcm_arr.push(fcm_token);
        }
    }
    return fcm_arr;
});
cancel_order_module.customer_fcms = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    let projection = { __v: 0 };
    let options = { lean: true };
    let query = { user_id: { $in: mongoose_1.default.Types.ObjectId(user_id) }, fcm_token: { $nin: [null, ''] } };
    let get_user = yield DAO.get_data(models_1.Sessions, query, projection, options);
    let fcm_arr = [];
    if (get_user && get_user.length) {
        for (let i = 0; i < get_user.length; i++) {
            let { fcm_token } = get_user[i];
            fcm_arr.push(fcm_token);
        }
    }
    return fcm_arr;
});
cancel_order_module.create_refund = (payment_intent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let refund = yield stripe.refunds.create({
            payment_intent: payment_intent,
        });
        return refund.id;
    }
    catch (err) {
        throw err;
    }
});
cancel_order_module.cancelRequest = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: order_id, } = req.body;
        let { _id: user_id } = req.user_data;
        let query = { _id: order_id, user_id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(models_1.OrderProducts, query, projection, options);
        if (retrive_data.length) {
            let { _id, product_id, quantity, previous_status, seller_id } = retrive_data[0];
            let retrive_product = yield DAO.get_data(models_1.Products, { _id: product_id }, projection, { lean: true });
            let { images } = retrive_product[0];
            console.log("images cancelled 1 ----------------- ", retrive_product[0]);
            console.log("images cancelled 2 ----------------- ", images);
            // if (!!refund_id) {
            //     throw await handle_custom_error("ORDER_ALREADY_CANCELLED", "ENGLISH")
            // }
            // else {
            // let retrive_refund_id = await this.create_refund(payment_intent)
            let query = { _id: _id };
            let data_to_update = {
                cancel_requested: false,
                order_status: previous_status,
                previous_status: null,
                updated_at: +new Date(),
            };
            let options = { new: true };
            yield DAO.find_and_update(models_1.OrderProducts, query, data_to_update, options);
            // await this.update_order_product_cancellation_request(_id);
            yield _d.dec_product_quantity(product_id, quantity);
            //email to seller 
            let seller_detail = yield DAO.get_data(models_1.Sellers, { _id: seller_id }, projection, options);
            //email to user
            let user_detail = yield DAO.get_data(models_1.Users, { _id: user_id }, projection, options);
            //notification to seller
            let seller_fcm_ids = yield _d.seller_fcms(seller_id);
            if (seller_fcm_ids && seller_fcm_ids.length) {
                let notification_to_seller = {
                    type: "REQUEST_CANCELLED",
                    title: "Cancelled Request",
                    message: "Cancellation request for an order is cancelled",
                    seller_id: seller_id,
                    orderProduct_id: _id,
                    product_id: product_id,
                    created_at: +new Date(),
                };
                yield DAO.save_data(models_1.Notifications, notification_to_seller);
                yield (0, index_2.send_notification_to_all)(notification_to_seller, seller_fcm_ids);
            }
            //notification to customer
            let customer_fcm_ids = yield _d.customer_fcms(user_id);
            if (customer_fcm_ids && customer_fcm_ids.length) {
                let notification_to_customer = {
                    type: "REQUESTED_CANCELLED",
                    title: "Order Cancelled Request",
                    message: "Your order cancelled request is cancelled by you",
                    user_id: user_id,
                    orderProduct_id: _id,
                    images: images,
                    product_id: product_id,
                    created_at: +new Date(),
                };
                yield DAO.save_data(models_1.Notifications, notification_to_customer);
                yield (0, index_2.send_notification_to_all)(notification_to_customer, customer_fcm_ids);
            }
            return {
                message: "Order Retained Sucessfully"
            };
            // }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
//old
cancel_order_module.cancelRequest1 = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: order_id, } = req.body;
        let { _id: user_id } = req.user_data;
        let query = { _id: order_id, user_id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(models_1.Orders, query, projection, options);
        if (retrive_data.length) {
            let { _id, stripe_data: { payment_intent, refund_id }, previous_status } = retrive_data[0];
            // if (!!refund_id) {
            //     throw await handle_custom_error("ORDER_ALREADY_CANCELLED", "ENGLISH")
            // }
            // else {
            // let retrive_refund_id = await this.create_refund(payment_intent)
            let query = { _id: _id };
            let data_to_update = {
                cancel_requested: false,
                updated_at: +new Date(),
            };
            let options = { new: true };
            yield DAO.find_and_update(models_1.Orders, query, data_to_update, options);
            yield _d.update_order_product_cancellation_request(_id);
            return {
                message: "Order Retained Sucessfully"
            };
            // }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
cancel_order_module.update_order_products = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { order_id: order_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(models_1.OrderProducts, query, projection, options);
        if (retrive_data.length) {
            for (let i = 0; i < retrive_data.length; i++) {
                let { _id, product_id, quantity, order_status } = retrive_data[i];
                let query = { _id: _id };
                let data_to_update = {
                    previous_status: order_status,
                    order_status: "PENDING_CANCELLATION",
                    updated_at: +new Date(),
                };
                let options = { new: true };
                yield DAO.find_and_update(models_1.OrderProducts, query, data_to_update, options);
                yield _d.inc_product_quantity(product_id, quantity);
            }
        }
    }
    catch (err) {
        throw err;
    }
});
cancel_order_module.update_order_product_cancellation_request = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let query = { order_id: order_id }
        let query = { _id: order_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(models_1.OrderProducts, query, projection, options);
        if (retrive_data.length) {
            for (let i = 0; i < retrive_data.length; i++) {
                let { _id, product_id, quantity, previous_status } = retrive_data[i];
                let query = { _id: _id };
                let data_to_update = {
                    order_status: previous_status,
                    previous_status: null,
                    updated_at: +new Date(),
                };
                let options = { new: true };
                yield DAO.find_and_update(models_1.OrderProducts, query, data_to_update, options);
                yield _d.dec_product_quantity(product_id, quantity);
            }
        }
    }
    catch (err) {
        throw err;
    }
});
cancel_order_module.dec_product_quantity = (product_id, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: product_id };
        let update = {
            $inc: {
                quantity: -Number(quantity)
            }
        };
        let options = { new: true };
        yield DAO.find_and_update(models_1.Products, query, update, options);
        let response = yield DAO.get_data(models_1.Products, query, { __v: 0 }, { lean: true });
        if (response) {
            let update_stock = {};
            let stock_value = response[0].quantity != 0 ? false : true;
            update_stock.sold = stock_value;
            yield DAO.find_and_update(models_1.Products, query, update_stock, options);
        }
    }
    catch (err) {
        console.log("err...case3...", err);
        throw err;
    }
});
cancel_order_module.inc_product_quantity = (product_id, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("product_id...", product_id);
        let query = { _id: product_id };
        let update = {
            $inc: {
                quantity: Number(quantity)
            },
            updated_at: +new Date()
        };
        let options = { new: true };
        yield DAO.find_and_update(models_1.Products, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
