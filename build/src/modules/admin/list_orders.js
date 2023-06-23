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
exports.sortOrder_data = exports.sorting_data = exports.sort_order_data = exports.filter_search = exports.set_seller_type = exports.set_type = exports.filter_sorting = exports.limit_data = exports.skip_data = exports.sort_data = exports.group_orderReview_data = exports.group_data = exports.filter_reviews_data = exports.filter_data = exports.unwind_Rev_sellers = exports.lookup_Rev_sellers = exports.unwind_order_review = exports.lookup_order_review = exports.unwind_order_products = exports.lookup_order_product_review = exports.lookup_order_products = exports.unwind_orders = exports.lookup_order = exports.unwind_products = exports.lookup_products_review = exports.lookup_products = exports.unwind_users = exports.lookup_users = exports.unwind_sellers = exports.lookup_sellers = exports.match_delete = exports.match = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const moment_1 = __importDefault(require("moment"));
const match = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                user_id: mongoose_1.default.Types.ObjectId(user_id)
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match = match;
const match_delete = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                is_deleted: false,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_delete = match_delete;
const set_type = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        $set: {
            type: "USER"
        },
    };
});
exports.set_type = set_type;
const set_seller_type = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        $set: {
            type: "SELLER"
        },
    };
});
exports.set_seller_type = set_seller_type;
const lookup_sellers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "sellers",
                let: { seller_id: "$seller_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$seller_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            image: 1
                        }
                    }
                ],
                as: "sellers"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_sellers = lookup_sellers;
const unwind_sellers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$sellers",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_sellers = unwind_sellers;
const lookup_users = () => __awaiter(void 0, void 0, void 0, function* () {
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
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            profile_pic: 1
                        }
                    }
                ],
                as: "users"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_users = lookup_users;
const unwind_users = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$users",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_users = unwind_users;
const lookup_products = () => __awaiter(void 0, void 0, void 0, function* () {
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
                            _id: 1,
                            name: 1,
                            description: 1,
                            images: 1,
                            category_id: 1,
                            prodct_id: 1,
                            quantity: 1,
                        },
                    },
                    {
                        $lookup: {
                            from: "categories",
                            localField: "category_id",
                            foreignField: "_id",
                            as: "categories",
                        },
                    },
                    {
                        $unwind: "$categories",
                    },
                    {
                        $lookup: {
                            from: "reviews",
                            localField: "_id",
                            foreignField: "product_id",
                            as: "reviews",
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            prd_id: { $first: "$prodct_id" },
                            name: { $first: "$name" },
                            description: { $first: "$description" },
                            images: { $first: "$images" },
                            product_quantity: { $first: "$quantity" },
                            category_id: { $first: "$categories" },
                            reviews: { $first: "$reviews" },
                            total_ratings: { $first: { $sum: "$reviews.ratings" } },
                            total_reviews: { $first: { $size: "$reviews" } },
                            total_avg_rating: { $first: { $avg: "$reviews.ratings" } },
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
exports.lookup_products = lookup_products;
const lookup_products_review = () => __awaiter(void 0, void 0, void 0, function* () {
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
                            _id: 1,
                            name: 1,
                            description: 1,
                            images: 1,
                            category_id: 1,
                            prodct_id: 1,
                            quantity: 1,
                            discount_price: 1,
                        },
                    },
                    {
                        $lookup: {
                            from: "categories",
                            localField: "category_id",
                            foreignField: "_id",
                            as: "categories",
                        },
                    },
                    {
                        $unwind: "$categories",
                    },
                    //   {
                    //     $lookup: {
                    //       from: "reviews",
                    //       localField: "_id",
                    //       foreignField: "product_id",
                    //       as: "reviews",
                    //     },
                    //   },
                    {
                        $group: {
                            _id: "$_id",
                            prd_id: { $first: "$prodct_id" },
                            name: { $first: "$name" },
                            description: { $first: "$description" },
                            images: { $first: "$images" },
                            //   product_quantity: { $first: "$quantity" },
                            product_price: { $first: "$discount_price" },
                            category_name: { $first: "$categories.name" },
                            //   reviews: { $first: "$reviews" },
                            //   total_ratings: { $first: { $sum: "$reviews.ratings" } },
                            //   total_reviews: { $first: { $size: "$reviews" } },
                            //   total_avg_rating: { $first: { $avg: "$reviews.ratings" } },
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
exports.lookup_products_review = lookup_products_review;
const unwind_products = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$products",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_products = unwind_products;
const lookup_order = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "orders",
                let: { order_id: "$order_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$order_id"],
                            }
                        }
                    }
                ],
                as: "orders"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_order = lookup_order;
