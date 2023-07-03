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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancel_order_module = exports.order_module = void 0;
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const index_1 = require("../../middlewares/index");
const list_orders = __importStar(require("./list_orders"));
const order_details = __importStar(require("./order_details"));
const moment_1 = __importDefault(require("moment"));
const stripe_1 = __importDefault(require("stripe"));
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options = { apiVersion: "2020-08-27" };
const stripe = new stripe_1.default(STRIPE_KEY, stripe_options);
const index_2 = require("../../middlewares/index");
const common_1 = require("../../middlewares/common");
const email_services = __importStar(require("./email_seller"));
class order_module {
}
exports.order_module = order_module;
_a = order_module;
order_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let query = [
            yield list_orders.match(seller_id),
            yield list_orders.lookup_sellers(),
            yield list_orders.unwind_sellers(),
            yield list_orders.lookup_users(),
            yield list_orders.unwind_users(),
            yield list_orders.lookup_products(),
            yield list_orders.unwind_products(),
            yield list_orders.lookup_order(),
            yield list_orders.unwind_orders(),
            yield list_orders.group_data(),
            yield list_orders.filter_data(req.query),
            yield list_orders.sort_order_data(),
            yield list_orders.skip_data(req.query),
            yield list_orders.limit_data(req.query),
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(Models.OrderProducts, query, options);
        let query_count = [
            yield list_orders.match(seller_id),
            yield list_orders.lookup_sellers(),
            yield list_orders.unwind_sellers(),
            yield list_orders.lookup_users(),
            yield list_orders.unwind_users(),
            yield list_orders.lookup_products(),
            yield list_orders.unwind_products(),
            yield list_orders.lookup_order(),
            yield list_orders.unwind_orders(),
            yield list_orders.group_data(),
            yield list_orders.filter_data(req.query),
        ];
        let orders_count = yield DAO.aggregate_data(Models.OrderProducts, query_count, options);
        let response = {
            total_count: orders_count.length,
            data: orders,
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
order_module.details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params, { _id: seller_id } = req.user_data;
        let query = [
            yield order_details.match(_id, seller_id),
            yield order_details.lookup_order(),
            yield order_details.unwind_orders(),
            yield order_details.lookup_sellers(),
            yield order_details.unwind_sellers(),
            yield order_details.lookup_users(),
            yield order_details.unwind_users(),
            // await order_details.lookup_address(),
            // await order_details.unwind_address(),
            yield order_details.lookup_products(),
            yield order_details.unwind_products(),
            yield order_details.lookup_order_invoice(_id),
            // await order_details.lookup_reviews(),
            yield order_details.unwind_invoice(),
            yield order_details.group_data(),
            yield order_details.sort_data(),
            yield order_details.skip_data(req.query),
            yield order_details.limit_data(req.query),
        ];
        let options = { lean: true };
        let response = yield DAO.aggregate_data(Models.OrderProducts, query, options);
        if (response.length) {
            return response[0];
        }
        else {
            yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
order_module.order_status = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, order_status, tracking_link } = req.body;
        let options = { lean: true };
        let projection = { __v: 0 };
        let update;
        let query = { _id: _id, order_status: { $in: ["PLACED", "SHIPPED"] } };
        let get_orders = yield DAO.get_data(Models.OrderProducts, query, projection, options);
        if (get_orders) {
            let { product_id, seller_id, user_id } = get_orders[0];
            let retrive_product = yield DAO.get_data(Models.Products, { _id: product_id }, projection, { lean: true });
            let { images } = retrive_product[0];
            let notification_to_seller, notification_to_customer;
            if (!!order_status) {
                update = { order_status: order_status };
                //DELIVERED
                if (order_status == "DELIVERED") {
                    update.delivery_date = +new Date();
                    notification_to_seller = {
                        type: "ORDER_DELIVERED",
                        title: "Order Delivered",
                        message: "Order delivery sucess",
                        seller_id: seller_id,
                        orderProduct_id: _id,
                        product_id: product_id,
                        created_at: +new Date(),
                    };
                    notification_to_customer = {
                        type: "DELIVERED",
                        title: "Order Delivered",
                        message: "Your order has been delivered",
                        user_id: user_id,
                        orderProduct_id: _id,
                        images: images,
                        product_id: product_id,
                        created_at: +new Date(),
                    };
                }
                else if (order_status == "SHIPPED") {
                    update.shipped_at = +new Date();
                    notification_to_seller = {
                        type: "ORDER_SHIPPED",
                        title: "Order SHIPPED",
                        message: "Order shipped sucess",
                        seller_id: seller_id,
                        orderProduct_id: _id,
                        product_id: product_id,
                        created_at: +new Date(),
                    };
                    notification_to_customer = {
                        type: "SHIPPED",
                        title: "Order SHIPPED",
                        message: "Your order has been shipped successfully",
                        user_id: user_id,
                        orderProduct_id: _id,
                        images: images,
                        product_id: product_id,
                        created_at: +new Date(),
                    };
                }
            }
            if (!!tracking_link) {
                update.tracking_link = tracking_link;
            }
            update.updated_at = +new Date(),
                yield DAO.find_and_update(Models.OrderProducts, query, update, { new: true });
            let response = yield DAO.get_data(Models.OrderProducts, { _id: _id }, projection, options);
            let { order_id: orderId } = response[0];
            let order = yield DAO.get_data(Models.Orders, { _id: orderId }, projection, options);
            let { order_id, coupon_code } = order[0];
            response[0].orders_id = order_id;
            response[0].coupon_code = coupon_code;
            // console.log('response -- ', response)
            //notification to seller
            let seller_fcm_ids = yield common_1.common_module.seller_fcms(seller_id);
            if (seller_fcm_ids && seller_fcm_ids.length) {
                yield DAO.save_data(Models.Notifications, notification_to_seller);
                yield (0, index_2.send_notification_to_all)(notification_to_seller, seller_fcm_ids);
            }
            //notification to customer
            let customer_fcm_ids = yield common_1.common_module.customer_fcms(user_id);
            if (customer_fcm_ids && customer_fcm_ids.length) {
                yield DAO.save_data(Models.Notifications, notification_to_customer);
                yield (0, index_2.send_notification_to_all)(notification_to_customer, customer_fcm_ids);
            }
            let notification_admin = {
                type: "ORDER_CANCELLED_BY_SELLER",
                title: "Order Delivered",
                message: "Order has been delivered",
                //   user_id: user_id,
                order_id: _id,
                created_at: +new Date(),
            };
            yield common_1.common_module.send_notification_to_admin(notification_admin);
            //email to seller 
            let seller_detail = yield DAO.get_data(Models.Sellers, { _id: seller_id }, projection, options);
            //email to user
            let user_detail = yield DAO.get_data(Models.Users, { _id: user_id }, projection, options);
            if (order_status == 'SHIPPED') {
                yield email_services.send_shipped_mail(user_detail[0], response, retrive_product, seller_detail[0]);
            }
            else if (order_status == 'DELIVERED') {
                yield email_services.send_delivery_mail(user_detail[0], response, retrive_product, seller_detail[0]);
            }
            return response;
        }
        else {
            throw "You cann't change the status of this order";
        }
    }
    catch (err) {
        throw err;
    }
});
order_module.invoice_details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params, { _id: seller_id } = req.user_data;
        let query = [
            yield order_details.match(_id, seller_id),
            yield order_details.lookup_order(),
            yield order_details.unwind_orders(),
            yield order_details.lookup_sellers(),
            yield order_details.unwind_sellers(),
            yield order_details.lookup_users(),
            yield order_details.unwind_users(),
            yield order_details.lookup_address(),
            yield order_details.unwind_address(),
            yield order_details.lookup_product_invoice(),
            yield order_details.unwind_products(),
            yield order_details.lookup_order_invoice(_id),
            yield order_details.unwind_invoice(),
            yield order_details.group_invoice_data(),
            yield order_details.sort_data(),
            yield order_details.skip_data(req.query),
            yield order_details.limit_data(req.query),
        ];
        let options = { lean: true };
        let response = yield DAO.aggregate_data(Models.OrderProducts, query, options);
        if (response.length) {
            return response[0];
        }
        else {
            yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
order_module.list_transactions = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let query = [
            yield list_orders.match_transactions(seller_id),
            yield list_orders.lookup_sellers(),
            yield list_orders.unwind_sellers(),
            yield list_orders.lookup_users(),
            yield list_orders.unwind_users(),
            yield list_orders.lookup_products(),
            yield list_orders.unwind_products(),
            yield list_orders.lookup_order(),
            yield list_orders.unwind_orders(),
            yield list_orders.lookup_card(),
            yield list_orders.unwind_card(),
            yield list_orders.group_transactions_data(),
            yield list_orders.filter_transaction_data(req.query),
            yield list_orders.sort_data(),
            yield list_orders.skip_data(req.query),
            yield list_orders.limit_data(req.query),
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(Models.OrderProducts, query, options);
        let query_count = [
            yield list_orders.match_transactions(seller_id),
            yield list_orders.lookup_sellers(),
            yield list_orders.unwind_sellers(),
            yield list_orders.lookup_users(),
            yield list_orders.unwind_users(),
            yield list_orders.lookup_products(),
            yield list_orders.unwind_products(),
            yield list_orders.lookup_order(),
            yield list_orders.unwind_orders(),
            yield list_orders.group_transactions_data(),
            yield list_orders.filter_transaction_data(req.query),
        ];
        let orders_count = yield DAO.aggregate_data(Models.OrderProducts, query_count, options);
        let response = {
            total_count: orders_count.length,
            data: orders,
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
order_module.list_order_reviews = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let query = [
            yield list_orders.match(seller_id),
            // await list_orders.lookup_order(),
            // await list_orders.unwind_orders(),
            // await list_orders.lookup_order_product(),
            // await list_orders.unwind_ordered_product(),
            yield list_orders.lookup_users(),
            yield list_orders.unwind_users(),
            yield list_orders.lookup_sellers(),
            yield list_orders.unwind_sellers(),
            yield list_orders.lookup_review_products(seller_id),
            yield list_orders.unwind_products(),
            // await list_orders.lookup_ordered_products(seller_id),
            // await list_orders.unwind_ordered_products(),
            // await list_orders.lookup_order(),
            // await list_orders.unwind_orders(),
            yield list_orders.group_orders_review_data(),
            yield list_orders.filter_review_order_data(req.query),
            yield list_orders.sort_order_data(),
            // await list_orders.skip_data(req.query),
            // await list_orders.limit_data(req.query),
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(Models.Reviews, query, options);
        let query_count = [
            yield list_orders.match(seller_id),
            yield list_orders.lookup_users(),
            yield list_orders.unwind_users(),
            yield list_orders.lookup_review_products(seller_id),
            yield list_orders.unwind_review_products(),
            yield list_orders.lookup_order(),
            yield list_orders.unwind_orders(),
            yield list_orders.group_orders_review_data(),
            yield list_orders.filter_review_order_data(req.query),
        ];
        let orders_count = yield DAO.aggregate_data(Models.Reviews, query_count, options);
        let response = {
            total_count: orders_count.length,
            data: orders,
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
order_module.listNotifications = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pagination, limit } = req.query;
        let { _id: seller_id } = req.user_data;
        let query = { seller_id: seller_id, clear_for_seller: false, read_by_seller: false };
        let options = yield index_1.helpers.set_options(pagination, limit);
        // let projection = {  __v: 0 }
        let projection = { seller_id: 1, clear_for_seller: 1, read_by_seller: 1, type: 1, title: 1, message: 1, order_id: 1, orderProduct_id: 1, created_at: 1 };
        let unread_notifications = yield DAO.get_data(Models.Notifications, query, projection, options);
        let query2 = { seller_id: seller_id, clear_for_seller: false, read_by_seller: true };
        let read_notifications = yield DAO.get_data(Models.Notifications, query2, projection, options);
        //count of new unread
        let query_unread = { seller_id: seller_id, read_by_seller: false, clear_for_seller: false };
        let unread_count = yield DAO.count_data(Models.Notifications, query_unread);
        //updating view new to previous
        // await DAO.update_many(Models.Notifications,query,{ previous_seller:true })
        return {
            unread_count: unread_count,
            read_notifications: read_notifications,
            unread_notifications: unread_notifications
        };
    }
    catch (err) {
        throw err;
    }
});
order_module.markReadNotifications = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language } = req.query;
        let { _id: seller_id } = req.user_data;
        let qury = { seller_id: seller_id, read_by_seller: false };
        let options = { lean: true };
        let projection = { __v: 0 };
        let update = {
            read_by_seller: true,
        };
        let resp = yield DAO.get_data(Models.Notifications, qury, projection, options);
        if (resp && resp.length) {
            for (let i = 0; i < resp.length; i++) {
                let query1 = { _id: resp[i]._id };
                yield DAO.find_and_update(Models.Notifications, query1, update, options);
            }
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
order_module.clearNotifications = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language } = req.query;
        let { _id: seller_id } = req.user_data;
        let qury = { seller_id: seller_id, clear_for_seller: false };
        let options = { lean: true };
        let projection = { __v: 0 };
        let update = {
            clear_for_seller: true
        };
        let resp = yield DAO.get_data(Models.Notifications, qury, projection, options);
        if (resp && resp.length) {
            for (let i = 0; i < resp.length; i++) {
                let query1 = { _id: resp[i]._id };
                yield DAO.find_and_update(Models.Notifications, query1, update, options);
            }
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
order_module.ReadNotification = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('read ---- notification --- ', req.params);
        let { _id, language } = req.params;
        let { _id: seller_id } = req.user_data;
        let query = { _id: _id, seller_id: seller_id };
        console.log('query --- ', query);
        let options = { new: true };
        let projection = { __v: 0 };
        let update = {
            read_by_seller: true
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
//sending shipping mails to seller to mark order status
order_module.ordersDelivery = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = { lean: true };
        let projection = { __v: 0 };
        let current_date = +new Date();
        let query = { order_status: 'PLACED', };
        let get_data = yield DAO.get_data(Models.OrderProducts, query, projection, options);
        if (get_data && get_data.length) {
            for (let i = 0; i < get_data.length; i++) {
                let { _id, order_id, created_at, seller_id, product_order_id } = get_data[i];
                let dateAfterTwoDays = (0, moment_1.default)(parseInt(created_at)).add(2, "day").format('x');
                if (current_date >= dateAfterTwoDays) {
                    //current date is greater or eq to order created date of order
                    //send mail to seller to view and marked the order to shipped
                    let seller_detail = yield DAO.get_data(Models.Sellers, { _id: seller_id }, projection, options);
                    let order_product_detail = yield DAO.get_data(Models.OrderProducts, { _id: _id }, projection, options);
                    let order_detail = yield DAO.get_data(Models.Orders, { _id: order_id }, projection, options);
                    console.log('inside -- sending mail');
                    email_services.send_pending_shipped_mail(seller_detail[0], order_detail[0]);
                }
            }
        }
        let data = { message: "Order Shipped Mail Sent to Seller" };
        return data;
    }
    catch (err) {
        throw err;
    }
});
class cancel_order_module {
}
exports.cancel_order_module = cancel_order_module;
_b = cancel_order_module;
cancel_order_module.cancel = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: orderPId, order_id, cancellation_reason, description } = req.body;
        let { _id: user_id } = req.user_data;
        let cancel_reason = cancellation_reason == undefined ? "ORDER_CANCELLED_BY_SELLER" : cancellation_reason;
        let query = { _id: order_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(Models.Orders, query, projection, options);
        let retrive_OrderProduct = yield DAO.get_data(Models.OrderProducts, { _id: orderPId }, projection, options);
        if (retrive_data.length) {
            console.log("STRIPE 1---------- ", retrive_data[0]);
            let { _id, order_id, stripe_data: { payment_intent }, coupon_code } = retrive_data[0];
            // console.log('STRIPE 1---------- ', retrive_data[0].stripe_data)
            // console.log("STRIPE 2---------- ", payment_intent);
            let { total_price, product_id, quantity, refund_id, seller_id, user_id } = retrive_OrderProduct[0];
            let retrive_product = yield DAO.get_data(Models.Products, { _id: product_id }, projection, { lean: true });
            let { images } = retrive_product[0];
            console.log("images cancelled 1 ----------------- ", retrive_product[0]);
            console.log("images cancelled 2 ----------------- ", images);
            if (!!refund_id) {
                throw yield (0, index_1.handle_custom_error)("ORDER_ALREADY_CANCELLED", "ENGLISH");
            }
            else {
                let retrive_refund_id = yield _b.create_refund(payment_intent, total_price);
                console.log('refund  ------ done ------ ');
                let query1 = { _id: orderPId };
                let data_to_update = {
                    cancelled_by: "BY_SELLER",
                    description: description,
                    order_status: "CANCELLED",
                    cancellation_reason: cancel_reason,
                    payment_status: "REFUNDED",
                    // "stripe_data.refund_id": retrive_refund_id,
                    refund_id: retrive_refund_id,
                    updated_at: +new Date(),
                };
                let options = { new: true };
                yield DAO.find_and_update(Models.OrderProducts, query1, data_to_update, { new: true });
                let orderP_detail = yield DAO.get_data(Models.OrderProducts, query1, projection, options);
                console.log("ORder Product_detail ----- ", orderP_detail);
                console.log("ORder-- order_id--coupon_code ----- ", order_id, coupon_code);
                // console.log("ORder Product_detail ----- ",  orderP_detail[0].order_id = order_id);
                orderP_detail[0].orders_id = order_id;
                if (coupon_code != null) {
                    orderP_detail[0].coupon_code = coupon_code;
                }
                else {
                    orderP_detail[0].coupon_code = null;
                }
                // await this.update_order_products(_id);
                yield _b.inc_product_quantity(product_id, quantity);
                //notification to seller
                let seller_fcm_ids = yield common_1.common_module.seller_fcms(seller_id);
                if (seller_fcm_ids && seller_fcm_ids.length) {
                    let notification_to_seller = {
                        type: "ORDER_CANCELLED",
                        title: "Order Cancelled",
                        message: "Order cancelled by you",
                        seller_id: seller_id,
                        orderProduct_id: _id,
                        product_id: product_id,
                        created_at: +new Date(),
                    };
                    yield DAO.save_data(Models.Notifications, notification_to_seller);
                    yield (0, index_2.send_notification_to_all)(notification_to_seller, seller_fcm_ids);
                }
                //notification to customer
                let customer_fcm_ids = yield common_1.common_module.customer_fcms(user_id);
                if (customer_fcm_ids && customer_fcm_ids.length) {
                    let notification_to_customer = {
                        type: "CANCELLED_ORDER",
                        title: "Order Cancel",
                        message: "Your order has been cancelled",
                        user_id: user_id,
                        orderProduct_id: _id,
                        product_id: product_id,
                        images: images,
                        created_at: +new Date(),
                    };
                    yield DAO.save_data(Models.Notifications, notification_to_customer);
                    yield (0, index_2.send_notification_to_all)(notification_to_customer, customer_fcm_ids);
                }
                //notification to admin
                let notification_admin = {
                    type: "ORDER_CANCELLED_BY_SELLER",
                    title: "Order Cancel",
                    message: "Order has been cancelled by Seller",
                    order_id: _id,
                    product_id: product_id,
                    created_at: +new Date(),
                };
                yield common_1.common_module.send_notification_to_admin(notification_admin);
                //email 
                let seller_detail = yield DAO.get_data(Models.Sellers, { _id: seller_id }, projection, options);
                let user_detail = yield DAO.get_data(Models.Users, { _id: user_id }, projection, options);
                yield email_services.send_cancel_mail(user_detail[0], orderP_detail, retrive_product, seller_detail[0]);
                yield email_services.send_refund_mail(user_detail[0], orderP_detail, retrive_product, seller_detail[0]);
                return {
                    message: "Order Cancelled Sucessfully",
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
cancel_order_module.cancel1 = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: order_id, cancellation_reason, description } = req.body;
        let { _id: user_id } = req.user_data;
        let cancel_reason = cancellation_reason == undefined ? "ORDER_CANCELLED_BY_SELLER" : cancellation_reason;
        let query = { _id: order_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(Models.Orders, query, projection, options);
        if (retrive_data.length) {
            let { _id, stripe_data: { payment_intent, refund_id }, } = retrive_data[0];
            if (!!refund_id) {
                throw yield (0, index_1.handle_custom_error)("ORDER_ALREADY_CANCELLED", "ENGLISH");
            }
            else {
                let total = 500;
                // let retrive_refund_id = await this.create_refund(payment_intent);
                let retrive_refund_id = yield _b.create_refund(payment_intent, total);
                let query = { _id: _id };
                let data_to_update = {
                    cancelled_by: "BY_SELLER",
                    description: description,
                    cancellation_reason: cancel_reason,
                    "stripe_data.refund_id": retrive_refund_id,
                    updated_at: +new Date(),
                };
                let options = { new: true };
                yield DAO.find_and_update(Models.Orders, query, data_to_update, options);
                yield _b.update_order_products(_id);
                return {
                    message: "Order Cancelled Sucessfully",
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
cancel_order_module.approve_cancellation_request = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.body;
        let { _id: user_id } = req.user_data;
        let query = { _id: _id };
        console.log("query ", query);
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(Models.OrderProducts, query, projection, options);
        if (retrive_data.length) {
            let { _id, order_id, total_price, product_id, quantity, refund_id, user_id, seller_id } = retrive_data[0];
            let retrive_order = yield DAO.get_data(Models.Orders, { _id: order_id }, projection, options);
            let retrive_product = yield DAO.get_data(Models.Products, { _id: product_id }, projection, { lean: true });
            let { images } = retrive_product[0];
            console.log("images cancelled 1 ----------------- ", retrive_product[0]);
            console.log("images cancelled 2 ----------------- ", images);
            let { order_id: orderIdString, coupon_code, stripe_data: { payment_intent }, } = retrive_order[0];
            if (!!refund_id) {
                throw yield (0, index_1.handle_custom_error)("ORDER_ALREADY_CANCELLED", "ENGLISH");
            }
            else {
                let retrive_refund_id = yield _b.create_refund(payment_intent, total_price);
                let query = { _id: _id };
                let data_to_update = {
                    payment_status: "REFUND_IN_PROGRESS",
                    cancel_request_accepted: true,
                    order_status: "CANCELLED",
                    refund_id: retrive_refund_id,
                    updated_at: +new Date(),
                };
                let options = { new: true };
                yield DAO.find_and_update(Models.OrderProducts, query, data_to_update, { new: true });
                let response = yield DAO.get_data(Models.OrderProducts, query, data_to_update, options);
                response[0].orders_id = orderIdString;
                response[0].coupon_code = coupon_code;
                // await this.update_order_products(_id);
                yield _b.inc_product_quantity(product_id, quantity);
                //notification to seller
                let seller_fcm_ids = yield common_1.common_module.seller_fcms(seller_id);
                if (seller_fcm_ids && seller_fcm_ids.length) {
                    let notification_to_seller = {
                        type: "CANCELLED",
                        title: "Order Cancelled",
                        message: "Order cancelled request approved by you",
                        seller_id: seller_id,
                        orderProduct_id: _id,
                        product_id: product_id,
                        created_at: +new Date(),
                    };
                    yield DAO.save_data(Models.Notifications, notification_to_seller);
                    yield (0, index_2.send_notification_to_all)(notification_to_seller, seller_fcm_ids);
                }
                //notification to customer
                let customer_fcm_ids = yield common_1.common_module.customer_fcms(user_id);
                if (customer_fcm_ids && customer_fcm_ids.length) {
                    let notification_to_customer = {
                        type: "CANCELLED",
                        title: "Order Cancel",
                        message: "Your order cancellation request has been approved, you'll get refund in 4-5 days.",
                        user_id: user_id,
                        orderProduct_id: _id,
                        images: images,
                        product_id: product_id,
                        created_at: +new Date(),
                    };
                    yield DAO.save_data(Models.Notifications, notification_to_customer);
                    yield (0, index_2.send_notification_to_all)(notification_to_customer, customer_fcm_ids);
                    let notification_to_admin = {
                        type: "CANCELLED",
                        title: "Order Cancel",
                        message: "Your order cancellation request has been approved successfully",
                        orderProduct_id: _id,
                        product_id: product_id,
                        created_at: +new Date(),
                    };
                    yield common_1.common_module.send_notification_to_admin(notification_to_admin);
                }
                //email 
                let seller_detail = yield DAO.get_data(Models.Sellers, { _id: seller_id }, projection, options);
                let user_detail = yield DAO.get_data(Models.Users, { _id: user_id }, projection, options);
                yield email_services.send_cancel_mail(user_detail[0], response, retrive_product, seller_detail[0]);
                return {
                    message: "Order Cancelled Sucessfully",
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
cancel_order_module.cancellation_request1 = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: order_id } = req.body;
        let { _id: user_id } = req.user_data;
        let query = { _id: order_id };
        console.log("query ", query);
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(Models.Orders, query, projection, options);
        if (retrive_data.length) {
            let { _id, stripe_data: { payment_intent, refund_id }, } = retrive_data[0];
            if (!!refund_id) {
                throw yield (0, index_1.handle_custom_error)("ORDER_ALREADY_CANCELLED", "ENGLISH");
            }
            else {
                // let retrive_refund_id = await this.create_refund(payment_intent);
                let total_price = 500;
                let retrive_refund_id = yield _b.create_refund(payment_intent, total_price);
                let query = { _id: _id };
                let data_to_update = {
                    order_status: "PENDING_CANCELLATION",
                    payment_status: "REFUND_IN_PROGRESS",
                    cancel_request_accepted: true,
                    "stripe_data.refund_id": retrive_refund_id,
                    updated_at: +new Date(),
                };
                let options = { new: true };
                yield DAO.find_and_update(Models.Orders, query, data_to_update, options);
                yield _b.update_order_products(_id);
                return {
                    message: "Order Cancelled Sucessfully",
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
cancel_order_module.create_refund = (payment_intent, amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let refund = yield stripe.refunds.create({
            payment_intent: payment_intent,
            amount: parseInt(amount.toFixed(2) * 100 + ""),
        });
        return refund.id;
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
        let retrive_data = yield DAO.get_data(Models.OrderProducts, query, projection, options);
        if (retrive_data.length) {
            for (let i = 0; i < retrive_data.length; i++) {
                let { _id, product_id, quantity } = retrive_data[i];
                let query = { _id: _id };
                let data_to_update = {
                    order_status: "CANCELLED",
                    delivery_status: "CANCELLED",
                    updated_at: +new Date(),
                };
                let options = { new: true };
                yield DAO.find_and_update(Models.OrderProducts, query, data_to_update, options);
                yield _b.inc_product_quantity(product_id, quantity);
            }
        }
    }
    catch (err) {
        throw err;
    }
});
cancel_order_module.inc_product_quantity = (product_id, quantity) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("product_id...", product_id)
        let query = { _id: product_id };
        let update = {
            $inc: {
                quantity: Number(quantity),
            },
            updated_at: +new Date(),
        };
        let options = { new: true };
        yield DAO.find_and_update(Models.Products, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
