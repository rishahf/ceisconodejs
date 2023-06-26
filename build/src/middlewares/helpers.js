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
exports.generate_invoice_id = exports.generate_tax_no = exports.genrate_product_id = exports.genrate_product_order_id = exports.generate_phone_otp = exports.genrate_coupon_code = exports.genrate_order_id = exports.decrypt_password = exports.bcrypt_password = exports.gen_unique_code = exports.generate_otp = exports.set_options = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const DAO = __importStar(require("../DAO"));
const Models = __importStar(require("../models/index"));
const randomstring_1 = __importDefault(require("randomstring"));
const index_1 = require("../config/index");
const default_limit = index_1.app_constant.default_limit;
const salt_rounds = index_1.app_constant.salt_rounds;
const set_options = (pagination, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = {
            lean: true,
            sort: { _id: -1 }
        };
        if (pagination == undefined && typeof limit != undefined) {
            options = {
                lean: true,
                limit: parseInt(limit),
                sort: { _id: -1 }
            };
        }
        else if (typeof pagination != undefined && limit == undefined) {
            options = {
                lean: true,
                skip: parseInt(pagination) * default_limit,
                limit: default_limit,
                sort: { _id: -1 }
            };
        }
        else if (typeof pagination != undefined && typeof limit != undefined) {
            options = {
                lean: true,
                skip: parseInt(pagination) * parseInt(limit),
                limit: parseInt(limit),
                sort: { _id: -1 }
            };
        }
        return options;
    }
    catch (err) {
        throw err;
    }
});
exports.set_options = set_options;
const generate_otp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = {
            length: 4,
            charset: '123456789'
        };
        let code = randomstring_1.default.generate(options);
        return code;
    }
    catch (err) {
        throw err;
    }
});
exports.generate_otp = generate_otp;
const generate_phone_otp = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = {
            length: 4,
            charset: '123456789'
        };
        let code = randomstring_1.default.generate(options);
        return 1234;
    }
    catch (err) {
        throw err;
    }
});
exports.generate_phone_otp = generate_phone_otp;
const gen_unique_code = (collection) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = {
            length: 7,
            charset: 'alphanumeric'
        };
        let random_value = randomstring_1.default.generate(options);
        // fetch users count
        let total_users = yield DAO.count_data(collection, {});
        let inc_value = Number(total_users) + 1;
        // unique code
        let unique_code = `${random_value}${inc_value}`;
        return unique_code;
    }
    catch (err) {
        throw err;
    }
});
exports.gen_unique_code = gen_unique_code;
const bcrypt_password = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hash = yield bcrypt_1.default.hashSync(password, salt_rounds);
        return hash;
    }
    catch (err) {
        throw err;
    }
});
exports.bcrypt_password = bcrypt_password;
const decrypt_password = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decryt = yield bcrypt_1.default.compareSync(password, hash);
        return decryt;
    }
    catch (err) {
        throw err;
    }
});
exports.decrypt_password = decrypt_password;
const genrate_order_id = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let static_value = 'ORDER';
        let options = {
            length: 4,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        };
        let random_value = randomstring_1.default.generate(options);
        // fetch ORDERS count
        let count_orders = yield DAO.count_data(Models.Orders, {});
        let unique_id = Number(count_orders) + 1;
        let order_id = `${static_value}${random_value}${unique_id}`;
        return order_id;
    }
    catch (err) {
        throw err;
    }
});
exports.genrate_order_id = genrate_order_id;
const genrate_product_order_id = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let static_value = 'ORDPROD';
        let options = {
            length: 4,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        };
        let random_value = randomstring_1.default.generate(options);
        // fetch ORDERS count
        let count_orders = yield DAO.count_data(Models.OrderProducts, {});
        let unique_id = Number(count_orders) + 1;
        let order_id = `${static_value}${random_value}${unique_id}`;
        return order_id;
    }
    catch (err) {
        throw err;
    }
});
exports.genrate_product_order_id = genrate_product_order_id;
const genrate_product_id = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let static_value = "PRODU";
        let options = {
            length: 4,
            charset: "alphanumeric",
            capitalization: "uppercase",
        };
        let random_value = randomstring_1.default.generate(options);
        // fetch ORDERS count
        let count_orders = yield DAO.count_data(Models.Products, {});
        let unique_id = Number(count_orders) + 1;
        let order_id = `${static_value}${random_value}${unique_id}`;
        return order_id;
    }
    catch (err) {
        throw err;
    }
});
exports.genrate_product_id = genrate_product_id;
const genrate_coupon_code = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let static_value = 'COUP';
        let options = {
            length: 4,
            charset: 'alphanumeric',
            capitalization: 'uppercase'
        };
        let random_value = randomstring_1.default.generate(options);
        let count = yield DAO.count_data(Models.Coupons, {});
        let unique_id = Number(count) + 1;
        let coupon_code = `${static_value}${random_value}${unique_id}`;
        return coupon_code;
    }
    catch (err) {
        throw err;
    }
});
exports.genrate_coupon_code = genrate_coupon_code;
const generate_tax_no = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let static_value = "2022";
        let options = {
            length: 5,
            charset: "123456789",
        };
        let random_value = randomstring_1.default.generate(options);
        // fetch ORDERS count
        let count_orders = yield DAO.count_data(Models.OrderProducts, {});
        let unique_id = Number(count_orders) + 1;
        let order_id = `${static_value}${random_value}${unique_id}`;
        return order_id;
    }
    catch (err) {
        throw err;
    }
});
exports.generate_tax_no = generate_tax_no;
const generate_invoice_id = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let static_value = "INV";
        let count_orders = yield DAO.count_data(Models.OrderInvoices, {});
        let unique_id = Number(count_orders) + 1;
        console.log('uniq ', unique_id);
        let random_value = "INV";
        let count_zeros = yield zeros_count(unique_id);
        for (let i = 0; i < (10 - count_zeros); i++) {
            random_value += "0";
        }
        let order_id = `${random_value}${unique_id}`;
        console.log('invoice _id ', order_id);
        return order_id;
    }
    catch (err) {
        throw err;
    }
});
exports.generate_invoice_id = generate_invoice_id;
const zeros_count = (num) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let count = 0;
        if (num >= 1) {
            ++count;
        }
        while (num / 10 >= 1) {
            num = num /= 10;
            ++count;
        }
        return count;
    }
    catch (err) {
        throw err;
    }
});
