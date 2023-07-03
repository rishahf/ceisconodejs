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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("../../middlewares/index");
const order_module_2_1 = require("./order_module_2");
class controller {
}
exports.default = controller;
_a = controller;
// create order
controller.create_order = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_2_1.order_module.create(req);
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
// user list orders
controller.user_list_orders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_2_1.order_listing_module.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            total_count: response.total_count,
            data: response.data,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// order details
controller.order_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_2_1.order_listing_module.details(req);
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
controller.ordered_products_detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_2_1.order_listing_module.order_products_details(req);
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
controller.ordered_products_invoice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_2_1.order_listing_module.order_products_invoice_details(req);
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
        let response = yield order_module_2_1.cancel_order_module.cancel(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response.message,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// order cancel request
controller.cancel_cancellation_request = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_2_1.cancel_order_module.cancelRequest(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response.message,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// order payment status
controller.order_payment_status = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_2_1.order_listing_module.payment_status(req);
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
controller.check_coupon_availability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_2_1.order_module.check_coupon(req);
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
controller.check_delivery_availability = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_2_1.order_module.check_delivery(req);
        console.log('req.query 1 ', req.query);
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
