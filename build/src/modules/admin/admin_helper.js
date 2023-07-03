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
exports.set_review_data = exports.lookup_reviews_data = exports.sort_data = exports.group_data = exports.redact_product_type = exports.redact_brand = exports.redact_product = exports.redact_data = exports.unwind_data = exports.lookup_data = exports.match_data = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const match_data = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                added_by: mongoose_1.default.Types.ObjectId(user_id)
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_data = match_data;
const lookup_data = (collection, match_id) => __awaiter(void 0, void 0, void 0, function* () {
    var field_name = match_id.slice(1, match_id.length);
    try {
        return {
            $lookup: {
                from: collection,
                let: { new_id: match_id },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$new_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                        },
                    },
                ],
                as: field_name,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_data = lookup_data;
const unwind_data = (match_id) => __awaiter(void 0, void 0, void 0, function* () {
    // var path_check = "$"+match_id
    // console.log("path_check -> ", path_check)
    try {
        return {
            $unwind: {
                path: match_id,
                preserveNullAndEmptyArrays: true,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_data = unwind_data;
const redact_data = (search) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: "$subcategory_id.name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$brand_id.name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$product_type_id.name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
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
exports.redact_data = redact_data;
const redact_product = (search) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: "$subcategory_id.name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$brand_id.name",
                                    regex: search,
                                    options: 'i'
                                }
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
exports.redact_product = redact_product;
const redact_brand = (search) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: "$brand_id.name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: 'i'
                                }
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
exports.redact_brand = redact_brand;
const group_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                created_at: { "$first": "$created_at" },
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
            $sort: { created_at: -1 }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.sort_data = sort_data;
//redact_product_type
const redact_product_type = (search) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: "$product_type_id.name",
                                    regex: search,
                                    options: 'i'
                                }
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: 'i'
                                }
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
exports.redact_product_type = redact_product_type;
const lookup_reviews_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "reviews",
                let: { product_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$product_id", "$$product_id"],
                            },
                        },
                    },
                ],
                as: "ratings",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_reviews_data = lookup_reviews_data;
const set_review_data = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        $set: {
            fetch_1_rating: {
                $filter: {
                    input: "$ratings",
                    as: "rating_data",
                    cond: { $eq: ["$$rating_data.product_id", "$_id"] },
                },
            },
        },
    };
});
exports.set_review_data = set_review_data;