const unwind_orders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$orders",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_orders = unwind_orders;
const lookup_order_products = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "order_products",
                let: { product_id: "$product_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$product_id", "$$product_id"],
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "products",
                            let: { product_id: "$product_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", "$$product_id"],
                                        }
                                    }
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1,
                                        description: 1,
                                        images: 1,
                                        category_id: 1,
                                        prodct_id: 1,
                                        quantity: 1,
                                    }
                                },
                                {
                                    $lookup: {
                                        from: "categories",
                                        localField: "category_id",
                                        foreignField: "_id",
                                        as: "categories"
                                    }
                                },
                                {
                                    $unwind: "$categories"
                                },
                                {
                                    $group: {
                                        _id: "$_id",
                                        prd_id: { $first: "$prodct_id" },
                                        name: { $first: "$name" },
                                        description: { $first: "$description" },
                                        images: { $first: "$images" },
                                        product_quantity: { $first: "$quantity" },
                                        category_id: { $first: "$categories" },
                                    }
                                }
                            ],
                            as: "products"
                        }
                    }
                ],
                as: "orders"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_order_products = lookup_order_products;
const lookup_order_product_review = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "order_products",
                let: { product_id: "$product_id", order_product_id: "$order_product_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$product_id", "$$product_id"] },
                                    { $eq: ["$_id", "$$order_product_id"] }
                                ]
                            }
                        }
                    },
                    // {
                    //     $lookup: {
                    //         from: "products",
                    //         let: { product_id: "$product_id" },
                    //         pipeline: [
                    //             {
                    //                 $match: {
                    //                     $expr: {
                    //                         $eq: ["$_id", "$$product_id"],
                    //                     }
                    //                 }
                    //             },
                    //             {
                    //                 $project: {
                    //                     _id: 1,
                    //                     name: 1,
                    //                     description: 1,
                    //                     images: 1,
                    //                     category_id : 1,
                    //                     prodct_id:1,
                    //                     quantity:1,
                    //                 }
                    //             },
                    //             {
                    //                 $lookup : {
                    //                     from : "categories",
                    //                     localField : "category_id",
                    //                     foreignField : "_id",
                    //                     as : "categories"
                    //                 }
                    //             },
                    //             {
                    //                 $unwind : "$categories"
                    //             },
                    //             {
                    //                 $group : {
                    //                     _id : "$_id",
                    //                     prd_id:{$first:"$prodct_id"},
                    //                     name: { $first : "$name" },
                    //                     description: { $first : "$description" },
                    //                     images: { $first : "$images" },
                    //                     product_quantity: { $first : "$quantity" },
                    //                     category_id : { $first : "$categories" },
                    //                 }
                    //             }
                    //         ],
                    //         as: "products"
                    //     }
                    // }
                ],
                as: "orders"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_order_product_review = lookup_order_product_review;
const unwind_order_products = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$orders",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_order_products = unwind_order_products;
const lookup_order_review = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "orders",
                let: { order_id: "$order_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$order_id"]
                            }
                        }
                    },
                ],
                as: "order_data"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_order_review = lookup_order_review;
const unwind_order_review = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$order_data",
                preserveNullAndEmptyArrays: true,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_order_review = unwind_order_review;
const lookup_Rev_sellers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "sellers",
                let: { seller_id: "$seller_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$seller_id", "$$seller_id"],
                            }
                        }
                    },
                    {
                        $project: {
                            name: 1,
                            image: 1
                        }
                    }
                ],
                as: "sellers"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_Rev_sellers = lookup_Rev_sellers;
