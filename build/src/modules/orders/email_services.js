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
exports.cancel_requested_to_seller = exports.cancel_requested_to_customer = exports.create_order_mail_to_seller = exports.create_order_mail_to_customer = void 0;
const path_1 = __importDefault(require("path"));
const send_email_1 = __importDefault(require("../../middlewares/send_email"));
const fs_1 = __importDefault(require("fs"));
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const hbs_1 = require("hbs");
const moment_1 = __importDefault(require("moment"));
const email_services = __importStar(require("../../middlewares/common_email"));
// import resend from '../../email_templates/email_verification.html'
const create_order_mail_to_customer = (user_data, order_detail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let subject = "Your order placed successfully!";
        let { email, name } = user_data;
        let admin_address = yield DAO.get_data(Models.Admin, { super_admin: true }, { __v: 0 }, { lean: true });
        let { orders_id, total_paid_amount, user_address, coupon_code, coupon_discount, sub_total, delivery_price, orders, created_at } = order_detail;
        let order_date = (0, moment_1.default)(parseInt(created_at)).utc().format("DD/MM/YYYY");
        let file_path = path_1.default.join(__dirname, "../../public/views/orderConfirmed.hbs");
        let html = yield fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        const template = hbs_1.handlebars.compile(html);
        const htmlToSend = template({
            // image_path:image_path,
            user_name: name,
            user_email: email,
            admin_address: admin_address[0].full_address,
            order_id: orders_id,
            order_date: order_date,
            total_paid_amount: total_paid_amount,
            coupon_code: coupon_code,
            coupon_discount: coupon_discount,
            delivery_price: delivery_price,
            sub_total: sub_total,
            user_address: user_address,
            orders: orders
        });
        yield (0, send_email_1.default)(email, subject, htmlToSend);
    }
    catch (err) {
        throw err;
    }
});
exports.create_order_mail_to_customer = create_order_mail_to_customer;
const create_order_mail_to_seller = (user_data, order_detail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, otp, name } = user_data;
        let subject = "Your have a new Order";
        let file_path = path_1.default.join(__dirname, "../../email_templates/order_placed.html");
        let html = yield fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        html = html.replace("%USER_NAME%", name);
        html = html.replace("%OTP%", order_detail);
        yield (0, send_email_1.default)(email, subject, html);
    }
    catch (err) {
        throw err;
    }
});
exports.create_order_mail_to_seller = create_order_mail_to_seller;
const cancel_requested_to_customer = (user_data, order_detail, product_detail, html_template) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let subject = "You requested for order cancellation";
        let admin_address = yield DAO.get_data(Models.Admin, { super_admin: true }, { full_address: 1 }, { lean: true });
        let { email, name } = user_data;
        let { name: product_name, images } = product_detail;
        let { orders_id, coupon_code, discount_price, delivery_price, coupon_discount, total_price, shipped_at, quantity, created_at } = order_detail;
        let order_date = (0, moment_1.default)(parseInt(created_at)).utc().format("DD/MM/YYYY");
        let image = `${process.env.IMAGE_PATH}${images[0]}`;
        let file_path = path_1.default.join(__dirname, html_template);
        let html = yield fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        const template = hbs_1.handlebars.compile(html);
        const htmlToSend = template({
            user_name: name,
            product_name: product_name,
            order_id: orders_id,
            subject: subject,
            name: name,
            admin_address: admin_address[0].full_address,
            order_date: order_date,
            user_email: email,
            coupon_code: coupon_code,
            discount_price: discount_price,
            image: image,
            delivery_price: delivery_price,
            coupon_discount: coupon_discount,
            paid_price: total_price,
            qty: quantity,
        });
        yield email_services.send_order_mail(email, subject, htmlToSend);
    }
    catch (err) {
        throw err;
    }
});
exports.cancel_requested_to_customer = cancel_requested_to_customer;
const cancel_requested_to_seller = (seller_data, order_detail, customer_detail, product_detail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, otp, name: seller_name } = seller_data;
        let { email: user_email, name: user_name } = customer_detail;
        let { name: product_name } = product_detail;
        let { product_order_id } = order_detail;
        let subject = "Your have Order Cancalled Request";
        let file_path = path_1.default.join(__dirname, "../../email_templates/cancel_request_to_seller.html");
        let html = yield fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        html = html.replace("%SELLER_NAME%", seller_name);
        html = html.replace("%USER_NAME%", user_name);
        html = html.replace("%PRODUCT_NAME%", product_name);
        html = html.replace("%ORDPRODUCT_ID%", product_order_id);
        html = html.replace("%OTP%", order_detail);
        yield (0, send_email_1.default)(email, subject, html);
    }
    catch (err) {
        throw err;
    }
});
exports.cancel_requested_to_seller = cancel_requested_to_seller;
const cancel_requested_to_customer_simple = (user_data, order_detail, product_detail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, otp, name } = user_data;
        let { name: product_name } = product_detail;
        let { product_order_id } = order_detail;
        let subject = "You requested for order cancellation";
        let file_path = path_1.default.join(__dirname, "../../email_templates/order_placed.html");
        let html = yield fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        html = html.replace("%USER_NAME%", name);
        html = html.replace("%PRODUCT_NAME%", product_name);
        html = html.replace("%ORDPRODUCT_ID%", product_order_id);
        html = html.replace("%OTP%", order_detail);
        yield (0, send_email_1.default)(email, subject, html);
    }
    catch (err) {
        throw err;
    }
});
const create_order_mail_to_customer1 = (user_data, order_detail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, name } = user_data;
        let admin_address = yield DAO.get_data(Models.Admin, { super_admin: true }, { full_address: 1 }, { lean: true });
        let subject = "Your order placed successfully!";
        let file_path = path_1.default.join(__dirname, "../../email_templates/orderconfirmed.html");
        let html = yield fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        html = html.replace("%USER_NAME%", name);
        html = html.replace("%OTP%", order_detail);
        html = html.replace("%ADMIN_ADDRESS%", admin_address[0].full_address);
        yield (0, send_email_1.default)(email, subject, html);
    }
    catch (err) {
        throw err;
    }
});
