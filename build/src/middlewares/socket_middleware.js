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
Object.defineProperty(exports, "__esModule", { value: true });
const gen_token_1 = require("./gen_token");
const index_1 = require("../config/index");
const DAO = __importStar(require("../DAO"));
const Models = __importStar(require("../models"));
const { scope } = index_1.app_constant;
const admin_scope = scope.admin;
const user_scope = scope.user;
const socket_authenticator = (socket, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('  in   ^^^^^^^^^^^^^^^^^^^^     socket >>>>>....socket_authenticator');
        let token = socket.handshake.headers.token;
        console.log(` token >>...>>>>>>>......  `, token);
        let fetch_token_data = yield (0, gen_token_1.verify_token)(token, user_scope, 'ENGLISH');
        if (fetch_token_data) {
            let { _id, user_id, access_token, device_type, fcm_token, token_gen_at } = fetch_token_data;
            console.log(`user_id >>. in socket middle token  >>..=== `, user_id, `_id >....`, _id);
            let query = { _id: user_id };
            let projection = { __v: 0 };
            let options = { lean: true };
            let fetch_data = yield DAO.get_data(Models.Users, query, projection, options);
            if (fetch_data.length > 0) {
                fetch_data[0].access_token = access_token;
                fetch_data[0].device_type = device_type;
                fetch_data[0].fcm_token = fcm_token;
                fetch_data[0].token_gen_at = token_gen_at;
                socket.user_data = fetch_data[0];
                // console.log(` fetch_data[0] ` , fetch_data[0]);
                next();
            }
            else {
                socket.emit("invalid_token", {
                    success: false,
                    error: "invalid_token",
                    error_description: "Invalid access token"
                });
            }
        }
        else {
            socket.emit("invalid_token", {
                success: false,
                error: "invalid_token",
                error_description: "Invalid access token"
            });
        }
    }
    catch (err) {
        console.log(` err in socket authenticaor  >>.. `, err);
        throw err;
    }
});
exports.default = socket_authenticator;
