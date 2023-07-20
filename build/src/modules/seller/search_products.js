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
exports.limit_data = exports.skip_data = exports.sort_data1 = exports.sort_data = exports.group_variants_data = exports.group_data = exports.filter_data = exports.unwind_variant = exports.lookup_variants = exports.unwind_variant_head = exports.lookup_variant_head = exports.lookup_variant_ = exports.unwind_seller = exports.lookup_seller = exports.unwind_sub_subcategories = exports.lookup_sub_subcategories = exports.unwind_subcategories = exports.lookup_subcategories = exports.unwind_categories = exports.lookup_categories = exports.unwind_brands = exports.lookup_brands = exports.match_product_id_1_2 = exports.match_product_id = exports.match_data = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const moment = require('moment');
const match_data = (seller_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                added_by: mongoose_1.default.Types.ObjectId(seller_id),
                is_deleted: false
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
                product_id: mongoose_1.default.Types.ObjectId(_id),
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_product_id = match_product_id;
const match_product_id_1_2 = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                // product_id: mongoose.Types.ObjectId(_id)
                product_id_1: mongoose_1.default.Types.ObjectId(_id),
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_product_id_1_2 = match_product_id_1_2;
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
const lookup_variant_ = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "products",
                // let: { brand_id: "$brand_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                // $nin: ["$_id", "$$brand_id"],
                                $eq: ["$_id", "$$product_id_2"],
                            },
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            images: 1,
                        },
                    },
                ],
                as: "retrive_brands",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_variant_ = lookup_variant_;
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
        let { search, product_id, category_id, subcategory_id, sub_subcategory_id, brand_id, min_price, max_price, start_date, end_date, out_of_stock, qty: quantity } = payload_data;
        console.log('payload ', payload_data);
        let stock_value;
        if (!!out_of_stock) {
            stock_value = out_of_stock == 'true' ? true : false;
        }
        // let set_start_date : any, set_end_date : any;
        // if(!!start_date) { set_start_date = moment.utc(start_date, "DD/MM/YYYY").format('x') }
        // if(!!end_date) { set_end_date = moment.utc(end_date, "DD/MM/YYYY").format('x') }
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
                                            input: "$name",
                                            regex: search,
                                            options: "i",
                                        },
                                    },
                                    //   {
                                    //       $regexMatch: {
                                    //           input: "$_id",
                                    //           regex: search,
                                    //           options: "i",
                                    //       }
                                    //   },
                                    //   {
                                    //     $or: [
                                    //       { $eq: [search, undefined] },
                                    //       {
                                    //         $eq: ["$_id", mongoose.Types.ObjectId(search)],
                                    //       },
                                    //     ],
                                    //   },
                                    //   {
                                    //     $regexMatch: {
                                    //       input: "$fetch_sub_subcategories.name",
                                    //       regex: search,
                                    //       options: "i",
                                    //     },
                                    //   },
                                    {
                                        $regexMatch: {
                                            input: "$retrive_brands.name",
                                            regex: search,
                                            options: "i",
                                        },
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$retrive_categories.name",
                                            regex: search,
                                            options: "i",
                                        },
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$retrive_subcategories.name",
                                            regex: search,
                                            options: "i",
                                        },
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$prodct_id",
                                            regex: search,
                                            options: "i",
                                        },
                                    },
                                ],
                            },
                            {
                                $or: [
                                    { $eq: [product_id, undefined] },
                                    { $eq: ["$_id", mongoose_1.default.Types.ObjectId(product_id)] },
                                ],
                            },
                            {
                                $or: [
                                    { $eq: [category_id, undefined] },
                                    {
                                        $eq: [
                                            "$category_id",
                                            mongoose_1.default.Types.ObjectId(category_id),
                                        ],
                                    },
                                ],
                            },
                            {
                                $or: [
                                    { $eq: [subcategory_id, undefined] },
                                    {
                                        $eq: [
                                            "$subcategory_id",
                                            mongoose_1.default.Types.ObjectId(subcategory_id),
                                        ],
                                    },
                                ],
                            },
                            {
                                $or: [
                                    { $eq: [sub_subcategory_id, undefined] },
                                    {
                                        $eq: [
                                            "$sub_subcategory_id",
                                            mongoose_1.default.Types.ObjectId(sub_subcategory_id),
                                        ],
                                    },
                                ],
                            },
                            {
                                $or: [
                                    { $eq: [brand_id, undefined] },
                                    { $eq: ["$brand_id", mongoose_1.default.Types.ObjectId(brand_id)] },
                                ],
                            },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: [min_price, undefined] },
                                            { $eq: [max_price, undefined] },
                                        ],
                                    },
                                    //   {
                                    //     $and: [
                                    //       { $gte: ["$discount_price", Number(min_price)] },
                                    //       { $lte: ["$discount_price", Number(max_price)] },
                                    //     ],
                                    //   },
                                    {
                                        $and: [
                                            { $gte: ["$price", Number(min_price)] },
                                            { $lte: ["$price", Number(max_price)] },
                                        ],
                                    },
                                ],
                            },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: [start_date, undefined] },
                                            { $eq: [end_date, undefined] },
                                        ],
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$created_at", start_date] },
                                            { $lt: ["$created_at", end_date] },
                                        ],
                                    },
                                ],
                            },
                            {
                                $or: [
                                    { $eq: [out_of_stock, undefined] },
                                    { $eq: ["$sold", stock_value] },
                                ],
                            },
                            {
                                $or: [
                                    { $eq: [quantity, undefined] },
                                    { $lte: ["$quantity", Number(quantity)] },
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
exports.filter_data = filter_data;
const group_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                prodct_id: { $first: "$prodct_id" },
                name: { $first: "$name" },
                description: { $first: "$description" },
                product_type: { $first: "$product_type" },
                added_by: { $first: "$retrive_seller" },
                parcel_id: { $first: "$parcel_id" },
                brand_id: { $first: "$retrive_brands" },
                category_id: { $first: "$retrive_categories" },
                subcategory_id: { $first: "$retrive_subcategories" },
                sub_subcategory_id: { $first: "$fetch_sub_subcategories" },
                images: { $first: "$images" },
                quantity: { $first: "$quantity" },
                price: { $first: "$price" },
                colour: { $first: "$colour" },
                size: { $first: "$size" },
                parent_id: { $first: "$parent_id" },
                tax_percantage: { $first: "$tax_percantage" },
                discount_percantage: { $first: "$discount_percantage" },
                discount: { $first: "$discount" },
                discount_price: { $first: "$discount_price" },
                total_reviews: { $first: "$total_reviews" },
                total_ratings: { $first: "$total_ratings" },
                average_rating: { $first: "$average_rating" },
                one_star_ratings: { $first: "$one_star_ratings" },
                two_star_ratings: { $first: "$two_star_ratings" },
                three_star_ratings: { $first: "$three_star_ratings" },
                four_star_ratings: { $first: "$four_star_ratings" },
                five_star_ratings: { $first: "$five_star_ratings" },
                sold: { $first: "$sold" },
                is_blocked: { $first: "$is_blocked" },
                is_deleted: { $first: "$is_deleted" },
                updated_at: { $first: "$updated_at" },
                created_at: { $first: "$created_at" },
                // productdetails : { "$first": "$created_at" },
                // product_services : { "$first": "$created_at" },
                // product_highlights : { "$first": "$product_highlights" },
                // product_variations : { "$first": "$product_variations" },
                // faqs_products : { "$first": "$faqs_products" },
                // ratings : { "$first": "$reviews" }
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_data = group_data;
let sort_data1 = (req_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { min_price, max_price } = req_data;
        if (min_price && max_price) {
            return {
                $sort: {
                    price: -1
                }
            };
        }
        else {
            return {
                $sort: {
                    _id: -1
                }
            };
        }
    }
    catch (err) {
        throw err;
    }
});
exports.sort_data1 = sort_data1;
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
const lookup_variant_head = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "products",
                let: { product_id: "$product_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$product_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            images: 1,
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
exports.lookup_variant_head = lookup_variant_head;
const unwind_variant_head = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$product",
                preserveNullAndEmptyArrays: true,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_variant_head = unwind_variant_head;
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
                                $eq: ["$_id", "$$product_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            images: 1,
                            quantity: 1,
                            price: 1,
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            product_name: { $first: "$name" },
                            product_images: { $first: "$images" },
                            product_quantity: { $first: "$quantity" },
                            product_price: { $first: "$price" },
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
const unwind_variant = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.unwind_variant = unwind_variant;
const group_variants_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                product_id: { $first: "$products._id" },
                product_name: { $first: "$products.product_name" },
                product_images: { $first: "$products.product_images" },
                product_quantity: { $first: "$products.product_quantity" },
                product_price: { $first: "$products.product_price" },
                // faqs_products : { "$first": "$faqs_products" },
                // ratings : { "$first": "$reviews" }
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_variants_data = group_variants_data;
// const product_details = async () => {
//     try {
//         return {
//             $lookup: {
//                 from: "productdetails",
//                 let: { product_id: "$_id" },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: {
//                                 $eq: ["$_id", "$$product_id"],
//                             },
//                         },
//                     },
//                     {
//                         $project: {
//                             __v: 0
//                         }
//                     }
//                 ],
//                 as: "product_details"
//             }
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// }
// const product_services = async () => {
//     try {
//         return {
//             $lookup: {
//                 from: "product_services",
//                 let: { product_id: "$_id" },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: {
//                                 $eq: ["$_id", "$$product_id"],
//                             },
//                         },
//                     },
//                     {
//                         $project: {
//                             __v: 0
//                         }
//                     }
//                 ],
//                 as: "product_services"
//             }
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// }
// const product_highlights = async () => {
//     try {
//         return {
//             $lookup: {
//                 from: "product_highlights",
//                 let: { product_id: "$_id" },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: {
//                                 $eq: ["$_id", "$$product_id"],
//                             },
//                         },
//                     },
//                     {
//                         $project: {
//                             __v: 0
//                         }
//                     }
//                 ],
//                 as: "product_highlights"
//             }
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// }
// const product_variations = async () => {
//     try {
//         return {
//             $lookup: {
//                 from: "product_variations",
//                 let: { product_id: "$_id" },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: {
//                                 $eq: ["$_id", "$$product_id"],
//                             },
//                         },
//                     },
//                     {
//                         $project: {
//                             __v: 0
//                         }
//                     }
//                 ],
//                 as: "product_variations"
//             }
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// }
// const faqs_products = async () => {
//     try {
//         return {
//             $lookup: {
//                 from: "faqs_products",
//                 let: { product_id: "$_id" },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: {
//                                 $eq: ["$_id", "$$product_id"],
//                             },
//                         },
//                     },
//                     {
//                         $project: {
//                             __v: 0
//                         }
//                     }
//                 ],
//                 as: "faqs_products"
//             }
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// }
// const reviews = async () => {
//     try {
//         return {
//             $lookup: {
//                 from: "reviews",
//                 let: { product_id: "$_id" },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: {
//                                 $eq: ["$_id", "$$product_id"],
//                             },
//                         },
//                     },
//                     {
//                         $project: {
//                             __v: 0
//                         }
//                     }
//                 ],
//                 as: "reviews"
//             }
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// }
