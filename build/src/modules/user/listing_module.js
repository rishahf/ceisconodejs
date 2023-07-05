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
class listing_module {
}
exports.default = listing_module;
_a = listing_module;
listing_module.categories = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, search, pagination, limit, language } = req.query;
        let query = { is_deleted: false, language: language };
        if (!!_id) {
            query._id = _id;
        }
        if (!!search) {
            query.name = { $regex: search, $options: "i" };
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.get_data(Models.Category, query, projection, options);
        let total_count = yield DAO.count_data(Models.Category, query);
        return {
            total_count: total_count,
            data: fetch_data,
        };
    }
    catch (err) {
        throw err;
    }
});
listing_module.categories_details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id, is_deleted: false };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Category, query, projection, options);
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
listing_module.sub_categories = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, category_id, search, pagination, limit, language } = req.query;
        let query = { is_deleted: false, language: language };
        if (!!_id) {
            query._id = _id;
        }
        if (!!category_id) {
            query.category_id = category_id;
        }
        if (!!search) {
            query.name = { $regex: search, $options: "i" };
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.get_data(Models.SubCategory, query, projection, options);
        let total_count = yield DAO.count_data(Models.SubCategory, query);
        return {
            total_count: total_count,
            data: fetch_data,
        };
    }
    catch (err) {
        throw err;
    }
});
listing_module.sub_categories_details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id, is_deleted: false };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.SubCategory, query, projection, options);
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
listing_module.sub_subcategories = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, subcategory_id, search, pagination, limit, language } = req.query;
        let query = { is_deleted: false, language: language };
        if (!!_id) {
            query._id = _id;
        }
        if (!!subcategory_id) {
            query.subcategory_id = subcategory_id;
        }
        if (!!search) {
            query.name = { $regex: search, $options: "i" };
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.get_data(Models.Sub_subcategories, query, projection, options);
        let total_count = yield DAO.count_data(Models.Sub_subcategories, query);
        return {
            total_count: total_count,
            data: fetch_data,
        };
    }
    catch (err) {
        throw err;
    }
});
listing_module.sub_subcategories_details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id, is_deleted: false };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Sub_subcategories, query, projection, options);
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
listing_module.brands = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, search, pagination, limit, language } = req.query;
        let query = { is_deleted: false, language: language };
        if (!!_id) {
            query._id = _id;
        }
        if (!!search) {
            query.name = { $regex: search, $options: "i" };
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.get_data(Models.Brands, query, projection, options);
        let total_count = yield DAO.count_data(Models.Brands, query);
        return {
            total_count: total_count,
            data: fetch_data,
        };
    }
    catch (err) {
        throw err;
    }
});
listing_module.brands_details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id, is_deleted: false };
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Brands, query, projection, options);
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
listing_module.nested_data = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { language } = req.query;
        let query = { is_deleted: false, language: language };
        let projection = { __v: 0, is_deleted: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Category, query, projection, options);
        let total_count = yield DAO.count_data(Models.Category, query);
        if (response.length) {
            yield _a.retrive_sub_categories(response);
        }
        return {
            total_count: total_count,
            data: response
        };
    }
    catch (err) {
        throw err;
    }
});
listing_module.retrive_sub_categories = (categories) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (let i = 0; i < categories.length; i++) {
            let { _id: category_id } = categories[i];
            let query = { category_id: category_id, is_deleted: false };
            let projection = { __v: 0, is_deleted: 0 };
            let options = { lean: true };
            let sub_categories = yield DAO.get_data(Models.SubCategory, query, projection, options);
            categories[i].sub_categories = sub_categories;
            yield _a.retrive_sub_sub_categories(sub_categories);
        }
    }
    catch (err) {
        throw err;
    }
});
listing_module.retrive_sub_sub_categories = (sub_categories) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (sub_categories.length) {
            for (let i = 0; i < sub_categories.length; i++) {
                let { _id: sub_category_id } = sub_categories[i];
                let query = { subcategory_id: sub_category_id, is_deleted: false };
                let projection = { __v: 0, is_deleted: 0 };
                let options = { lean: true };
                let response = yield DAO.get_data(Models.Sub_subcategories, query, projection, options);
                sub_categories[i].sub_subcategories = response;
            }
        }
    }
    catch (err) {
        throw err;
    }
});
