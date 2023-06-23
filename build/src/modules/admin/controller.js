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
const coupon_module_1 = __importDefault(require("./coupon_module"));
const admin_module_1 = require("./admin_module");
const product_module_1 = require("./product_module");
const order_module_1 = require("./order_module");
class controller {
}
exports.default = controller;
_a = controller;
// add a category
controller.add_a_category = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.category.add(req);
        (0, index_1.handle_success)(res, response);
        // let message = "Success";
        // res.send({
        //     success: true,
        //     message: message,
        //     data: response
        // });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// edit a category
controller.edit_a_category = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.category.edit(req);
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
// list categories
controller.list_categories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.category.list(req);
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
controller.get_category = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.category.category(req);
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
// add a sub_category
controller.add_a_subcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.sub_category.add(req);
        (0, index_1.handle_success)(res, response);
        // let message = "Success";
        // res.send({
        //     success: true,
        //     message: message,
        //     data: response
        // });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// edit a subcategory
controller.edit_a_subcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.sub_category.edit(req);
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
// list subcategory
controller.list_subcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.sub_category.list(req);
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
// list subcategory
controller.get_subcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.sub_category.subcategory(req);
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
// add a sub sub_category
controller.add_a_sub_subcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.sub_sub_category.add(req);
        (0, index_1.handle_success)(res, response);
        // let message = "Success";
        // res.send({
        //     success: true,
        //     message: message,
        //     data: response
        // });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// edit a sub subcategory
controller.edit_a_sub_subcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.sub_sub_category.edit(req);
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
// list sub subcategory
controller.list_sub_subcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.sub_sub_category.list(req);
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
controller.get_sub_subcategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.sub_sub_category.sub_subcategory(req);
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
// add a brand
controller.add_a_brand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.brand.add(req);
        (0, index_1.handle_success)(res, response);
        // let message = "Success";
        // res.send({
        //     success: true,
        //     message: message,
        //     data: response
        // });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// edit a brand
controller.edit_a_brand = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.brand.edit(req);
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
// list brands
controller.list_brands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.brand.list(req);
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
controller.get_brands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.brand.brands(req);
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
        let response = yield coupon_module_1.default.add(req);
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
        let response = yield coupon_module_1.default.edit(req);
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
        let response = yield coupon_module_1.default.list(req);
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
        let response = yield coupon_module_1.default.details(req);
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
        let response = yield coupon_module_1.default.delete(req);
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
//homepagecoupon
controller.set_homepage_coupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield coupon_module_1.default.homepage_coupon(req);
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
// fees_module
controller.add_fees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.fees_module.add(req);
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
controller.edit_fees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.fees_module.edit(req);
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
controller.list_fees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield admin_module_1.fees_module.list(req);
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
// product_list_module
controller.product_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_module_1.product_list_module.details(req);
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
// details
controller.user_orders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.user_orders(req);
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
// reviews
controller.list_orders_reviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.list_orderReviews(req);
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
controller.invoice_data = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield order_module_1.order_module.invoiceData(req);
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
        let response = yield order_module_1.order_module.order_products_details(req);
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
