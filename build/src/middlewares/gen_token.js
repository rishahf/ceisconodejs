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
exports.verify_token = exports.decode_token = exports.generate_token = void 0;
const DAO = __importStar(require("../DAO"));
const Models = __importStar(require("../models"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const index_1 = require("../config/index");
const index_2 = require("./index");
const { seckret_keys } = index_1.app_constant;
const options = { algorithm: "HS256" };
const admin_seckret_key = seckret_keys.admin_seckret_key;
const user_seckret_key = seckret_keys.user_seckret_key;
const seller_seckret_key = seckret_keys.seller_seckret_key;
// STEP 1 : GENERATE TOKEN
const generate_token = (token_data) => {
    return new Promise((resolve, reject) => {
        try {
            let seckret_key = null;
            if (token_data.scope == "admin") {
                seckret_key = admin_seckret_key;
            }
            if (token_data.scope == "user") {
                seckret_key = user_seckret_key;
            }
            if (token_data.scope == "seller") {
                seckret_key = seller_seckret_key;
            }
            const token = jsonwebtoken_1.default.sign(token_data, seckret_key);
            return resolve(token);
        }
        catch (err) {
            throw reject(err);
        }
    });
};
exports.generate_token = generate_token;
const decode_token = (token, type, language) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let set_seckret_key = null;
            if (type == "admin") {
                set_seckret_key = admin_seckret_key;
            }
            else if (type == "user") {
                set_seckret_key = user_seckret_key;
            }
            else if (type == "seller") {
                set_seckret_key = seller_seckret_key;
            }
            let fetch_error = yield (0, index_2.handle_custom_error)('UNAUTHORIZED', language);
            jsonwebtoken_1.default.verify(token, set_seckret_key, (err, decoded) => {
                if (decoded == undefined) {
                    return reject(fetch_error);
                }
                else {
                    return resolve(decoded);
                }
            });
        }
        catch (err) {
            let fetch_error = yield (0, index_2.handle_custom_error)('UNAUTHORIZED', language);
            throw reject(fetch_error);
        }
    }));
};
exports.decode_token = decode_token;
// STEP 2 : VERIFY TOKEN
const verify_token = (token, type, language) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let decoded = yield decode_token(token, type, language);
        let fetch_data;
        if (decoded.scope == "admin") {
            let query = {
                admin_id: decoded._id,
                access_token: { $ne: null },
                token_gen_at: decoded.token_gen_at
            };
            let projection = { __v: 0 };
            let options = { lean: true };
            fetch_data = yield DAO.get_data(Models.Sessions, query, projection, options);
        }
        if (decoded.scope == "user") {
            let query = {
                user_id: decoded._id,
                access_token: { $ne: null },
                token_gen_at: decoded.token_gen_at
            };
            let projection = { __v: 0 };
            let options = { lean: true };
            fetch_data = yield DAO.get_data(Models.Sessions, query, projection, options);
        }
        if (decoded.scope == "seller") {
            let query = {
                seller_id: decoded._id,
                access_token: { $ne: null },
                token_gen_at: decoded.token_gen_at
            };
            let projection = { __v: 0 };
            let options = { lean: true };
            fetch_data = yield DAO.get_data(Models.Sessions, query, projection, options);
        }
        if (fetch_data.length) {
            return fetch_data[0];
        }
        else {
            let fetch_error = yield (0, index_2.handle_custom_error)('UNAUTHORIZED', language);
            throw fetch_error;
        }
    }
    catch (err) {
        let fetch_error = yield (0, index_2.handle_custom_error)('UNAUTHORIZED', language);
        throw fetch_error;
    }
});
exports.verify_token = verify_token;
