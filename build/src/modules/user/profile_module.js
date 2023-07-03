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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const email_services = __importStar(require("./email_services"));
const index_1 = require("../../middlewares/index");
class search_module {
}
exports.default = search_module;
_a = search_module;
search_module.verify_user_info = (query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        return fetch_data;
    }
    catch (err) {
        throw err;
    }
});
search_module.forogot_password = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, language } = req.body;
        let query_email = { email: email.toLowerCase() };
        let fetch_data = yield _a.verify_user_info(query_email);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            let unique_code = yield index_1.helpers.gen_unique_code(Models.Users);
            let fp_otp = yield index_1.helpers.generate_otp();
            let query = { _id: _id };
            let update = {
                unique_code: unique_code,
                fp_otp: fp_otp,
                fp_otp_verified: false
            };
            let options = { new: true };
            let update_data = yield DAO.find_and_update(Models.Users, query, update, options);
            yield email_services.forgot_password_mail(update_data);
            let response = {
                message: "Mail sent sucessfully",
                unique_code: unique_code
            };
            return response;
        }
        else {
            throw yield (0, index_1.handle_custom_error)("EMAIL_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        throw err;
    }
});
search_module.resend_fp_otp = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { unique_code, language } = req.body;
        let query = { unique_code: unique_code };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        if (fetch_data.length) {
            let { _id } = fetch_data[0];
            // let unique_code = await helpers.gen_unique_code(Models.Users);
            let fp_otp = yield index_1.helpers.generate_otp();
            let query = { _id: _id };
            let update = {
                // unique_code: unique_code,
                fp_otp: fp_otp,
                fp_otp_verified: false
            };
            let options = { new: true };
            let update_data = yield DAO.find_and_update(Models.Users, query, update, options);
            yield email_services.forgot_password_mail(update_data);
            let response = {
                message: "Mail sent sucessfully",
                unique_code: unique_code
            };
            return response;
        }
        else {
            throw yield (0, index_1.handle_custom_error)("EMAIL_NOT_REGISTERED", language);
        }
    }
    catch (err) {
        throw err;
    }
});
search_module.verify_fp_otp = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { unique_code, otp: input_otp, language } = req.body;
        let query = { unique_code: unique_code };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Users, query, projection, options);
        if (response.length) {
            let { _id, fp_otp } = response[0];
            if (input_otp != fp_otp) {
                throw yield (0, index_1.handle_custom_error)("WRONG_OTP", language);
            }
            else {
                let query = { _id: _id };
                let update = { fp_otp: 0, fp_otp_verified: true };
                let options = { new: true };
                yield DAO.find_and_update(Models.Users, query, update, options);
                return {
                    message: "OTP verified",
                    unique_code: unique_code
                };
            }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("WRONG_UNIQUE_CODE", language);
        }
    }
    catch (err) {
        throw err;
    }
});
search_module.set_new_password = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { password, unique_code, language } = req.body;
        let query = { unique_code: unique_code };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
        if (fetch_data.length) {
            let { _id, fp_otp_verified } = fetch_data[0];
            if (fp_otp_verified != true) {
                throw yield (0, index_1.handle_custom_error)("OTP_NOT_VERIFIED", language);
            }
            else {
                let bycryt_password = yield index_1.helpers.bcrypt_password(password);
                let query = { _id: _id };
                let update = {
                    password: bycryt_password,
                    unique_code: null,
                    fp_otp_verified: false
                };
                let options = { new: true };
                yield DAO.find_and_update(Models.Users, query, update, options);
                let message = "Password Changed Sucessfully";
                return message;
            }
        }
        else {
            throw yield (0, index_1.handle_custom_error)("WRONG_UNIQUE_CODE", language);
        }
    }
    catch (err) {
        throw err;
    }
});
