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
exports.limit_data = exports.skip_data = exports.sort_data = exports.group_invoice_data = exports.unwind_invoice = exports.lookup_order_invoice = exports.group_data = exports.lookup_reviews = exports.unwind_products = exports.lookup_product_invoice = exports.lookup_products = exports.unwind_address = exports.lookup_address = exports.unwind_users = exports.lookup_users = exports.unwind_sellers = exports.lookup_sellers = exports.unwind_orders = exports.lookup_order = exports.match = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const match = (order_id, seller_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                _id: mongoose_1.default.Types.ObjectId(order_id),
                seller_id: mongoose_1.default.Types.ObjectId(seller_id),
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match = match;
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
                            },
                        },
                    },
                    {
                        $project: {
                            _id: 1,
                            order_id: 1,
                            address_id: 1,
                            cancel_request_accepted: 1,
                            cancel_requested: 1,
                            cancellation_reason: 1,
                            description: 1,
                            created_at: 1,
                        },
                    },
                ],
                as: "orders",
            },
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
                preserveNullAndEmptyArrays: true,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_orders = unwind_orders;
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
                            },
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            image: 1,
                            full_address: 1,
                            pin_code: 1,
                            state: 1,
                            country: 1,
                            country_code: 1,
                            phone_number: 1,
                            company: 1,
                        },
                    },
                ],
                as: "sellers",
            },
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
                preserveNullAndEmptyArrays: true,
            },
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
                            },
                        },
                    },
                    {
                        $project: {
                            name: 1,
                            profile_pic: 1,
                            email: 1,
                            country_code: 1,
                            phone_no: 1,
                        },
                    },
                ],
                as: "users",
            },
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
                preserveNullAndEmptyArrays: true,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_users = unwind_users;
const lookup_address = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "addresses",
                let: { address_id: "$orders.address_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$_id", "$$address_id"],
                            },
                        },
                    },
                    {
                        $project: {
                            __v: 0,
                        },
                    },
                ],
                as: "address",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_address = lookup_address;
const unwind_address = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$address",
                preserveNullAndEmptyArrays: true,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_address = unwind_address;
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
                        $sort: {
                            updated_at: -1
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            prodct_id: 1,
                            name: 1,
                            description: 1,
                            images: 1,
                            price: 1,
                            discount_percantage: 1,
                            discount_price: 1,
                            brand_id: 1,
                        },
                    },
                    {
                        $lookup: {
                            from: "brands",
                            localField: "brand_id",
                            foreignField: "_id",
                            as: "brands",
                        },
                    },
                    {
                        $unwind: "$brands",
                    },
                    {
                        $lookup: {
                            from: "product_services",
                            localField: "_id",
                            foreignField: "product_id",
                            as: "product_services",
                        },
                    },
                    {
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
                                                    name: 1,
                                                    profile_pic: 1,
                                                },
                                            },
                                        ],
                                        as: "user_id",
                                    },
                                },
                                {
                                    $unwind: "$user_id",
                                },
                            ],
                            as: "reviews",
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            name: { $first: "$name" },
                            prod_id: { $first: "$prodct_id" },
                            description: { $first: "$description" },
                            images: { $first: "$images" },
                            actual_product_price: { $first: "$price" },
                            discount_percantage: { $first: "$discount_percantage" },
                            discount_price: { $first: "$discount_price" },
                            brand_id: { $first: "$brands" },
                            services: { $first: "$product_services" },
                            ratings: { $first: "$reviews" },
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
const unwind_products = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.unwind_products = unwind_products;
const lookup_reviews = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "reviews",
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
                        $lookup: {
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id",
                            as: "users",
                        },
                    },
                    {
                        $unwind: "$users",
                    },
                    {
                        $set: {
                            user_info: {
                                _id: "$users._id",
                                profile_pic: "$users.profile_pic",
                                name: "$users.name",
                            },
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            user_id: { $first: "$user_info" },
                            product_id: { $first: "$product_id" },
                            seller_id: { $first: "$seller_id" },
                            title: { $first: "$title" },
                            description: { $first: "$description" },
                            ratings: { $first: "$ratings" },
                            images: { $first: "$images" },
                            created_at: { $first: "$created_at" },
                        },
                    },
                    {
                        $sort: {
                            _id: -1,
                        },
                    },
                ],
                as: "reviews",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_reviews = lookup_reviews;
const lookup_order_invoice = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "order_invoices",
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$order_product_id", mongoose_1.default.Types.ObjectId(order_id)],
                            },
                        },
                    }
                ],
                as: "invoice",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_order_invoice = lookup_order_invoice;
