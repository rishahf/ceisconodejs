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
const stripe_1 = __importDefault(require("stripe"));
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options = { apiVersion: '2020-08-27' };
const stripe = new stripe_1.default(STRIPE_KEY, stripe_options);
class order_module {
}
exports.order_module = order_module;
_a = order_module;
order_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = [
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
            //   await list_orders.filter_sorting(req.query),
            yield list_orders.sortOrder_data(req.query),
            yield list_orders.skip_data(req.query),
            yield list_orders.limit_data(req.query),
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(Models.OrderProducts, query, options);
        let query_count = [
            yield list_orders.lookup_sellers(),
            yield list_orders.unwind_sellers(),
            yield list_orders.lookup_users(),
            yield list_orders.unwind_users(),
            yield list_orders.lookup_products(),
            yield list_orders.unwind_products(),
            yield list_orders.lookup_order(),
            yield list_orders.unwind_orders(),
            yield list_orders.group_data(),
            yield list_orders.filter_data(req.query)
        ];
        let orders_count = yield DAO.aggregate_data(Models.OrderProducts, query_count, options);
        let response = {
            total_count: orders_count.length,
            data: orders
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
order_module.details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = [
            yield order_details.match(_id),
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
            yield order_details.lookup_order_reviews(),
            yield order_details.group_data(),
            yield order_details.sort_data(),
            yield order_details.skip_data(req.query),
            yield order_details.limit_data(req.query),
        ];
        let options = { lean: true };
        let response = yield DAO.aggregate_data(Models.OrderProducts, query, options);
        console.log('response ', response);
        if (response && response.length) {
            console.log('response[0].order_object_id', response[0].order_object_id);
            let { order_object_id } = response[0];
            let query_other = [
                yield order_details.match_order_id(order_object_id, _id),
                yield order_details.lookup_order(),
                yield order_details.unwind_orders(),
                yield order_details.lookup_product_order_item(),
                yield order_details.unwind_products(),
                yield order_details.lookup_users(),
                yield order_details.unwind_users(),
                yield order_details.lookup_sellers(),
                yield order_details.unwind_sellers(),
                yield order_details.group_order_items(),
            ];
            let other_order_items = yield DAO.aggregate_data(Models.OrderProducts, query_other, options);
            response[0].other_order_items = other_order_items;
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
order_module.user_orders = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: user_id } = req.query;
        let query = [
            yield list_orders.match(user_id),
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
            yield list_orders.sort_data(),
            yield list_orders.skip_data(req.query),
            yield list_orders.limit_data(req.query)
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(Models.OrderProducts, query, options);
        let query_count = [
            yield list_orders.match(user_id),
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
            data: orders
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
order_module.list_orderReviews = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = [
            //   await list_orders.lookup_order_review(),
            //   await list_orders.unwind_order_review(),
            //   await list_orders.lookup_order_product_review(),
            //   await list_orders.unwind_order_products(),
            yield list_orders.lookup_sellers(),
            yield list_orders.unwind_sellers(),
            yield list_orders.lookup_users(),
            yield list_orders.unwind_users(),
            yield list_orders.lookup_products_review(),
            yield list_orders.unwind_products(),
            yield list_orders.group_orderReview_data(),
            yield list_orders.filter_reviews_data(req.query),
            yield list_orders.sorting_data(req.query),
            yield list_orders.skip_data(req.query),
            yield list_orders.limit_data(req.query),
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(Models.Reviews, query, options);
        let query_count = [
            //   await list_orders.lookup_order_review(),
            //   await list_orders.unwind_order_review(),
            //   await list_orders.lookup_order_product_review(),
            //   await list_orders.unwind_order_products(),
            yield list_orders.lookup_sellers(),
            yield list_orders.unwind_sellers(),
            yield list_orders.lookup_users(),
            yield list_orders.unwind_users(),
            yield list_orders.lookup_products_review(),
            yield list_orders.unwind_products(),
            yield list_orders.group_orderReview_data(),
            yield list_orders.filter_reviews_data(req.query),
            //   await list_orders.sort_data(),
        ];
        let orders_count = yield DAO.aggregate_data(Models.Reviews, query_count, options);
        let response = {
            total_count: orders_count.length,
            data: orders
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
order_module.invoiceData = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, order_id, invoice_type } = req.query;
        let options = { lean: true };
        let query;
        let response;
        if (invoice_type == "SELLER") {
            query = [
                yield order_details.match(_id),
                yield order_details.lookup_order(),
                yield order_details.unwind_orders(),
                yield order_details.lookup_sellers(),
                yield order_details.unwind_sellers(),
                yield order_details.lookup_users(),
                yield order_details.unwind_users(),
                // await order_details.lookup_address(),
                // await order_details.unwind_address(),
                yield order_details.lookup_product_invoice(),
                yield order_details.unwind_products(),
                yield order_details.lookup_order_invoice(_id),
                yield order_details.unwind_invoice(),
                yield order_details.group_invoice_data(),
                yield order_details.sort_data(),
                yield order_details.skip_data(req.query),
                yield order_details.limit_data(req.query),
            ];
            response = yield DAO.aggregate_data(Models.OrderProducts, query, options);
            response[0].type = "SELLER";
        }
        else if (invoice_type == "USER") {
            query = [
                yield order_details.match(order_id),
                yield order_details.lookup_order_address(),
                yield order_details.unwind_address(),
                yield order_details.lookup_ordered_invoice(order_id),
            ];
            response = yield DAO.aggregate_data(Models.Orders, query, options);
            response[0].type = "USER";
        }
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
order_module.order_products_details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: order_id } = req.params, { _id: admin_id } = req.user_data;
        let query = [
            yield order_details.match_data(order_id, admin_id),
            yield order_details.lookup_ordered_products(),
            // await order_details.lookup_products(),
            // await order_details.unwind_products(),
            // await order_details.lookup_address(),
            // await order_details.unwind_address(),
            yield order_details.group_data1(),
            yield order_details.sort_data(),
        ];
        let options = { lean: true };
        let orders = yield DAO.aggregate_data(Models.Orders, query, options);
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
class cancel_order_module {
}
exports.cancel_order_module = cancel_order_module;
_b = cancel_order_module;
cancel_order_module.cancel = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: order_id } = req.body;
        let { _id: user_id } = req.user_data;
        let query = { _id: order_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(Models.Orders, query, projection, options);
        if (retrive_data.length) {
            let { _id, stripe_data: { payment_intent, refund_id } } = retrive_data[0];
            if (!!refund_id) {
                throw yield (0, index_1.handle_custom_error)("ORDER_ALREADY_CANCELLED", "ENGLISH");
            }
            else {
                let retrive_refund_id = yield _b.create_refund(payment_intent);
                let query = { _id: _id };
                let data_to_update = {
                    cancellation_reason: "ORDER_CANCELLED_BY_SELLER",
                    "stripe_data.refund_id": retrive_refund_id,
                    updated_at: +new Date()
                };
                let options = { new: true };
                yield DAO.find_and_update(Models.Orders, query, data_to_update, options);
                yield _b.update_order_products(_id);
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
                    // delivery_status : "CANCELLED",
                    updated_at: +new Date()
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
                quantity: Number(quantity)
            },
            updated_at: +new Date()
        };
        let options = { new: true };
        yield DAO.find_and_update(Models.Products, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
