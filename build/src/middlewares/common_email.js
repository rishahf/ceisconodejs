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
Object.defineProperty(exports, "__esModule", { value: true });
exports.send_order_mail = exports.send_welcome_mail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_smtp_transport_1 = __importDefault(require("nodemailer-smtp-transport"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const handlebars_1 = __importDefault(require("handlebars"));
const nodemailer_email = process.env.NODEMAILER_MAIL;
const nodemailer_password = process.env.NODEMAILER_PASSWORD;
// const nodemailer_email = 'manpreet.henceforth@gmail.com'
// const nodemailer_password = 'Manpreet@123'
const transporter = nodemailer_1.default.createTransport((0, nodemailer_smtp_transport_1.default)({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
        user: nodemailer_email,
        pass: nodemailer_password,
    },
}));
const send_welcome_mail = (email, name, otp, subject, source, admin_address) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = handlebars_1.default.compile(source);
        const htmlToSend = template({
            // Data to be sent to template engine.
            subject: subject,
            name: name,
            admin_address: admin_address,
            otp: otp,
        });
        var mailOptions = {
            from: nodemailer_email,
            to: email,
            subject: subject,
            html: htmlToSend,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email sent: " + info.response);
            }
        });
    }
    catch (err) {
        console.log(err);
        // throw err;
    }
    return "success";
});
exports.send_welcome_mail = send_welcome_mail;
const send_order_mail = (email, subject, template) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const template = handlebars.compile(source);
        // const htmlToSend = template({
        //   subject: subject,
        //   name: name,
        //   admin_address: admin_address,
        //   // otp: otp,
        // });
        var mailOptions = {
            from: nodemailer_email,
            to: email,
            subject: subject,
            html: template,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log("Email sent: " + info.response);
            }
        });
    }
    catch (err) {
        console.log(err);
        // throw err;
    }
    return "success";
});
exports.send_order_mail = send_order_mail;