const unwind_Rev_sellers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$sellers",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_Rev_sellers = unwind_Rev_sellers;
const filter_data = (payload_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('admin order payload ', payload_data);
        let { search, product_id, seller_id, category_id: cat_level_1, subcategory_id: cat_level_2, sub_subcategory_id: cat_level_3, brand_id, min_price, max_price, order_status, payment_status, start_date, end_date, stock } = payload_data;
        let set_start_date = moment_1.default.utc(start_date, "DD/MM/YYYY").startOf('day').format('x');
        let set_end_date = moment_1.default.utc(end_date, "DD/MM/YYYY").endOf('day').format('x');
        console.log("start_date...", start_date);
        console.log("end_date...", end_date);
        let stock_min, stock_max;
        if (stock == "OUT_OF_STOCK") {
            stock_min = 0;
            stock_max = 0;
        }
        else if (stock == "ALERT_OF_STOCK") {
            stock_min = 1;
            stock_max = 5;
        }
        if (order_status == 'ALL') {
            order_status = undefined;
        }
        else if (order_status == "CONFIRMED") {
            order_status = "PLACED";
        }
        let brands = [];
        if (typeof brand_id == "object") {
            for (let value of brand_id) {
                brands.push(mongoose_1.default.Types.ObjectId(value));
            }
        }
        else if (typeof brand_id == "string") {
            brands.push(mongoose_1.default.Types.ObjectId(brand_id));
        }
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
                                            input: "$order_id",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$user_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$seller_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$product_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$product_id.prd_id",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$orderedId",
                                            regex: search,
                                            options: "i",
                                        }
                                    }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [cat_level_1, undefined] },
                                    { $eq: ["$category_id", mongoose_1.default.Types.ObjectId(cat_level_1)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [cat_level_2, undefined] },
                                    { $eq: ["$subcategory_id", mongoose_1.default.Types.ObjectId(cat_level_2)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [cat_level_3, undefined] },
                                    { $eq: ["$sub_subcategory_id", mongoose_1.default.Types.ObjectId(cat_level_3)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [product_id, undefined] },
                                    { $eq: ["$product_id._id", mongoose_1.default.Types.ObjectId(product_id)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [brand_id, undefined] },
                                    { $in: ["$brand_id", brands] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [order_status, undefined] },
                                    { $eq: ["$order_status", order_status] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [payment_status, undefined] },
                                    { $eq: ["$payment_status", payment_status] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [seller_id, undefined] },
                                    { $eq: ["$sellerId", mongoose_1.default.Types.ObjectId(seller_id)] }
                                ]
                            },
                            {
                                $or: [
                                    { $eq: [stock, undefined] },
                                    {
                                        $and: [
                                            { $gte: ["$product_quantity", stock_min] },
                                            { $lte: ["$product_quantity", stock_max] }
                                        ]
                                    }
                                    // { $lte: ["$product_quantity", stock] }
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
                                            { $gte: ["$total_price", Number(min_price)] },
                                            { $lt: ["$total_price", Number(max_price)] }
                                        ]
                                    }
                                ]
                            },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: [start_date, undefined] },
                                            { $eq: [end_date, undefined] }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$created_at", start_date] },
                                            { $lt: ["$created_at", end_date] }
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
const filter_reviews_data = (payload_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('admin order payload ', payload_data);
        let { search, min_price, max_price, start_date, end_date } = payload_data;
        let set_start_date = moment_1.default.utc(start_date, "DD/MM/YYYY").startOf('day').format('x');
        let set_end_date = moment_1.default.utc(end_date, "DD/MM/YYYY").endOf('day').format('x');
        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    { $eq: [search, undefined] },
                                    // {
                                    //     $regexMatch: {
                                    //         input: "$order_id",
                                    //         regex: search,
                                    //         options: "i",
                                    //     }
                                    // },
                                    {
                                        $regexMatch: {
                                            input: "$user_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$seller_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$product_id.name",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$product_id.prd_id",
                                            regex: search,
                                            options: "i",
                                        }
                                    }
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
                                            { $gte: ["$product_id.product_price", Number(min_price)] },
                                            { $lt: ["$product_id.product_price", Number(max_price)] }
                                        ]
                                    }
                                ]
                            },
                            {
                                $or: [
                                    {
                                        $and: [
                                            { $eq: [start_date, undefined] },
                                            { $eq: [end_date, undefined] }
                                        ]
                                    },
                                    {
                                        $and: [
                                            { $gte: ["$created_at", start_date] },
                                            { $lt: ["$created_at", end_date] }
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
exports.filter_reviews_data = filter_reviews_data;
const filter_search = (payload_data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('list user_seller ', payload_data);
        let { search } = payload_data;
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
                                        }
                                    },
                                    {
                                        $regexMatch: {
                                            input: "$email",
                                            regex: search,
                                            options: "i",
                                        }
                                    },
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
exports.filter_search = filter_search;
const filter_sorting = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { filter_by } = payload;
        console.log("SORT Data type", typeof filter_by, " --> ", filter_by);
        if (filter_by == 1) {
            console.log(filter_by == 1);
            return {
                $sort: {
                    _id: -1,
                },
            };
        }
        else if (filter_by == 2) {
            console.log(filter_by == 2);
            return {
                $sort: {
                    _id: 1,
                },
            };
        }
        else {
            return {
                $sort: {
                    created_at: -1,
                },
            };
        }
    }
    catch (err) {
        throw err;
    }
});
exports.filter_sorting = filter_sorting;
const group_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                order_id: { $first: "$orders.order_id" },
                orderedId: { $first: "$orders.order_id" },
                user_id: { $first: "$users" },
                seller_id: { $first: "$sellers" },
                product_id: { $first: "$products" },
                sellerId: { $first: "$sellers._id" },
                categoryId: { $first: "$products.category_id._id" },
                product_quantity: { "$first": "$products.product_quantity" },
                // price: { "$first": "$products" },
                // delivery_price: { "$first": "$products" },
                // coupon_discount: { "$first": "$products" },
                total_price: { $first: "$total_price" },
                total_earnings: { $first: "$total_earnings" },
                admin_commision: { $first: "$admin_commision" },
                // shippo_data: shippo_data,
                order_status: { $first: "$order_status" },
                payment_status: { $first: "$payment_status" },
                // delivery_status: { "$first": "$products" },
                // delivery_date: { "$first": "$products" },
                updated_at: { $first: "$updated_at" },
                created_at: { $first: "$created_at" },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_data = group_data;
