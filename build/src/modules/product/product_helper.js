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
exports.lookup_common_collection = exports.set_ratings = exports.set_review_data = exports.lookup_reviews_data = exports.group_ratings = exports.limit_data = exports.skip_data = exports.sort_by_price = exports.sort_data = exports.redact_match_data = exports.redact_match_price = exports.redact_product_type = exports.redact_product = exports.redact_data = exports.redact_products_search = exports.unwind_data = exports.lookup_data = exports.match_variant_product_id = exports.group_variants_data = exports.unwind_variants = exports.lookup_variants = exports.match_product_id = exports.match_data = exports.redact_filter_data = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const match_data = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                added_by: mongoose_1.default.Types.ObjectId(user_id),
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_data = match_data;
const match_product_id = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                _id: mongoose_1.default.Types.ObjectId(_id),
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_product_id = match_product_id;
const match_variant_product_id = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                product_id_1: mongoose_1.default.Types.ObjectId(_id),
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_variant_product_id = match_variant_product_id;
const lookup_variants = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "products",
                let: { product_id: "$product_id_2" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$_id", "$$product_id"],
                                    },
                                    //   {
                                    //     $eq: ["$is_visible", true],
                                    //   }
                                ],
                            },
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            images: 1,
                            price: 1,
                            discount: 1,
                            discount_percantage: 1,
                            discount_price: 1,
                        },
                    },
                ],
                as: "products",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_variants = lookup_variants;
