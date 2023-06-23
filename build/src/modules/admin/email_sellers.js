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
exports.send_welcome_mail = void 0;
const path_1 = __importDefault(require("path"));
const send_email_1 = __importDefault(require("../../middlewares/send_email"));
const fs_1 = __importDefault(require("fs"));
// import resend from '../../email_templates/email_welcome_seller.html'
const send_welcome_mail = (data, seller_password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, name } = data;
        let subject = 'Welcome to HenceForth!';
        let file_path = path_1.default.join(__dirname, '../../email_templates/email_welcome_seller.html');
        let html = yield fs_1.default.readFileSync(file_path, { encoding: 'utf-8' });
        html = html.replace('%SELLER_NAME%', name);
        html = html.replace('%EMAIL%', email);
        html = html.replace('%PASSWORD%', seller_password);
        yield (0, send_email_1.default)(email, subject, html);
    }
    catch (err) {
        throw err;
    }
});
exports.send_welcome_mail = send_welcome_mail;
