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
const index_1 = require("../../middlewares/index");
class product_details_module {
}
exports.default = product_details_module;
_a = product_details_module;
product_details_module.retrive_unique_number = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_id: product_id };
        let total_count = yield DAO.count_data(Models.ProductDetails, query);
        let unique_number = Number(total_count) + 1;
        return unique_number;
    }
    catch (err) {
        throw err;
    }
});
product_details_module.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id, product_details } = req.body;
        let unique_number = yield _a.retrive_unique_number(product_id);
        if (product_details.length) {
            for (let i = 0; i < product_details.length; i++) {
                let { key, value } = product_details[i];
                let data_to_save = {
                    product_id: product_id,
                    key: key,
                    value: value,
                    unique_number: unique_number,
                    updated_at: +new Date(),
                    created_at: +new Date()
                };
                let response = yield DAO.save_data(Models.ProductDetails, data_to_save);
                return response;
            }
        }
    }
    catch (err) {
        throw err;
    }
});
product_details_module.edit = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, product_id, key, value } = req.body;
        let query = { _id: _id };
        let update = { updated_at: +new Date() };
        if (!!product_id) {
            update.product_id = product_id;
        }
        if (!!key) {
            update.key = key;
        }
        if (!!value) {
            update.value = value;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.ProductDetails, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_details_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, product_id, pagination, limit } = req.query;
        let query = {};
        if (!!_id) {
            query._id = _id;
        }
        if (!!product_id) {
            query.product_id = product_id;
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        options.sort = { _id: 1 };
        let product_variations = yield DAO.get_data(Models.ProductDetails, query, projection, options);
        let total_count = yield DAO.count_data(Models.ProductDetails, query);
        let response = {
            total_count: total_count,
            data: product_variations
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_details_module.delete = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let remove_data = yield DAO.remove_data(Models.ProductDetails, { _id: _id });
        if (remove_data.deletedCount > 0) {
            let data = { message: `Product Details deleted successfully...` };
            return data;
        }
    }
    catch (err) {
        throw err;
    }
});