const unwind_variants = () => __awaiter(void 0, void 0, void 0, function* () {
    // var path_check = "$"+match_id
    // console.log("path_check -> ", path_check)
    try {
        return {
            $unwind: {
                path: "$products",
                preserveNullAndEmptyArrays: true,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_variants = unwind_variants;
const redact_filter_data = (req_query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log('req_query.sub_subcategory_id', req_query.sub_subcategory_id)
        let new_ids_array = [];
        if (typeof req_query.subcategory_id == "object") {
            for (let value of req_query.subcategory_id) {
                new_ids_array.push(mongoose_1.default.Types.ObjectId(value));
            }
        }
        else if (typeof req_query.subcategory_id == "string") {
            new_ids_array.push(mongoose_1.default.Types.ObjectId(req_query.subcategory_id));
        }
        let _ids_array = [];
        if (typeof req_query.sub_subcategory_id == "object") {
            // console.log("Case 1")
            for (let value of req_query.sub_subcategory_id) {
                _ids_array.push(mongoose_1.default.Types.ObjectId(value));
            }
        }
        else if (typeof req_query.sub_subcategory_id == "string") {
            // console.log("Case 2")
            _ids_array.push(mongoose_1.default.Types.ObjectId(req_query.sub_subcategory_id));
        }
        let brand_ids_array = [];
        if (typeof req_query.brand_id == "object") {
            // console.log("Case 1")
            for (let value of req_query.brand_id) {
                brand_ids_array.push(mongoose_1.default.Types.ObjectId(value));
            }
        }
        else if (typeof req_query.brand_id == "string") {
            // console.log("Case 2")
            brand_ids_array.push(mongoose_1.default.Types.ObjectId(req_query.brand_id));
        }
        // console.log('_Ids----- ',_ids_array)
        // console.log("NEW ARRAY as ObjectId : -- > ", new_ids_array)
        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    { $eq: [req_query.subcategory_id, undefined] },
                                    { $in: ["$subcategory_id", new_ids_array] },
                                ],
                            },
                            {
                                $or: [
                                    { $eq: [req_query.sub_subcategory_id, undefined] },
                                    { $in: ["$sub_subcategory_id", _ids_array] },
                                ],
                            },
                            {
                                $or: [
                                    { $eq: [req_query.brand_id, undefined] },
                                    { $in: ["$brand_id", brand_ids_array] },
                                ],
                            }
                        ]
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.redact_filter_data = redact_filter_data;
const lookup_data = (collection, match_id) => __awaiter(void 0, void 0, void 0, function* () {
    var field_name = match_id.slice(1, match_id.length);
    // console.log("FIELD NAME--------",field_name)
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
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$brand_id.name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$sub_subcategory_id.name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                        ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
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
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$brand_id.name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                        ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.redact_product = redact_product;
const redact_products_search = (search, field_Search) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $redact: {
                $cond: {
                    if: {
                        $or: [
                            { $eq: [search, undefined] },
                            {
                                $regexMatch: {
                                    input: field_Search,
                                    regex: search,
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                        ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.redact_products_search = redact_products_search;
// const redact_brand = async (search: string) => {
//   try {
//     return {
//       $redact: {
//         $cond: {
//           if: {
//             $or: [
//               { $eq: [search, undefined] },
//               {
//                 $regexMatch: {
//                   input: "$brand_id.name",
//                   regex: search,
//                   options: "i",
//                 },
//               },
//               {
//                 $regexMatch: {
//                   input: "$name",
//                   regex: search,
//                   options: "i",
//                 },
//               },
//             ],
//           },
//           then: "$$KEEP",
//           else: "$$PRUNE",
//         },
//       },
//     };
//   } catch (err) {
//     throw err;
//   }
// };
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
                                    options: "i",
                                },
                            },
                            {
                                $regexMatch: {
                                    input: "$name",
                                    regex: search,
                                    options: "i",
                                },
                            },
                        ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.redact_product_type = redact_product_type;
const redact_match_price = (min_price, max_price) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var min = min_price ? parseFloat(min_price) : undefined;
        var max = max_price ? parseFloat(max_price) : undefined;
        // console.log(typeof(max), "TypeOf Maximum - Minimum " , typeof(min) )
        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    {
                                        $eq: [min, undefined],
                                    },
                                    {
                                        $gte: ["$price", min],
                                    },
                                ],
                            },
                            {
                                $or: [
                                    {
                                        $eq: [max, undefined],
                                    },
                                    {
                                        $lte: ["$price", max],
                                    },
                                ],
                            },
                        ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.redact_match_price = redact_match_price;
const redact_match_data = (min_value, field_to_search) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var min = min_value ? parseFloat(min_value) : undefined;
        // var max = max_price ? parseFloat(max_price) : undefined;
        // console.log(typeof(max), "TypeOf Maximum - Minimum " , typeof(min) )
        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    {
                                        $eq: [min, undefined],
                                    },
                                    {
                                        $gte: [field_to_search, min],
                                    },
                                ],
                            },
                        ],
                    },
                    then: "$$KEEP",
                    else: "$$PRUNE",
                },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.redact_match_data = redact_match_data;
// const redact_example_filter = async (search: any, field: string) => {
//   console.log("FIELD: ", field, "SEARCH: ", search);
//   console.log("TYPE OF : ", typeof search[0]);
//   let search_id = mongoose.Types.ObjectId(search);
//   try {
//     return {
//       $redact: {
//         $cond: {
//           if: {
//             $or: [{ $eq: [search, undefined] }, { $in: [field, search_id] }],
//           },
//           then: "$$KEEP",
//           else: "$$PRUNE",
//         },
//       },
//     };
//   } catch (err) {
//     throw err;
//   }
// };
let sort_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $sort: { created_at: -1 },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.sort_data = sort_data;
let sort_by_price = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $sort: { price: 1 },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.sort_by_price = sort_by_price;
const skip_data = (pagination, limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // console.log("-------------pagination------",pagination)
        // console.log("-------------limit------",limit)
        if (pagination != undefined ||
            (pagination != null && limit != undefined) ||
            limit != null) {
            // console.log("----skip_data-case_1---")
            if (limit == undefined) {
                // console.log("----skip_data-case_1.1---")
                return { $skip: parseInt(pagination) * 10 };
            }
            else {
                // console.log("----skip_data-case_1.2---")
                return { $skip: parseInt(pagination) * parseInt(limit) };
            }
        }
        else {
            // console.log("----skip_data-case_3---")
            return { $skip: 0 };
        }
    }
    catch (err) {
        throw err;
    }
});
exports.skip_data = skip_data;
const limit_data = (limit) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (limit != undefined || limit != null) {
            // console.log("----limit_data-case_1---")
            return { $limit: parseInt(limit) };
        }
        else {
            // console.log("----limit_data-case_2---")
            return { $limit: 10 };
        }
    }
    catch (err) {
        throw err;
    }
});
exports.limit_data = limit_data;
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
const set_ratings = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        $set: {
            one_rate_count: {
                $size: {
                    $filter: {
                        input: "$ratings",
                        as: "rating_data",
                        cond: {
                            $and: [
                                { $eq: ["$$rating_data.product_id", "$_id"] },
                                { $eq: ["$$rating_data.ratings", 1] },
                            ],
                        },
                    },
                },
            },
            two_rate_count: {
                $size: {
                    $filter: {
                        input: "$ratings",
                        as: "rating_data",
                        cond: {
                            $and: [
                                { $eq: ["$$rating_data.product_id", "$_id"] },
                                { $eq: ["$$rating_data.ratings", 2] },
                            ],
                        },
                    },
                },
            },
            three_rate_count: {
                $size: {
                    $filter: {
                        input: "$ratings",
                        as: "rating_data",
                        cond: {
                            $and: [
                                { $eq: ["$$rating_data.product_id", "$_id"] },
                                { $eq: ["$$rating_data.ratings", 3] },
                            ],
                        },
                    },
                },
            },
            four_rate_count: {
                $size: {
                    $filter: {
                        input: "$ratings",
                        as: "rating_data",
                        cond: {
                            $and: [
                                { $eq: ["$$rating_data.product_id", "$_id"] },
                                { $eq: ["$$rating_data.ratings", 4] },
                            ],
                        },
                    },
                },
            },
            five_rate_count: {
                $size: {
                    $filter: {
                        input: "$ratings",
                        as: "rating_data",
                        cond: {
                            $and: [
                                { $eq: ["$$rating_data.product_id", "$_id"] },
                                { $eq: ["$$rating_data.ratings", 5] },
                            ],
                        },
                    },
                },
            },
        },
    };
});
exports.set_ratings = set_ratings;
const multiply_counts = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        $set: {
            one_multi: {
                $multiply: ['$one_rate_count', 1]
            },
            two_multi: {
                $multiply: ['$two_rate_count', 2]
            },
            three_multi: {
                $multiply: ['$three_rate_count', 3]
            },
            four_multi: {
                $multiply: ['$four_rate_count', 4]
            },
            five_multi: {
                $multiply: ['$five_rate_count', 5]
            }
        }
    };
});
const calculate_rating_sums = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        $set: {
            total_user_ratings: {
                $sum: ['$one_rate_count', '$two_rate_count', '$three_rate_count', '$four_rate_count', '$five_rate_count']
            },
            total_rating_count: {
                $sum: ['$one_multi', '$two_multi', '$three_multi', '$four_multi', '$five_multi']
            },
            // avg_ratings: { $avg: { $divide: [ "$total_ratings_count", "$total_user_ratings" ] } },
        }
    };
});
const calculate_avg = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        $set: {
            avg_ratings: {
                $cond: [
                    { $eq: ["$total_user_ratings", 0] }, 0,
                    { $avg: { $divide: ["$total_rating_count", "$total_user_ratings"] } }
                ]
            }
        }
    };
});
const group_ratings = (fetch_1_rating) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                rate: { $first: fetch_1_rating },
                star_ratings: {
                    $first: { $size: fetch_1_rating },
                },
                // ,
                // "4_star_ratings": {
                //   $sum: {
                //     $cond: [{ $eq: ["$reviews.rating", 4] }, 1, 0],
                //   },
                // },
                // "3_star_ratings": {
                //   $sum: {
                //     $cond: [{ $eq: ["$reviews.rating", 3] }, 1, 0],
                //   },
                // },
                // "2_star_ratings": {
                //   $sum: {
                //     $cond: [{ $eq: ["$reviews.rating", 2] }, 1, 0],
                //   },
                // },
                // "1_star_ratings": {
                //   $sum: {
                //     $cond: [{ $eq: ["$reviews.rating", 1] }, 1, 0],
                //   },
                // },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_ratings = group_ratings;
const lookup_common_collection = (collection_name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: collection_name,
                let: { product_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$product_id", "$$product_id"],
                            },
                        },
                    },
                    // {
                    //   $project: {
                    //     _id:1,
                    //     key: 1,
                    //     value: 1,
                    //   },
                    // },
                ],
                as: collection_name,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_common_collection = lookup_common_collection;
const group_variants_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                // variants: { $first: "$products" },
                product_id: { $first: "$products._id" },
                name: { $first: "$products.name" },
                images: { $first: "$products.images" },
                price: { $first: "$products.price" },
                discount_percantage: { $first: "$products.discount_percantage" },
                discount: { $first: "$products.discount" },
                discount_price: { $first: "$products.discount_price" },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_variants_data = group_variants_data;
