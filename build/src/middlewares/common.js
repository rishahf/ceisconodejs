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
exports.common_module = void 0;
const DAO = __importStar(require("../DAO"));
const Models = __importStar(require("../models"));
const index_1 = require("../middlewares/index");
class common_module {
}
exports.common_module = common_module;
_a = common_module;
common_module.send_notification_to_admin = (notification_admin) => __awaiter(void 0, void 0, void 0, function* () {
    let { type, title, message, order_id } = notification_admin;
    let projection = { __v: 0 };
    let options = { lean: true };
    let query = { type: "ADMIN", fcm_token: { $nin: ["", null] } };
    let admin_data = yield DAO.get_data(Models.Sessions, query, projection, options);
    if (admin_data && admin_data.length) {
        let notification = {
            type: type,
            title: title,
            message: message,
            admin_id: admin_data[0].admin_id,
            order_id: order_id,
        };
        let admin_fcms = [];
        for (let i; i < admin_data.length; i++) {
            let { fcm_token } = admin_data[i];
            admin_fcms.push(fcm_token);
        }
        console.log('Notification --- to --- admin --- sent');
        yield DAO.save_data(Models.Notifications, notification);
        yield (0, index_1.send_notification_to_all)(notification, admin_fcms);
    }
    return admin_data;
});
common_module.get_user_detail = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    let projection = { __v: 0 };
    let options = { lean: true };
    // let query = { _id: mongoose.Types.ObjectId(user_id) };
    let query = { _id: user_id };
    let user_data = yield DAO.get_data(Models.Users, query, projection, options);
    return user_data[0];
});
common_module.get_seller_detail = (seller_id) => __awaiter(void 0, void 0, void 0, function* () {
    let projection = { __v: 0 };
    let options = { lean: true };
    // let query = { _id: mongoose.Types.ObjectId(seller_id) };
    let query = { _id: seller_id };
    let seller_data = yield DAO.get_data(Models.Sellers, query, projection, options);
    return seller_data[0];
});
common_module.customer_fcms_arr = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    let projection = { __v: 0 };
    let options = { lean: true };
    let query = {
        // user_id: { $in: mongoose.Types.ObjectId(user_id) },
        user_id: { $in: user_id },
        fcm_token: { $nin: [null, ""] },
    };
    let user_data = yield DAO.get_data(Models.Sessions, query, projection, options);
    let fcms_arr = [];
    if (user_data && user_data.length) {
        for (let i = 0; i < user_data.length; i++) {
            fcms_arr.push(user_data[i].fcm_token);
        }
    }
    return fcms_arr;
});
common_module.seller_fcms_arr = (seller_id) => __awaiter(void 0, void 0, void 0, function* () {
    let projection = { __v: 0 };
    let options = { lean: true };
    let query = {
        // seller_id: { $in: mongoose.Types.ObjectId(seller_id) },
        seller_id: { $in: seller_id }, fcm_token: { $nin: [null, ""] }
    };
    let user_data = yield DAO.get_data(Models.Sessions, query, projection, options);
    let fcms_arr = [];
    if (user_data && user_data.length) {
        for (let i = 0; i < user_data.length; i++) {
            fcms_arr.push(user_data[i].fcm_token);
        }
    }
    console.log('seller- fcm - arr -- 1---', fcms_arr);
    return fcms_arr;
});
common_module.seller_fcms = (seller_id) => __awaiter(void 0, void 0, void 0, function* () {
    let projection = { __v: 0 };
    let options = { lean: true };
    // let query = { seller_id: { $in: mongoose.Types.ObjectId(seller_id) }, fcm_token: {$nin: [null, '']} }
    let query = { seller_id: { $in: seller_id }, fcm_token: { $nin: [null, ''] } };
    let get_seller = yield DAO.get_data(Models.Sessions, query, projection, options);
    let fcm_arr = [];
    if (get_seller && get_seller.length) {
        for (let i = 0; i < get_seller.length; i++) {
            let { fcm_token } = get_seller[i];
            fcm_arr.push(fcm_token);
        }
    }
    return fcm_arr;
});
common_module.customer_fcms = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    let projection = { __v: 0 };
    let options = { lean: true };
    // let query = { user_id: { $in: mongoose.Types.ObjectId(user_id) }, fcm_token: {$nin: [null, '']} }
    let query = {
        user_id: { $in: user_id },
        fcm_token: { $nin: [null, ""] },
    };
    let get_user = yield DAO.get_data(Models.Sessions, query, projection, options);
    let fcm_arr = [];
    if (get_user && get_user.length) {
        for (let i = 0; i < get_user.length; i++) {
            let { fcm_token } = get_user[i];
            fcm_arr.push(fcm_token);
        }
    }
    return fcm_arr;
});
