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
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_smtp_transport_1 = __importDefault(require("nodemailer-smtp-transport"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const nodemailer_email = process.env.NODEMAILER_MAIL;
const nodemailer_password = process.env.NODEMAILER_PASSWORD;
// const nodemailer_email = 'manpreet.henceforth@gmail.com'
// const nodemailer_password = 'Manpreet@123'
const transporter = nodemailer_1.default.createTransport((0, nodemailer_smtp_transport_1.default)({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
        user: nodemailer_email,
        pass: nodemailer_password
    }
}));
// const templateOptions={
//     viewEngine:{
//         partialDir: path.resolve('../../email_templates/'),
//         defaultLayout: false
//     },
//     viewPath: path.resolve('../../email_templates/')
// }
// transporter.use('compile',templateOptions)
const send_email = (to, subject, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let mailOptions = {
            from: nodemailer_email,
            to: to,
            subject: subject,
            html: body,
            // text: 'That was easy!'
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent: ' + info.response);
            }
        });
    }
    catch (err) {
        throw err;
    }
});
exports.default = send_email;
