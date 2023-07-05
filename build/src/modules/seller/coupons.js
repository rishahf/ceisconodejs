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
class coupons_module {
}
exports.default = coupons_module;
_a = coupons_module;
coupons_module.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, description, type, sub_type, start_date, end_date, price, percentage, max_discount, applicable_for, product_ids, language } = req.body;
        let { _id: seller_id } = req.user_data;
        let unique_code = yield index_1.helpers.genrate_coupon_code();
        let data_to_save = {
            name: name,
            code: unique_code,
            type: type,
            sub_type: sub_type,
            start_date: start_date,
            end_date: end_date,
            applicable_for: applicable_for,
            added_by: "SELLER",
            seller_id: seller_id,
            language: language,
            updated_at: +new Date(),
            created_at: +new Date(),
        };
        if (applicable_for == "LIMITED") {
            if (!!product_ids) {
                data_to_save.product_ids = product_ids;
            }
        }
        if (!!description) {
            data_to_save.description = description;
        }
        if (!!price) {
            data_to_save.price = price;
        }
        if (!!percentage) {
            data_to_save.percentage = percentage;
        }
        if (!!max_discount) {
            data_to_save.max_discount = max_discount;
        }
        let response = yield DAO.save_data(Models.Coupons, data_to_save);
        return response;
    }
    catch (err) {
        throw err;
    }
});
coupons_module.edit = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, name, description, type, sub_type, start_date, end_date, price, percentage, max_discount, is_available, is_deleted, applicable_for, product_ids } = req.body;
        let query = { _id: _id };
        let update = { updated_at: +new Date() };
        if (!!name) {
            update.name = name;
        }
        if (!!type) {
            update.type = type;
        }
        if (!!description) {
            update.description = description;
        }
        if (!!sub_type) {
            update.sub_type = sub_type;
        }
        if (!!start_date) {
            update.start_date = start_date;
        }
        if (!!end_date) {
            update.end_date = end_date;
        }
        if (!!price) {
            update.price = price;
        }
        if (!!percentage) {
            update.percentage = percentage;
        }
        if (!!max_discount) {
            update.max_discount = max_discount;
        }
        if (!!applicable_for) {
            update.applicable_for = applicable_for;
        }
        if (applicable_for == "LIMITED") {
            if (!!product_ids) {
                update.product_ids = product_ids;
            }
        }
        else {
            update.product_ids = null;
        }
        if (typeof is_available !== undefined && is_available !== null && is_available !== undefined) {
            update.is_available = is_available;
        }
        if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
            update.is_deleted = is_deleted;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Coupons, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
coupons_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, pagination, limit, language } = req.query;
        let { _id: seller_id } = req.user_data;
        let query = { seller_id: seller_id, is_deleted: false, added_by: "SELLER", language: language };
        if (!!search) {
            query.name = { $regex: search, $options: "i" };
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.get_data(Models.Coupons, query, projection, options);
        let total_count = yield DAO.count_data(Models.Coupons, query);
        return {
            total_count: total_count,
            data: fetch_data,
        };
    }
    catch (err) {
        throw err;
    }
});
coupons_module.details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { is_deleted: false };
        if (!!_id) {
            query._id = _id;
        }
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Coupons, query, projection, options);
        if (fetch_data.length) {
            return fetch_data[0];
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
coupons_module.delete = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let remove_data = yield DAO.remove_data(Models.Coupons, {
            _id: _id,
        });
        if (remove_data.deletedCount > 0) {
            let data = { message: `Coupon deleted successfully...` };
            return data;
        }
    }
    catch (err) {
        throw err;
    }
});
