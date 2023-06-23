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
exports.unwind_data = exports.set_ratings = exports.sort_data = exports.group_data = exports.unwind_review_user_data = exports.lookup_reviews_data = exports.lookup_orders_data = exports.redact_data = exports.lookup_services_highlights = exports.lookup_product_detail = exports.lookup_common_collection = exports.lookup_user_ratings = exports.lookup_address_data = exports.lookup_User_data = exports.lookup_data = exports.match_order_id = exports.match_product_id = exports.match_data = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const match_data = (seller_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                added_by: mongoose_1.default.Types.ObjectId(seller_id),
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
const match_order_id = (_id) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.match_order_id = match_order_id;
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
const lookup_data = (collection, match_id) => __awaiter(void 0, void 0, void 0, function* () {
    var field_name = match_id.slice(1, match_id.length);
    // console.log("field_name ", field_name)
    // console.log("match_id ", match_id)
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
const lookup_User_data = () => __awaiter(void 0, void 0, void 0, function* () {
    // var field_name = match_id.slice(1, match_id.length);
    try {
        return {
            $lookup: {
                from: "users",
                let: { user_id: "$user_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$user_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            profile_pic: 1
                        },
                    },
                ],
                as: "user_id",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_User_data = lookup_User_data;
const lookup_address_data = () => __awaiter(void 0, void 0, void 0, function* () {
    // var field_name = match_id.slice(1, match_id.length);
    // console.log("address_id ", address_id)
    try {
        return {
            $lookup: {
                from: "addresses",
                let: { address_id: "$address_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$address_id"],
                            },
                        },
                    },
                ],
                as: "address_id",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_address_data = lookup_address_data;
const lookup_user_ratings = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "reviews",
                let: { user_id: "$user_id._id", product_id: "$product._id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$user_id", "$$user_id"],
                                    },
                                    {
                                        $eq: ["$product_id", "$$product_id"],
                                    }
                                ]
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
exports.lookup_user_ratings = lookup_user_ratings;
const lookup_product_detail = (collection_name) => __awaiter(void 0, void 0, void 0, function* () {
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
                    {
                        $project: {
                            _id: 1,
                            key: 1,
                            value: 1,
                            unique_number: 1
                        }
                    },
                ],
                as: collection_name,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_product_detail = lookup_product_detail;
const lookup_services_highlights = (collection_name) => __awaiter(void 0, void 0, void 0, function* () {
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
                    {
                        $project: {
                            content: 1
                        }
                    }
                ],
                as: collection_name,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_services_highlights = lookup_services_highlights;
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
                    //   $project:{
                    //     content:1
                    //   }
                    // }
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
const lookup_orders_data = (collection, match_id, seller_id) => __awaiter(void 0, void 0, void 0, function* () {
    var field_name = match_id.slice(1, match_id.length);
    // console.log('seller_id ', seller_id)
    try {
        return {
            $lookup: {
                from: collection,
                let: { new_id: match_id },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$_id", "$$new_id"] },
                                    // { $eq: ["$added_by", mongoose.Types.ObjectId(seller_id)] }
                                ]
                            }
                        }
                    }, {
                        $lookup: {
                            from: "$",
                            let: { category_id: "$subcategory_id.category_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", "$$category_id"],
                                        },
                                    },
                                },
                            ],
                            as: "subcategory_id.category_id",
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
exports.lookup_orders_data = lookup_orders_data;
const lookup_reviews_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "reviews",
                let: { new_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$product_id", "$$new_id"],
                            },
                        },
                    },
                    {
                        $lookup: {
                            from: "users",
                            let: { user_id: "$user_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", "$$user_id"],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1,
                                        profile_pic: 1,
                                    },
                                },
                            ],
                            as: "user_id",
                        },
                    },
                    {
                        $unwind: {
                            path: "$user_id",
                            preserveNullAndEmptyArrays: true
                        }
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
const unwind_review_user_data = (match_id) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.unwind_review_user_data = unwind_review_user_data;
const group_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                created_at: { $first: "$created_at" },
            },
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
            $sort: { created_at: -1 },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.sort_data = sort_data;
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
const lookup_ordersData = () => __awaiter(void 0, void 0, void 0, function* () {
    // var field_name = match_id.slice(1, match_id.length);
    try {
        return {
            $lookup: {
                from: "products",
                let: { new_id: "$product" },
                pipeline: [
                    {
                        $match: {
                            $and: [
                                {
                                    $expr: {
                                        $eq: ["$_id", "$$new_id"],
                                    },
                                    $eq: ["$added_by", "$$seller_id"],
                                }
                            ]
                        },
                    },
                ],
                as: "product",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
const lookup_product_details = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "productdetails",
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
                as: "product_details",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
const look_up_product_services = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "product_services",
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
                as: "services",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
const look_up_product_highlights = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "product_highlights",
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
                as: "highlights",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
const lookup_data_category = (collection, match_id) => __awaiter(void 0, void 0, void 0, function* () {
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
                    }, {
                        $lookup: {
                            from: "$categories",
                            let: { category_id: "$subcategory_id.category_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", "$$category_id"],
                                        },
                                    },
                                },
                            ],
                            as: "subcategory_id.category_id",
                        },
                    }
                ],
                as: field_name,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
const unwind_data_category = (match_id) => __awaiter(void 0, void 0, void 0, function* () {
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
// const lookup_orders_data = async (collection: any, match_id: any) => {
//   var field_name = match_id.slice(1, match_id.length);
//   try {
//     return {
//       $lookup: {
//         from: collection,
//         let: { new_id: match_id },
//         pipeline: [
//           {
//             $match: {
//               $expr: {
//                 $eq: ["$_id", "$$new_id"],
//               },
//             },
//           }, {
//             $lookup: {
//               from: "$",
//               let: { category_id: "$subcategory_id.category_id" },
//               pipeline: [
//                 {
//                   $match: {
//                     $expr: {
//                       $eq: ["$_id", "$$category_id"],
//                     },
//                   },
//                 },
//               ],
//               as: "subcategory_id.category_id",
//             },
//           }
//         ],
//         as: field_name,
//       },
//     };
//   } catch (err) {
//     throw err;
//   }
// };
let graph_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $facet: {
                Weekly: [
                    {
                        $group: {
                            order_id: {
                                "$week": "$created"
                            },
                            total: {
                                $sum: "$total"
                            }
                        }
                    }
                ]
            }
        };
    }
    catch (err) {
        throw err;
    }
});
const new_lookup_ordersData = () => __awaiter(void 0, void 0, void 0, function* () {
    // var field_name = match_id.slice(1, match_id.length);
    try {
        return {
            $lookup: {
                from: "products",
                let: { new_id: "$product" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$new_id"],
                            },
                        },
                    },
                ],
                as: "product",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
