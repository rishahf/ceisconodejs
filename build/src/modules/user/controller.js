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
const search_module_1 = __importDefault(require("./search_module"));
const listing_module_1 = __importDefault(require("./listing_module"));
const cart_module_1 = __importDefault(require("./cart_module"));
const profile_module_1 = __importDefault(require("./profile_module"));
const faq_like_module_1 = __importDefault(require("./faq_like_module"));
class controller {
}
exports.default = controller;
_a = controller;
// forgot password
controller.forgot_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield profile_module_1.default.forogot_password(req);
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
// resend forgot passwordotp
controller.resend_fp_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield profile_module_1.default.resend_fp_otp(req);
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
// verify_fp_otp
controller.verify_fp_otp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield profile_module_1.default.verify_fp_otp(req);
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
// set_new_password
controller.set_new_password = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield profile_module_1.default.set_new_password(req);
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
// search module
controller.search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield search_module_1.default.search(req);
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
controller.categories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield listing_module_1.default.categories(req);
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
// categories_details
controller.categories_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield listing_module_1.default.categories_details(req);
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
// list sub_categories
controller.sub_categories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield listing_module_1.default.sub_categories(req);
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
// sub_categories_details
controller.sub_categories_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield listing_module_1.default.sub_categories_details(req);
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
// list sub_subcategories
controller.sub_subcategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield listing_module_1.default.sub_subcategories(req);
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
// sub_subcategories_details
controller.sub_subcategories_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield listing_module_1.default.sub_subcategories_details(req);
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
controller.brands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield listing_module_1.default.brands(req);
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
// brand details
controller.brands_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield listing_module_1.default.brands_details(req);
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
// nested_data
controller.nested = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield listing_module_1.default.nested_data(req);
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
// add_to_cart
controller.add_to_cart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield cart_module_1.default.add(req);
        // let message = "Success";
        let message = {
            title: "Item added",
            desc: "Item added to cart",
        };
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
// edit cart
controller.edit_cart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield cart_module_1.default.edit(req);
        // let message = "Success";
        let message = {
            title: "Cart item edited",
            desc: "Item edited successfully",
        };
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
// list cart
controller.list_cart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield cart_module_1.default.list(req);
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
// remove from cart
controller.remove_from_cart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield cart_module_1.default.delete(req);
        // let message = "Success";
        let message = {
            title: "Item removed",
            desc: "Item removed from cart"
        };
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
// price_details
controller.price_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield cart_module_1.default.price_details(req);
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
// like dislike module faqlike_module
controller.faq_like_dislike = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield faq_like_module_1.default.like_dislike(req);
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
// static faq_like = async (req: Request, res: Response) => {
//     try {
//         let response = await faqlike_module.like(req)
//         let message = "Success";
//         res.send({
//             success: true,
//             message: message,
//             data: response
//         });
//     }
//     catch (err) {
//         handle_catch(res, err);
//     }
// }
// static faq_dislike = async (req: Request, res: Response) => {
//     try {
//         let response = await faqlike_module.dislike(req)
//         let message = "Success";
//         res.send({
//             success: true,
//             message: message,
//             data: response
//         });
//     }
//     catch (err) {
//         handle_catch(res, err);
//     }
// }
controller.list_faqs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield faq_like_module_1.default.list(req);
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
//
controller.searchDeliveryLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield search_module_1.default.searchLocation(req);
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
