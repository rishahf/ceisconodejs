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
exports.send_refund_mail = exports.send_cancel_mail = exports.send_delivery_mail = exports.send_shipped_mail = exports.send_pending_shipped_mail = exports.send_welcome_mail = void 0;
const path_1 = __importDefault(require("path"));
const email_services = __importStar(require("../../middlewares/common_email"));
const fs_1 = __importDefault(require("fs"));
const moment_1 = __importDefault(require("moment"));
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const hbs_1 = require("hbs");
// import resend from '../../email_templates/email_welcome_seller.html'
const send_welcome_mail = (data, seller_password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, name, email_otp } = data;
        let admin_address = yield DAO.get_data(Models.Admin, { super_admin: true }, { full_address: 1 }, { lean: true });
        let subject = 'Welcome to HenceForth!';
        // USING HANDLEBARS
        let file_path = path_1.default.join(__dirname, '../../public/views/welcomeVerifyEmail.hbs');
        let template = yield fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        yield email_services.send_welcome_mail(email, name, email_otp, subject, template, admin_address[0].full_address);
        //SIMPL RENDERING
        // let file_path = path.join(__dirname, '../../email_templates/welcomeVerifyEmail.html');
        // let html = await fs.readFileSync(file_path, { encoding: 'utf-8' })
        // html = html.replace('%USER_NAME%', name)
        // html = html.replace("%OTP%", email_otp);
        // html = html.replace('%ADMIN_ADDRESS%',admin_address[0].full_address)
        // await send_email(email,subject,html)
    }
    catch (err) {
        throw err;
    }
});
exports.send_welcome_mail = send_welcome_mail;
const send_pending_shipped_mail = (data, order_detail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, name, email_otp } = data;
        let { order_id } = order_detail;
        let subject = 'Pending Shipment!';
        let file_path = path_1.default.join(__dirname, '../../email_templates/pending_shipped_order.html');
        let html = yield fs_1.default.readFileSync(file_path, { encoding: 'utf-8' });
        html = html.replace('%SELLER_NAME%', name);
        html = html.replace('%ORDER_ID%', order_id);
        // html = html.replace('%PASSWORD%', seller_password)
        // html = html.replace("%OTP%", email_otp);
        // await send_email(email, subject, html)
    }
    catch (err) {
        throw err;
    }
});
exports.send_pending_shipped_mail = send_pending_shipped_mail;
const send_shipped_mail = (user_data, order_detail, product_detail, seller_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, name } = user_data;
        let { company } = seller_data;
        let { address_data: { full_address }, created_at, orders_id, coupon_code, tracking_link, discount_price, delivery_price, coupon_discount, total_price, shipped_at, quantity, updated_at } = order_detail[0];
        let { name: product_name, images, } = product_detail[0];
        let admin_address = yield DAO.get_data(Models.Admin, { super_admin: true }, { full_address: 1 }, { lean: true });
        let order_date = (0, moment_1.default)(parseInt(created_at)).utc().format("DD/MM/YYYY");
        let shipped_date = (0, moment_1.default)(parseInt(shipped_at)).utc().format("dddd DD/MM/YYYY");
        let shipped_time = (0, moment_1.default)(parseInt(shipped_at)).utc().format("HH:mm");
        //   let delivery_by: any = moment(parseInt(delivery_date)).utc().format("ddd, MMM DD, YYYY");
        let image = `${process.env.IMAGE_PATH}${images[0]}`;
        let subject = "Order shipped successfully";
        let file_path = path_1.default.join(__dirname, "../../public/views/orderShipped.hbs");
        let html = yield fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        const template = hbs_1.handlebars.compile(html);
        const htmlToSend = template({
            subject: subject,
            name: name,
            admin_address: admin_address[0].full_address,
            order_id: orders_id,
            order_date: order_date,
            user_address: full_address,
            user_email: email,
            coupon_code: coupon_code,
            discount_price: discount_price,
            product_name: product_name,
            image: image,
            tracking_link: tracking_link,
            shipped_date: shipped_date,
            shipped_time: shipped_time,
            delivery_price: delivery_price,
            coupon_discount: coupon_discount,
            paid_price: total_price,
            qty: quantity,
            seller_company: company
        });
        yield email_services.send_order_mail(email, subject, htmlToSend);
    }
    catch (err) {
        throw err;
    }
});
exports.send_shipped_mail = send_shipped_mail;
const send_delivery_mail = (user_data, order_detail, product_detail, seller_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let subject = "Order delivered successfully";
        let admin_address = yield DAO.get_data(Models.Admin, { super_admin: true }, { full_address: 1 }, { lean: true });
        let { email, name } = user_data;
        let { company } = seller_data;
        let { _id, address_data: { full_address }, created_at, orders_id, order_id: orderId, tracking_link, discount_price, delivery_price, delivery_date, coupon_discount, total_price, updated_at, quantity } = order_detail[0];
        let { name: product_name, images, } = product_detail[0];
        let order_date = (0, moment_1.default)(parseInt(created_at)).utc().format("DD/MM/YYYY");
        let delivered_date = (0, moment_1.default)(parseInt(delivery_date)).utc().format("dddd DD/MM/YYYY");
        let delivery_by = (0, moment_1.default)(parseInt(delivery_date)).utc().format("ddd, MMM DD, YYYY");
        let delivered_time = (0, moment_1.default)(parseInt(delivery_date)).utc().format("HH:mm");
        let image = `${process.env.IMAGE_PATH}${images[0]}`;
        let return_link = `https://sharedecommerce.henceforthsolutions.com/account/order/cancel/${orderId}/${_id}`;
        let file_path = path_1.default.join(__dirname, "../../public/views/orderDelivered.hbs");
        let html = yield fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        const template = hbs_1.handlebars.compile(html);
        const htmlToSend = template({
            subject: subject,
            user_name: name,
            admin_address: admin_address[0].full_address,
            order_id: orders_id,
            order_date: order_date,
            user_address: full_address,
            user_email: email,
            product_name: product_name,
            image: image,
            return_link: return_link,
            delivery_by: delivery_by,
            delivered_date: delivered_date,
            delivered_time: delivered_time,
            coupon_discount: coupon_discount,
            discount_price: discount_price,
            delivery_price: delivery_price,
            paid_price: total_price,
            qty: quantity,
            seller_company: company
        });
        yield email_services.send_order_mail(email, subject, htmlToSend);
    }
    catch (err) {
        throw err;
    }
});
exports.send_delivery_mail = send_delivery_mail;
const send_cancel_mail = (user_data, order_detail, product_detail, seller_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let subject = "Order cancelled successfully";
        let admin_address = yield DAO.get_data(Models.Admin, { super_admin: true }, { __v: 0 }, { lean: true });
        let { email, name } = user_data;
        let { company } = seller_data;
        let { name: product_name, images } = product_detail[0];
        let { _id, coupon_code, created_at, orders_id, discount_price, delivery_price, coupon_discount, total_price, cancelled_at, quantity } = order_detail[0];
        let image = `${process.env.IMAGE_PATH}${images[0]}`;
        let order_date = (0, moment_1.default)(parseInt(created_at)).utc().format("DD/MM/YYYY");
        let cancelled_date = (0, moment_1.default)(parseInt(cancelled_at)).utc().format("dddd DD/MM/YYYY");
        console.log("order-detail  ", order_detail);
        console.log("total -price ", total_price, ' order-date ', order_date);
        let file_path = path_1.default.join(__dirname, "../../public/views/orderCancel.hbs");
        let html = yield fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        const template = hbs_1.handlebars.compile(html);
        const htmlToSend = template({
            subject: subject,
            user_name: name,
            admin_address: admin_address[0].full_address,
            order_id: orders_id,
            order_date: order_date,
            // user_address: full_address,
            user_email: email,
            product_name: product_name,
            image: image,
            cancelled_date: cancelled_date,
            coupon_code: coupon_code,
            coupon_discount: coupon_discount,
            discount_price: discount_price,
            delivery_price: delivery_price,
            paid_price: total_price,
            qty: quantity,
            seller_company: company,
        });
        yield email_services.send_order_mail(email, subject, htmlToSend);
    }
    catch (err) {
        throw err;
    }
});
exports.send_cancel_mail = send_cancel_mail;
const send_refund_mail = (user_data, order_detail, product_detail, seller_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let subject = "Refund processed successfully";
        let admin_address = yield DAO.get_data(Models.Admin, { super_admin: true }, { __v: 0 }, { lean: true });
        let { email, name } = user_data;
        let { company } = seller_data;
        let { name: product_name, images } = product_detail[0];
        let { _id, coupon_code, created_at, orders_id, discount_price, delivery_price, coupon_discount, total_price, cancelled_at, quantity } = order_detail[0];
        let image = `${process.env.IMAGE_PATH}${images[0]}`;
        let order_date = (0, moment_1.default)(parseInt(created_at)).utc().format("DD/MM/YYYY");
        let cancelled_date = (0, moment_1.default)(parseInt(cancelled_at)).utc().format("dddd DD/MM/YYYY");
        let file_path = path_1.default.join(__dirname, "../../public/views/refundOnWay.hbs");
        let html = yield fs_1.default.readFileSync(file_path, { encoding: "utf-8" });
        const template = hbs_1.handlebars.compile(html);
        const htmlToSend = template({
            subject: subject,
            user_name: name,
            admin_address: admin_address[0].full_address,
            order_id: orders_id,
            order_date: order_date,
            // user_address: full_address,
            user_email: email,
            product_name: product_name,
            image: image,
            cancelled_date: cancelled_date,
            coupon_code: coupon_code,
            coupon_discount: coupon_discount,
            discount_price: discount_price,
            delivery_price: delivery_price,
            paid_price: total_price,
            qty: quantity,
            // seller_company: company,
        });
        yield email_services.send_order_mail(email, subject, htmlToSend);
    }
    catch (err) {
        throw err;
    }
});
exports.send_refund_mail = send_refund_mail;