const group_orderReview_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                title: { $first: "$title" },
                description: { $first: "$description" },
                ratings: { $first: "$ratings" },
                images: { $first: "$images" },
                // order_id: { $first: "$order_data.order_id" },
                // orderedId: { $first: "$orders.order_id" },
                user_id: { $first: "$users" },
                seller_id: { $first: "$sellers" },
                product_id: { $first: "$products" },
                product_order_id: { $first: "$orders.product_order_id" },
                // delivery_price: { "$first": "$products" },
                // coupon_discount: { "$first": "$products" },
                price: { $first: "$products.product_price" },
                // total_earnings: { $first: "$orders.total_earnings" },
                // admin_commision: { $first: "$orders.admin_commision" },
                // shippo_data: shippo_data,
                // delivery_status: { "$first": "$products" },
                // delivery_date: { "$first": "$products" },
                updated_at: { $first: "$updated_at" },
                created_at: { $first: "$created_at" },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_orderReview_data = group_orderReview_data;
let sort_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $sort: {
                updated_at: -1
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.sort_data = sort_data;
let sorting_data = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { min_price, max_price } = data;
        if (min_price && max_price) {
            return {
                $sort: {
                    price: 1,
                },
            };
        }
        else {
            return {
                $sort: {
                    updated_at: -1,
                },
            };
        }
    }
    catch (err) {
        throw err;
    }
});
exports.sorting_data = sorting_data;
let sort_order_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $sort: {
                updated_at: -1,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.sort_order_data = sort_order_data;
let sortOrder_data = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { min_price, max_price } = data;
        if (min_price && max_price) {
            return {
                $sort: {
                    total_price: 1,
                },
            };
        }
        else {
            return {
                $sort: {
                    updated_at: -1,
                },
            };
        }
    }
    catch (err) {
        throw err;
    }
});
exports.sortOrder_data = sortOrder_data;
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
