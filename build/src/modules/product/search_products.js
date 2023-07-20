"use strict";
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
exports.limit_data = exports.skip_data = exports.sort_data = exports.group_data = exports.filter_data = exports.unwind_seller = exports.lookup_seller = exports.unwind_sub_subcategories = exports.lookup_sub_subcategories = exports.unwind_subcategories = exports.lookup_subcategories = exports.unwind_categories = exports.lookup_categories = exports.unwind_brands = exports.lookup_brands = exports.remove_deleted = exports.match = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const match = (product_id, subcategory_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                _id: { $ne: mongoose_1.default.Types.ObjectId(product_id) },
                subcategory_id: mongoose_1.default.Types.ObjectId(subcategory_id),
                is_deleted: false,
                is_visible: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match = match;
const remove_deleted = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                is_deleted: false,
                is_visible: true,
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.remove_deleted = remove_deleted;
const lookup_brands = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.lookup_brands = lookup_brands;
const unwind_brands = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.unwind_brands = unwind_brands;
const lookup_categories = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.lookup_categories = lookup_categories;
const unwind_categories = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.unwind_categories = unwind_categories;
const lookup_subcategories = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.lookup_subcategories = lookup_subcategories;
const unwind_subcategories = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.unwind_subcategories = unwind_subcategories;
const lookup_sub_subcategories = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.lookup_sub_subcategories = lookup_sub_subcategories;
const unwind_sub_subcategories = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.unwind_sub_subcategories = unwind_sub_subcategories;
const lookup_seller = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "sellers",
                let: { added_by: "$added_by" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$added_by"],
                            },
                        },
                    },
                    {
                        $project: {
                            name: 1
                        }
                    }
                ],
                as: "retrive_seller"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_seller = lookup_seller;
const unwind_seller = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$retrive_seller",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_seller = unwind_seller;
const filter_data = (payload_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, min_price, max_price } = payload_data;
        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    { $eq: [search, undefined] },
                                    {
                                        $regexMatch: {
                                            input: "$retrive_subcategories.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    }
                                    // {
                                    //     $regexMatch: {
                                    //         input: "$name",
                                    //         regex: search,
                                    //         options: "i",
                                    //     }
                                    // },
                                    // {
                                    //     $regexMatch: {
                                    //         input: "$retrive_brands.name",
                                    //         regex: search,
                                    //         options: "i",
                                    //     }
                                    // },
                                    // {
                                    //     $regexMatch: {
                                    //         input: "$fetch_sub_subcategories.name",
                                    //         regex: search,
                                    //         options: "i",
                                    //     }
                                    // }
                                ]
                            },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: [min_price, undefined] },
                                            { $eq: [max_price, undefined] }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$discount_price", Number(min_price)] },
                                            { $lt: ["$discount_price", Number(max_price)] }
                                        ]
                                    }
                                ]
                            }
                        ]
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE"
                }
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.filter_data = filter_data;
const group_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                name: { "$first": "$name" },
                description: { "$first": "$description" },
                product_type: { "$first": "$product_type" },
                added_by: { "$first": "$retrive_seller" },
                parcel_id: { "$first": "$parcel_id" },
                brand_id: { "$first": "$retrive_brands" },
                category_id: { "$first": "$retrive_categories" },
                subcategory_id: { "$first": "$retrive_subcategories" },
                sub_subcategory_id: { "$first": "$fetch_sub_subcategories" },
                images: { "$first": "$images" },
                quantity: { "$first": "$quantity" },
                price: { "$first": "$price" },
                colour: { $first: "$colour" },
                size: { $first: "$size" },
                parent_id: { $first: "$parent_id" },
                discount_percantage: { "$first": "$discount_percantage" },
                discount: { "$first": "$discount" },
                discount_price: { "$first": "$discount_price" },
                total_reviews: { "$first": "$total_reviews" },
                total_ratings: { "$first": "$total_ratings" },
                average_rating: { "$first": "$average_rating" },
                one_star_ratings: { "$first": "$one_star_ratings" },
                two_star_ratings: { "$first": "$two_star_ratings" },
                three_star_ratings: { "$first": "$three_star_ratings" },
                four_star_ratings: { "$first": "$four_star_ratings" },
                five_star_ratings: { "$first": "$five_star_ratings" },
                sold: { "$first": "$sold" },
                is_blocked: { "$first": "$is_blocked" },
                is_deleted: { "$first": "$is_deleted" },
                updated_at: { "$first": "$updated_at" },
                created_at: { "$first": "$created_at" }
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_data = group_data;
let sort_data = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.sort_data = sort_data;
const skip_data = (payload_data) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.skip_data = skip_data;
const limit_data = (payload_data) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.limit_data = limit_data;
