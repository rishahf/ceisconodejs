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
var _a, _b, _c, _d, _e;
Object.defineProperty(exports, "__esModule", { value: true });
exports.fees_module = exports.brand = exports.sub_sub_category = exports.sub_category = exports.category = void 0;
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const index_1 = require("../../middlewares/index");
const moment_1 = __importDefault(require("moment"));
class category {
}
exports.category = category;
_a = category;
category.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, product_type, language } = req.body;
        let design_type = product_type == "WEARABLE_PRODUCT" ? 2 : 1;
        let small_caps = name.toLowerCase();
        let capt_first = name.charAt(0).toUpperCase() + name.slice(1);
        let query = { name: { $in: [small_caps, capt_first] } };
        let get_cat = yield DAO.get_data(Models.Category, query, { __v: 0 }, { lean: true });
        if (get_cat && get_cat.length) {
            console.log('get-cat -- ', language);
            throw yield (0, index_1.handle_custom_error)("CATEGORY_EXIST", language);
        }
        else {
            let data_to_save = {
                name: name,
                design_type: design_type,
                language: language,
                updated_at: +new Date(),
                created_at: +new Date(),
            };
            let response = yield DAO.save_data(Models.Category, data_to_save);
            return response;
        }
    }
    catch (err) {
        throw err;
    }
});
category.edit = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, name, is_deleted, product_type } = req.body;
        console.log('-------- catgeory edit  req-body ---------', req.body);
        let query = { _id: _id };
        let options = { new: true };
        let update = { updated_at: +new Date() };
        if (!!name) {
            update.name = name;
        }
        if (!!product_type) {
            let design_type = product_type == "WEARABLE_PRODUCT" ? 2 : 1;
            update.design_type = design_type;
        }
        if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
            update.is_deleted = is_deleted;
        }
        console.log('---category update ---- ', update);
        let products = yield DAO.get_data(Models.Products, { category_id: _id }, { __v: 0 }, options);
        let response;
        if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
            if (products && products.length) {
                response = yield DAO.find_and_update(Models.Category, query, update, options);
                let data = { message: `Caetgory disabled successfully...` };
                return data;
                // }else if(typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined){
            }
            else {
                let remove_data = yield DAO.remove_data(Models.Category, query);
                let get_sub_category = yield DAO.get_data(Models.SubCategory, { category_id: _id }, { __v: 0 }, options);
                for (let i = 0; i < get_sub_category.length; i++) {
                    let get_sub_subcategory = yield DAO.get_data(Models.Sub_subcategories, { subcategory_id: get_sub_category[i]._id }, { __v: 0 }, options);
                    for (let k = 0; k < get_sub_subcategory.length; k++) {
                        yield DAO.remove_many(Models.Sub_subcategories, { subcategory_id: get_sub_category[k]._id });
                    }
                    yield DAO.remove_many(Models.SubCategory, { category_id: _id });
                }
                if (remove_data.deletedCount > 0) {
                    let data = { message: `Category deleted successfully...` };
                    return data;
                }
            }
        }
        else {
            response = yield DAO.find_and_update(Models.Category, query, update, options);
            let data = { message: `Category updated successfully...` };
            return data;
        }
        // let response = await DAO.find_and_update(Models.Category, query, update, options)
        // return response;
    }
    catch (err) {
        throw err;
    }
});
category.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, search, pagination, limit, start_date, end_date, language } = req.query;
        let query = { language: language };
        if (!!_id) {
            query._id = _id;
        }
        if (!!search) {
            query.name = { $regex: search, $options: "i" };
        }
        if (start_date != undefined && end_date != undefined) {
            // let set_start_date = moment.utc(start_date,"DD/MM/YYYY").startOf('day').format('x');
            // let set_end_date = moment.utc(end_date,"DD/MM/YYYY").endOf('day').format('x');
            query.$and = [
                { created_at: { $gte: start_date } },
                { created_at: { $lte: end_date } }
            ];
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let delete_count = yield DAO.remove_data(Models.Category, { _id: "649a8cd10e58e1248dced535" });
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
category.category = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = {};
        if (!!_id) {
            query._id = _id;
        }
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Category, query, projection, options);
        return fetch_data[0];
    }
    catch (err) {
        throw err;
    }
});
class sub_category {
}
exports.sub_category = sub_category;
_b = sub_category;
sub_category.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { category_id, name, language } = req.body;
        let query = { $and: [{ name: name }, { category_id: category_id }] };
        let fetch_data = yield DAO.get_data(Models.SubCategory, query, { __v: 0 }, { lean: true });
        if (fetch_data && fetch_data.length) {
            console.log('get-cat -- ', language);
            throw yield (0, index_1.handle_custom_error)("CATEGORY_EXIST", language);
        }
        else {
            let data_to_save = {
                category_id: category_id,
                name: name,
                language: language,
                updated_at: +new Date(),
                created_at: +new Date(),
            };
            let response = yield DAO.save_data(Models.SubCategory, data_to_save);
            return response;
        }
    }
    catch (err) {
        throw err;
    }
});
sub_category.edit = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, name, category_id, is_deleted, language } = req.body;
        console.log('req-body ------ ', req.body);
        let options = { new: true };
        let query = { _id: _id };
        let update = { updated_at: +new Date() };
        if (!!name) {
            update.name = name;
        }
        if (!!category_id) {
            update.category_id = category_id;
        }
        if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
            update.is_deleted = is_deleted;
        }
        if (language) {
            update.language = language;
        }
        let products = yield DAO.get_data(Models.Products, { subcategory_id: _id }, { __v: 0 }, options);
        if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined && is_deleted != false) {
            if (products && products.length) {
                console.log('--------- 1');
                yield DAO.find_and_update(Models.SubCategory, query, update, options);
                let data = { message: `Subcategory updated successfully...` };
                return data;
            }
            else {
                console.log("--------- 2");
                let remove_data = yield DAO.remove_data(Models.SubCategory, query);
                let get_sub_category = yield DAO.get_data(Models.Sub_subcategories, { subcategory_id: _id }, { __v: 0 }, options);
                if (get_sub_category && get_sub_category.length) {
                    for (let i = 0; i < get_sub_category.length; i++) {
                        // let get_sub_subcategory:any = await DAO.get_data(Models.Sub_subcategories,{subcategory_id:get_sub_category[i]._id},{__v:0},options)
                        yield DAO.remove_many(Models.Sub_subcategories, { _id: get_sub_category[i]._id });
                    }
                }
                if (remove_data.deletedCount > 0) {
                    let data = { message: `Subcategory deleted successfully...` };
                    return data;
                }
            }
        }
        else {
            console.log("--------- 3");
            yield DAO.find_and_update(Models.SubCategory, query, update, options);
            let data = { message: `Subcategory updated successfully...` };
            return data;
        }
        // let response = await DAO.find_and_update(Models.SubCategory, query, update, options)
        // return response;
    }
    catch (err) {
        throw err;
    }
});
sub_category.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, category_id, search, pagination, limit, start_date, end_date, language } = req.query;
        let query = { language: language };
        if (!!_id) {
            query._id = _id;
        }
        if (!!category_id) {
            query.category_id = category_id;
        }
        if (!!search) {
            query.name = { $regex: search, $options: "i" };
        }
        if (start_date != undefined && end_date != undefined) {
            let set_start_date = moment_1.default.utc(start_date, "DD/MM/YYYY").startOf('day').format('x');
            let set_end_date = moment_1.default.utc(end_date, "DD/MM/YYYY").endOf('day').format('x');
            query.$and = [
                { created_at: { $gte: start_date } },
                { created_at: { $lte: end_date } }
            ];
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let populate = [{ path: "category_id", select: "name" }];
        let fetch_data = yield DAO.populate_data(Models.SubCategory, query, projection, options, populate);
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
sub_category.subcategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { is_deleted: false };
        if (!!_id) {
            query._id = _id;
        }
        let options = { lean: true };
        let projection = { __v: 0 };
        let populate = [{ path: "category_id", select: "name" }];
        let fetch_data = yield DAO.populate_data(Models.SubCategory, query, projection, options, populate);
        return fetch_data[0];
    }
    catch (err) {
        throw err;
    }
});
class sub_sub_category {
}
exports.sub_sub_category = sub_sub_category;
_c = sub_sub_category;
sub_sub_category.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { subcategory_id, name, language } = req.body;
        let query = { $and: [{ name: name }, { subcategory_id: subcategory_id }] };
        let fetch_data = yield DAO.get_data(Models.Sub_subcategories, query, { __v: 0 }, { lean: true });
        if (fetch_data && fetch_data.length) {
            console.log('get-cat -- ', language);
            throw yield (0, index_1.handle_custom_error)("CATEGORY_EXIST", language);
        }
        else {
            let data_to_save = {
                subcategory_id: subcategory_id,
                name: name,
                language: language,
                updated_at: +new Date(),
                created_at: +new Date(),
            };
            let response = yield DAO.save_data(Models.Sub_subcategories, data_to_save);
            return response;
        }
    }
    catch (err) {
        throw err;
    }
});
sub_sub_category.edit = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, name, subcategory_id, is_deleted, language } = req.body;
        let query = { _id: _id };
        let update = { updated_at: +new Date() };
        if (!!name) {
            update.name = name;
        }
        if (!!subcategory_id) {
            update.subcategory_id = subcategory_id;
        }
        if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
            update.is_deleted = is_deleted;
        }
        if (!!language) {
            update.language = language;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Sub_subcategories, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
sub_sub_category.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, subcategory_id, search, pagination, limit, start_date, end_date, language } = req.query;
        let query = { language: language };
        if (!!_id) {
            query._id = _id;
        }
        if (!!subcategory_id) {
            query.subcategory_id = subcategory_id;
        }
        if (!!search) {
            query.name = { $regex: search, $options: "i" };
        }
        if (start_date != undefined && end_date != undefined) {
            // let set_start_date = moment.utc(start_date,"DD/MM/YYYY").startOf('day').format('x');
            // let set_end_date = moment.utc(end_date,"DD/MM/YYYY").endOf('day').format('x');
            query.$and = [
                { created_at: { $gte: start_date } },
                { created_at: { $lte: end_date } }
            ];
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let populate = [{ path: "subcategory_id", select: "name",
                populate: {
                    path: "category_id",
                    select: "name"
                }
            }];
        let fetch_data = yield DAO.populate_data(Models.Sub_subcategories, query, projection, options, populate);
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
sub_sub_category.sub_subcategory = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { is_deleted: false };
        if (!!_id) {
            query._id = _id;
        }
        let projection = { __v: 0 };
        let options = { lean: true };
        let populate = [
            {
                path: "subcategory_id", select: "name",
                populate: [{ path: "category_id", select: "name",
                        populate: {
                            path: "category_id",
                            select: "name"
                        } }]
            }
        ];
        let fetch_data = yield DAO.populate_data(Models.Sub_subcategories, query, projection, options, populate);
        // let total_count = await DAO.count_data(Models.Sub_subcategories, query);
        return fetch_data[0];
    }
    catch (err) {
        throw err;
    }
});
class brand {
}
exports.brand = brand;
_d = brand;
brand.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, language } = req.body;
        let small_caps = name.toLowerCase();
        let capt_first = name.charAt(0).toUpperCase() + name.slice(1);
        let query = { name: { $in: [small_caps, capt_first] } };
        let get_brands = yield DAO.get_data(Models.Brands, query, { __v: 0 }, { lean: true });
        if (get_brands && get_brands.length) {
            throw yield (0, index_1.handle_custom_error)("BRAND_EXIST", language);
        }
        else {
            let data_to_save = {
                name: name.charAt(0).toUpperCase() + name.slice(1),
                language: language,
                updated_at: +new Date(),
                created_at: +new Date(),
            };
            let response = yield DAO.save_data(Models.Brands, data_to_save);
            return response;
        }
    }
    catch (err) {
        throw err;
    }
});
brand.edit = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, name, is_deleted, language } = req.body;
        let query = { _id: _id };
        let update = { updated_at: +new Date() };
        if (!!name) {
            update.name = name.charAt(0).toUpperCase() + name.slice(1);
        }
        if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
            update.is_deleted = is_deleted;
        }
        if (!!language) {
            update.language = language;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Brands, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
brand.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, search, pagination, limit, start_date, end_date, language } = req.query;
        let query = { is_deleted: false, language: language };
        if (!!_id) {
            query._id = _id;
        }
        if (!!search) {
            query.name = { $regex: search, $options: "i" };
        }
        if (start_date != undefined && end_date != undefined) {
            let set_start_date = moment_1.default.utc(start_date, "DD/MM/YYYY").startOf('day').format('x');
            let set_end_date = moment_1.default.utc(end_date, "DD/MM/YYYY").endOf('day').format('x');
            query.$and = [
                { created_at: { $gte: set_start_date } },
                { created_at: { $lte: set_end_date } }
            ];
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        options.sort = { name: 1 };
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
brand.brands = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { is_deleted: false };
        if (!!_id) {
            query._id = _id;
        }
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.Brands, query, projection, options);
        return fetch_data[0];
    }
    catch (err) {
        throw err;
    }
});
class fees_module {
}
exports.fees_module = fees_module;
_e = fees_module;
fees_module.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { fee_percent } = req.body;
        let retrive_data = yield DAO.get_data(Models.AdminFees, {}, {}, { lean: true });
        if (retrive_data.length) {
            return retrive_data[0];
        }
        else {
            let data_to_save = {
                fee_percent: fee_percent,
                updated_at: +new Date(),
                created_at: +new Date(),
            };
            let response = yield DAO.save_data(Models.AdminFees, data_to_save);
            return response;
        }
    }
    catch (err) {
        throw err;
    }
});
fees_module.edit = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { fee_percent } = req.body;
        let retrive_data = yield DAO.get_data(Models.AdminFees, {}, {}, { lean: true });
        if (retrive_data.length) {
            let { _id } = retrive_data[0];
            let query = { _id: _id };
            let update = {
                fee_percent: fee_percent,
                updated_at: +new Date()
            };
            let options = { new: true };
            let response = yield DAO.find_and_update(Models.AdminFees, query, update, options);
            return response;
        }
        else {
            throw yield (0, index_1.handle_custom_error)("NO_DATA_FOUND", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
fees_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        let projection = { __v: 0 };
        let options = { lean: true };
        let fetch_data = yield DAO.get_data(Models.AdminFees, query, projection, options);
        let total_count = yield DAO.count_data(Models.AdminFees, query);
        return {
            total_count: total_count,
            data: fetch_data[0]
        };
    }
    catch (err) {
        throw err;
    }
});
