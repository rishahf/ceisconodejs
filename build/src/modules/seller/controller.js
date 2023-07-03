"use strict";
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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../middlewares/index");
const product_module_1 = require("./product_module");
const product_details_1 = __importDefault(require("./product_details"));
const product_services_1 = __importDefault(require("./product_services"));
const product_highlights_1 = __importDefault(require("./product_highlights"));
const product_variations_1 = __importDefault(require("./product_variations"));
const product_faqs_1 = __importDefault(require("./product_faqs"));
const product_delivery_locations_1 = __importDefault(require("./product_delivery_locations"));
const coupons_1 = __importDefault(require("./coupons"));
const dashboard_1 = __importDefault(require("./dashboard"));
const product_graph_1 = __importDefault(require("./product_graph"));
const sales_graph_1 = __importDefault(require("./sales_graph"));
const order_module_1 = require("./order_module");
class controller {
}
exports.default = controller;
_a = controller;
// dashboard
controller.dashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield dashboard_1.default.count(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// product graph
controller.product_graph = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_graph_1.default.retrive_graph(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// sales graph
controller.sales_graph = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield sales_graph_1.default.retrive_graph(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// add or edit a product
controller.add_a_product = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_module_1.product_add_module.add_a_product(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// add or edit a product
controller.edit_a_product = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_module_1.product_edit_module.edit_a_product(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// list a product
controller.list_product = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_module_1.product_list_module.list(req);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// list a product details
controller.list_product_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("req ", req);
        let response = yield product_module_1.product_list_module.details(req);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// add product_details
controller.add_product_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_details_1.default.add(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// edit product details
controller.edit_product_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_details_1.default.edit(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// list product details
controller.list_p_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_details_1.default.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// delete a product details
controller.delete_product_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_details_1.default.delete(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// add product_services
controller.add_product_services = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_services_1.default.add(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// edit product services
controller.edit_product_services = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_services_1.default.edit(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// list product services
controller.list_product_services = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_services_1.default.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// delete a product services
controller.delete_product_services = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_services_1.default.delete(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// add product highlights
controller.add_product_highlights = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_highlights_1.default.add(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// edit product highlights
controller.edit_product_highlights = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_highlights_1.default.edit(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// list product highlights
controller.list_product_highlights = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_highlights_1.default.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// delete a product highlights
controller.delete_product_highlights = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_highlights_1.default.delete(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// add product variations
controller.add_pv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_variations_1.default.add(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// edit product variations
controller.edit_pv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_variations_1.default.edit(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// list product variations
controller.list_pv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_variations_1.default.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// delete a product variation
controller.delete_pv = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_variations_1.default.delete(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
//
controller.list_product_variants_to_add = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_variations_1.default.list_variants_to_add(req);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// add product faq module
controller.add_product_faq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_faqs_1.default.add(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// edit product_faq
controller.edit_product_faq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_faqs_1.default.edit(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// list product_faq
controller.list_product_faq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_faqs_1.default.faq_list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// delete a product_faq
controller.delete_product_faq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_faqs_1.default.delete(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
//add delivery location
controller.add_delivery_location = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_delivery_locations_1.default.add(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
//edit deliver location
controller.edit_delivery_location = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_delivery_locations_1.default.edit(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
//list delivery location
controller.list_delivery_location = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_delivery_locations_1.default.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// delete a product_faq
controller.delete_delivery_location = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_delivery_locations_1.default.delete(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// add a coupon_module
controller.add_a_coupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield coupons_1.default.add(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// edit a coupon
controller.edit_a_coupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield coupons_1.default.edit(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// list coupon
controller.list_coupons = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield coupons_1.default.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// list coupon details
controller.list_coupon_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield coupons_1.default.details(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// delete_a_coupon
controller.delete_a_coupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield coupons_1.default.delete(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// list orders
controller.list_orders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// details
controller.order_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.details(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.order_status_change = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.order_status(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
//order invoice
controller.order_invoice_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.invoice_details(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// cancel_order
controller.cancel_order = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.cancel_order_module.cancel(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.approve_cancel_request = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.cancel_order_module.approve_cancellation_request(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.list_orders_transactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.list_transactions(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.list_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.listNotifications(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.mark_read_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.markReadNotifications(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.clear_notifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.clearNotifications(req);
        console.log('res ', req.body);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.read_notification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.ReadNotification(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
//list order reviews
// list orders
controller.list_orders_reviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.list_order_reviews(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.checking_orders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.ordersDelivery();
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