const unwind_invoice = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$invoice",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_invoice = unwind_invoice;
const lookup_product_invoice = () => __awaiter(void 0, void 0, void 0, function* () {
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
                            prodct_id: 1,
                            name: 1,
                            description: 1,
                            images: 1,
                            brand_id: 1,
                            category_id: 1
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
                            from: "subcategories",
                            localField: "category_id",
                            foreignField: "category_id",
                            as: "subcategories",
                        },
                    },
                    {
                        $unwind: "$subcategories",
                    },
                    {
                        $lookup: {
                            from: "brands",
                            localField: "brand_id",
                            foreignField: "_id",
                            as: "brands",
                        },
                    },
                    {
                        $unwind: "$brands",
                    },
                    {
                        $lookup: {
                            from: "product_services",
                            localField: "_id",
                            foreignField: "product_id",
                            as: "product_services",
                        },
                    },
                    {
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
                                                    name: 1,
                                                    profile_pic: 1,
                                                },
                                            },
                                        ],
                                        as: "user_detail",
                                    },
                                },
                                {
                                    $unwind: "$user_detail",
                                },
                            ],
                            as: "reviews",
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            name: { $first: "$name" },
                            prod_id: { $first: "$prodct_id" },
                            description: { $first: "$description" },
                            images: { $first: "$images" },
                            brand_id: { $first: "$brands" },
                            subcategory: { $first: "$subcategories" },
                            services: { $first: "$product_services" },
                            ratings: { $first: "$reviews" },
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
exports.lookup_product_invoice = lookup_product_invoice;
// const lookup_brands = async () => {
//     try {
//         return {
//             $lookup: {
//                 from: "brands",
//                 let: { brand_id: "$products.brand_id" },
//                 pipeline: [
//                     {
//                         $match: {
//                             $expr: {
//                                 $eq: ["$_id", "$$brand_id"],
//                             }
//                         }
//                     },
//                     {
//                         $project: {
//                             name: 1
//                         }
//                     }
//                 ],
//                 as: "brands"
//             }
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// }
// const unwind_brands = async () => {
//     try {
//         return {
//             $unwind: {
//                 path: "$brands",
//                 preserveNullAndEmptyArrays: true
//             }
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// }
const group_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                invoice_id: { $first: "$invoice._id" },
                order_object_id: { $first: "$orders._id" },
                order_id: { $first: "$orders.order_id" },
                product_id: { $first: "$products" },
                user_id: { $first: "$users" },
                address_id: { $first: "$address_data" },
                seller_id: { $first: "$sellers" },
                quantity: { $first: "$quantity" },
                actual_product_price: { $first: "$price" },
                discount_percantage: { $first: "$discount_percantage" },
                discount_price: { $first: "$discount_price" },
                price: { $first: "$price" },
                delivery_price: { $first: "$delivery_price" },
                coupon_discount: { $first: "$coupon_discount" },
                total_price: { $first: "$total_price" },
                total_earnings: { $first: "$total_earnings" },
                admin_commision: { $first: "$admin_commision" },
                tax_percentage: { $first: "$tax_percentage" },
                shippo_data: { $first: "$shippo_data" },
                order_status: { $first: "$order_status" },
                tracking_link: { $first: "$tracking_link" },
                delivery_date: { $first: "$delivery_date" },
                cancel_request_accepted: { $first: "$cancel_request_accepted" },
                cancel_requested: { $first: "$cancel_requested" },
                cancel_description: { $first: "$description" },
                cancel_reason: { $first: "$cancellation_reason" },
                // reviews: { "$first": "$reviews" },
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
const group_invoice_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                invoice_id: { $first: "$invoice.invoice_id" },
                tax_no: { $first: "$tax_no" },
                order_object_id: { $first: "$orders._id" },
                order_id: { $first: "$orders.order_id" },
                product_id: { $first: "$products" },
                user_id: { $first: "$users" },
                address_id: { $first: "$address_data" },
                seller_id: { $first: "$sellers" },
                quantity: { $first: "$quantity" },
                price: { $first: "$price" },
                delivery_price: { $first: "$delivery_price" },
                coupon_discount: { $first: "$coupon_discount" },
                total_price: { $first: "$total_price" },
                your_earning: { $first: "$total_earnings" },
                admin_commision: { $first: "$admin_commision" },
                tax_percantage: { $first: "$tax_percentage" },
                tax_amount: { $first: "$tax_amount" },
                shippo_data: { $first: "$shippo_data" },
                order_status: { $first: "$order_status" },
                // delivery_status: { $first: "$delivery_status" },
                delivery_date: { $first: "$delivery_date" },
                invoice_date: { $first: "$invoice.created_at" },
                reviews: { $first: "$reviews" },
                updated_at: { $first: "$updated_at" },
                created_at: { $first: "$created_at" },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_invoice_data = group_invoice_data;
let sort_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $sort: {
                _id: -1,
            },
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
            $skip: set_pagination * set_limit,
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
            $limit: set_limit,
        };
    }
    catch (err) {
        throw err;
    }
});
exports.limit_data = limit_data;
