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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_style_for_categories = exports.admin_style_for_categories = void 0;
const DAO = __importStar(require("../../DAO"));
const mongoose_1 = __importDefault(require("mongoose"));
const models_1 = require("../../models");
const index_1 = require("../../middlewares/index");
class admin_style_for_categories {
}
exports.admin_style_for_categories = admin_style_for_categories;
_a = admin_style_for_categories;
admin_style_for_categories.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { style_for_id, image, category_id, subcategory_id, sub_subcategory_id, brand_id, language } = req.body;
        let query = { style_for_id: style_for_id, is_deleted: false };
        let total_count = yield DAO.count_data(models_1.StyleForCategories, query);
        if (total_count < 4) {
            let data_to_save = {
                style_for_id: style_for_id,
                image: image,
                updated_at: +new Date(),
                created_at: +new Date()
            };
            if (!!category_id) {
                data_to_save.category_id = category_id;
            }
            if (!!subcategory_id) {
                data_to_save.subcategory_id = subcategory_id;
            }
            if (!!sub_subcategory_id) {
                data_to_save.sub_subcategory_id = sub_subcategory_id;
            }
            if (!!brand_id) {
                data_to_save.brand_id = brand_id;
            }
            if (!!language) {
                data_to_save.language = language;
            }
            let response = yield DAO.save_data(models_1.StyleForCategories, data_to_save);
            return response;
        }
        else {
            throw yield (0, index_1.handle_custom_error)("STYLE_FOR_CATEGORIES_ERROR", language);
        }
    }
    catch (err) {
        throw err;
    }
});
admin_style_for_categories.update = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, style_for_id, image, category_id, subcategory_id, sub_subcategory_id, brand_id, language } = req.body;
        let query = { _id: _id };
        let update = { updated_at: +new Date() };
        if (!!style_for_id) {
            update.style_for_id = style_for_id;
        }
        if (!!image) {
            update.image = image;
        }
        if (!!category_id) {
            update.category_id = category_id;
        }
        if (!!subcategory_id) {
            update.subcategory_id = subcategory_id;
        }
        if (!!sub_subcategory_id) {
            update.sub_subcategory_id = sub_subcategory_id;
        }
        if (!!brand_id) {
            update.brand_id = brand_id;
        }
        if (!!language) {
            update.language = language;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(models_1.StyleForCategories, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
admin_style_for_categories.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, style_for_id, pagination, limit, language } = req.query;
        let query = { is_deleted: false, language: language };
        if (!!_id) {
            query._id = _id;
        }
        if (!!style_for_id) {
            query.style_for_id = style_for_id;
        }
        let projection = { __v: 0, is_deleted: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let populate = [
            {
                path: 'style_for_id',
                select: 'name'
            },
            {
                path: 'category_id',
                select: 'name'
            },
            {
                path: 'subcategory_id',
                select: 'name'
            },
            {
                path: 'sub_subcategory_id',
                select: 'name'
            },
            {
                path: 'brand_id',
                select: 'name'
            },
        ];
        let response = yield DAO.populate_data(models_1.StyleForCategories, query, projection, options, populate);
        let total_count = yield DAO.count_data(models_1.StyleForCategories, query);
        let res = _id != undefined || null ? response[0] : response;
        return {
            total_count: total_count,
            data: res
        };
    }
    catch (err) {
        throw err;
    }
});
admin_style_for_categories.delete = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let update = { is_deleted: true };
        let options = { new: true };
        let response = yield DAO.find_and_update(models_1.StyleForCategories, query, update, options);
        if (response.is_deleted == true) {
            let message = `Style For Categories Deleted Successfully`;
            return message;
        }
        else {
            throw yield (0, index_1.handle_custom_error)("SOMETHING_WENT_WRONG", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
admin_style_for_categories.en_dis_sfc = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, is_enable } = req.body;
        let query = { style_for_id: _id };
        let update = { is_enable: is_enable };
        let options = { new: true };
        let get_data = yield DAO.get_data(models_1.StyleForCategories, query, { __v: 0 }, { lean: true });
        if (get_data) {
            let response = yield DAO.update_many(models_1.StyleForCategories, query, update);
        }
        if (is_enable == false) {
            let message = `Style For Categories disabled Successfully`;
            return message;
        }
        else if (is_enable == true) {
            let message = `Style For Categories enabled Successfully`;
            return message;
        }
        else {
            throw yield (0, index_1.handle_custom_error)("SOMETHING_WENT_WRONG", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
class user_style_for_categories {
}
exports.user_style_for_categories = user_style_for_categories;
_b = user_style_for_categories;
user_style_for_categories.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let retrive_sections = yield _b.retrive_sections_data();
        if (retrive_sections.length) {
            let { style_for_categories } = retrive_sections[0];
            if (style_for_categories == true) {
                let fetch_data = yield _b.retrive_data(req);
                return fetch_data;
            }
            else {
                return {
                    total_count: 0,
                    data: []
                };
            }
        }
    }
    catch (err) {
        throw err;
    }
});
user_style_for_categories.retrive_sections_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(models_1.HomePageSections, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
// static retrive_data = async (req: any) => {
//     try {
//         let { _id, style_for_id, pagination, limit } = req.query;
//         let query: any = { is_deleted: false }
//         if (!!_id) { query._id = _id }
//         if (!!style_for_id) { query.style_for_id = style_for_id }
//         let projection = { __v: 0, is_deleted: 0 }
//         let options = await helpers.set_options(pagination, limit)
//         let populate = [
//             {
//                 path: 'style_for_id',
//                 select: 'name'
//             },
//             {
//                 path: 'category_id',
//                 select: 'name'
//             },
//             {
//                 path: 'subcategory_id',
//                 select: 'name'
//             },
//             {
//                 path: 'sub_subcategory_id',
//                 select: 'name'
//             },
//             {
//                 path: 'brand_id',
//                 select: 'name'
//             },
//         ]
//         let response: any = await DAO.populate_data(StyleForCategories, query, projection, options, populate)
//         let total_count = await DAO.count_data(StyleForCategories, query)
//         return {
//             total_count: total_count,
//             data: response
//         }
//     }
//     catch (err) {
//         throw err;
//     }
// }
user_style_for_categories.retrive_data = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, style_for_id, language } = req.query;
        let query = [
            yield aggregate_sfc.match_data(language),
            yield aggregate_sfc.filter_data(_id, style_for_id),
            yield aggregate_sfc.lookup_style_for(),
            yield aggregate_sfc.unwind_style_for(),
            yield aggregate_sfc.lookup_categories(),
            yield aggregate_sfc.unwind_categories(),
            yield aggregate_sfc.lookup_subcategories(),
            yield aggregate_sfc.unwind_subcategories(),
            yield aggregate_sfc.lookup_sub_subcategories(),
            yield aggregate_sfc.unwind_sub_subcategories(),
            yield aggregate_sfc.lookup_brands(),
            yield aggregate_sfc.unwind_brands(),
            yield aggregate_sfc.group_data(),
            yield aggregate_sfc.sort_data(),
            yield aggregate_sfc.skip_data(req.query),
            yield aggregate_sfc.limit_data(req.query)
        ];
        let options = { lean: true };
        let response = yield DAO.aggregate_data(models_1.StyleForCategories, query, options);
        let count_query = [
            yield aggregate_sfc.match_data(language),
            yield aggregate_sfc.filter_data(_id, style_for_id),
            yield aggregate_sfc.lookup_style_for(),
            yield aggregate_sfc.unwind_style_for(),
            yield aggregate_sfc.lookup_categories(),
            yield aggregate_sfc.unwind_categories(),
            yield aggregate_sfc.lookup_subcategories(),
            yield aggregate_sfc.unwind_subcategories(),
            yield aggregate_sfc.lookup_sub_subcategories(),
            yield aggregate_sfc.unwind_sub_subcategories(),
            yield aggregate_sfc.lookup_brands(),
            yield aggregate_sfc.unwind_brands(),
            yield aggregate_sfc.group_data()
        ];
        let count_data = yield DAO.aggregate_data(models_1.StyleForCategories, count_query, options);
        return {
            total_count: count_data.length,
            data: response
        };
    }
    catch (err) {
        throw err;
    }
});
class aggregate_sfc {
}
_c = aggregate_sfc;
aggregate_sfc.match_data = (language) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        $match: {
            is_deleted: false,
            is_enable: true,
            language: language
        }
    };
});
aggregate_sfc.filter_data = (_id, style_for_id) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        $redact: {
            $cond: {
                if: {
                    $and: [
                        {
                            $or: [
                                { $eq: [_id, undefined] },
                                { $eq: ["$_id", mongoose_1.default.Types.ObjectId(_id)] }
                            ]
                        },
                        {
                            $or: [
                                { $eq: [style_for_id, undefined] },
                                { $eq: ["$style_for_id", mongoose_1.default.Types.ObjectId(style_for_id)] }
                            ]
                        }
                    ]
                },
                then: "$$KEEP",
                else: "$$PRUNE"
            }
        }
    };
});
aggregate_sfc.lookup_style_for = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "style_fors",
                let: { style_for_id: "$style_for_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$style_for_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1
                        }
                    }
                ],
                as: "retrive_style_for"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.unwind_style_for = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$retrive_style_for",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.lookup_categories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "categories",
                let: { category_id: "$category_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$category_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1
                        }
                    }
                ],
                as: "retrive_categories"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.unwind_categories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$retrive_categories",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.lookup_subcategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "subcategories",
                let: { subcategory_id: "$subcategory_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$subcategory_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1
                        }
                    }
                ],
                as: "retrive_subcategories"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.unwind_subcategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$retrive_subcategories",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.lookup_sub_subcategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "sub_subcategories",
                let: { sub_subcategory_id: "$sub_subcategory_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$sub_subcategory_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1
                        }
                    }
                ],
                as: "fetch_sub_subcategories"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.unwind_sub_subcategories = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$fetch_sub_subcategories",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.lookup_brands = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "brands",
                let: { brand_id: "$brand_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$brand_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1
                        }
                    }
                ],
                as: "retrive_brands"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.unwind_brands = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$retrive_brands",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.group_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$style_for_id",
                name: { "$first": "$retrive_style_for.name" },
                inner_data: {
                    "$addToSet": {
                        _id: "$_id",
                        image: "$image",
                        style_for_id: "$retrive_style_for",
                        category_id: "$retrive_categories",
                        subcategory_id: "$retrive_subcategories",
                        sub_subcategory_id: "$fetch_sub_subcategories",
                        brand_id: "$retrive_brands",
                        updated_at: "$updated_at",
                        created_at: "$created_at"
                    }
                }
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.sort_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $sort: {
                _id: -1
            }
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.skip_data = (payload_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pagination, limit } = payload_data;
        let set_pagination = 0, set_limit = 0;
        if (pagination != undefined) {
            set_pagination = parseInt(pagination);
        }
        if (limit != undefined) {
            set_limit = parseInt(limit);
        }
        return {
            $skip: set_pagination * set_limit
        };
    }
    catch (err) {
        throw err;
    }
});
aggregate_sfc.limit_data = (payload_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { limit } = payload_data;
        let set_limit = 10;
        if (limit != undefined) {
            set_limit = parseInt(limit);
        }
        return {
            $limit: set_limit
        };
    }
    catch (err) {
        throw err;
    }
});
