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
exports.phone_verification_success_mail = exports.edit_profile_mail = exports.forgot_password_mail = exports.resend_otp_mail = exports.send_welcome_mail = void 0;
const path_1 = __importDefault(require("path"));
const send_email_1 = __importDefault(require("../../middlewares/send_email"));
const fs_1 = __importDefault(require("fs"));
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
// import resend from '../../email_templates/email_verification.html'
const send_welcome_mail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, otp, name } = data;
        let admin_address = yield DAO.get_data(Models.Admin, { super_admin: true }, { full_address: 1 }, { lean: true });
        let subject = 'Welcome to HenceForth!';
        let file_path = path_1.default.join(__dirname, '../../email_templates/welcomeVerifyEmail.html');
        let html = yield fs_1.default.readFileSync(file_path, { encoding: 'utf-8' });
        html = html.replace('%USER_NAME%', name);
        html = html.replace('%OTP%', otp);
        html = html.replace('%ADMIN_ADDRESS%', admin_address[0].full_address);
        yield (0, send_email_1.default)(email, subject, html);
    }
    catch (err) {
    }
});
exports.send_welcome_mail = send_welcome_mail;
const resend_otp_mail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, otp, name } = data;
        let admin_address = yield DAO.get_data(Models.Admin, { super_admin: true }, { full_address: 1 }, { lean: true });
        let subject = 'Resend OTP';
        let file_path = path_1.default.join(__dirname, '../../email_templates/resend_otp.html');
        let html = yield fs_1.default.readFileSync(file_path, { encoding: 'utf-8' });
        html = html.replace('%USER_NAME%', name);
        html = html.replace('%OTP%', otp);
        html = html.replace("%ADMIN_ADDRESS%", admin_address[0].full_address);
        yield (0, send_email_1.default)(email, subject, html);
    }
    catch (err) {
        throw err;
    }
});
exports.resend_otp_mail = resend_otp_mail;
const phone_verification_success_mail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, otp, name } = data;
        let subject = 'Resend OTP';
        let file_path = path_1.default.join(__dirname, '../../email_templates/phone_veri_success.html');
        let html = yield fs_1.default.readFileSync(file_path, { encoding: 'utf-8' });
        html = html.replace('%USER_NAME%', name);
        html = html.replace('%OTP%', otp);
        yield (0, send_email_1.default)(email, subject, html);
    }
    catch (err) {
        throw err;
    }
});
exports.phone_verification_success_mail = phone_verification_success_mail;
const edit_profile_mail = (email, otp, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let subject = 'Resend OTP';
        let file_path = path_1.default.join(__dirname, '../../email_templates/resend_otp.html');
        let html = yield fs_1.default.readFileSync(file_path, { encoding: 'utf-8' });
        html = html.replace('%USER_NAME%', name);
        html = html.replace('%OTP%', otp);
        yield (0, send_email_1.default)(email, subject, html);
    }
    catch (err) {
        throw err;
    }
});
exports.edit_profile_mail = edit_profile_mail;
// const forgot_password_mail = async (data: any) => {
//     try {
//         let { email, fp_otp, name } = data
//         let subject = 'Forgot Password OTP';
//         let file_path = path.join(__dirname, '../../email_templates/reset_password_otp.html');
//         let html = await fs.readFileSync(file_path, { encoding: 'utf-8' })
//         html = html.replace('%USER_NAME%', name)
//         html = html.replace('%UNIQUE_CODE%', fp_otp)
//         // console.log("FORGOTOTP: ", forgot_otp)
//         await send_email(email, subject, html)
//     }
//     catch (err) {
//         throw err;
//     }
// }
const forgot_password_mail = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, fp_otp, name, unique_code } = data;
        let admin_address = yield DAO.get_data(Models.Admin, { super_admin: true }, { full_address: 1 }, { lean: true });
        let forgot_link = `https://sharedecommerce.henceforthsolutions.com/password/reset-password?unique_code=${unique_code}&email=${email}`;
        let subject = 'Forgot Password mail';
        let file_path = path_1.default.join(__dirname, '../../email_templates/forgottpsw.html');
        let html = yield fs_1.default.readFileSync(file_path, { encoding: 'utf-8' });
        html = html.replace('%USER_NAME%', name);
        html = html.replace('%OTP%', fp_otp);
        html = html.replace("%ADMIN_ADDRESS%", admin_address[0].full_address);
        html = html.replace("%FORGOT_LINK%", forgot_link);
        yield (0, send_email_1.default)(email, subject, html);
    }
    catch (err) {
        throw err;
    }
});
exports.forgot_password_mail = forgot_password_mail;
