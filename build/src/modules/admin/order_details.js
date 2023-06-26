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
exports.lookup_order_reviews = exports.group_data1 = exports.lookup_ordered_products = exports.match_data = exports.group_variants_data = exports.unwind_variants = exports.lookup_variants = exports.match_variant_product_id = exports.lookup_ordered_invoice = exports.limit_data = exports.skip_data = exports.sort_data = exports.group_order_items = exports.group_data = exports.group_invoice_data = exports.unwind_invoice = exports.lookup_order_invoice = exports.lookup_product_invoice = exports.lookup_reviews = exports.unwind_products = exports.lookup_product_order_item = exports.lookup_products = exports.unwind_address = exports.lookup_order_address = exports.lookup_address = exports.unwind_users = exports.lookup_users = exports.unwind_sellers = exports.lookup_sellers = exports.unwind_orders = exports.lookup_order = exports.match_order_id = exports.match = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const match = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                _id: mongoose_1.default.Types.ObjectId(order_id),
                // seller_id: mongoose.Types.ObjectId(seller_id)
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match = match;
const match_order_id = (order_id, _id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                order_id: mongoose_1.default.Types.ObjectId(order_id),
                _id: { $ne: mongoose_1.default.Types.ObjectId(_id) }
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_order_id = match_order_id;
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
                    },
                    {
                        $project: {
                            _id: 1,
                            order_id: 1,
                            address_id: 1,
                            user_id: 1
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
                            }
                        }
                    },
                    {
                        $project: {
                            __v: 0
                        }
                    }
                ],
                as: "address"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_address = lookup_address;
const lookup_order_address = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.lookup_order_address = lookup_order_address;
const unwind_address = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$address",
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_address = unwind_address;
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
                            category_id: 1,
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
                    },
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
                preserveNullAndEmptyArrays: true,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_invoice = unwind_invoice;
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
                            brand_id: 1,
                            discount_percantage: 1,
                            discount_price: 1,
                            price: 1,
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
                            description: { $first: "$description" },
                            images: { $first: "$images" },
                            discount_percantage: { $first: "$discount_percantage" },
                            discount_price: { $first: "$discount_price" },
                            price: { $first: "$price" },
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
const lookup_product_order_item = () => __awaiter(void 0, void 0, void 0, function* () {
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
                            discount_percantage: 1,
                            discount_price: 1,
                            price: 1,
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
                        $group: {
                            _id: "$_id",
                            price: { $first: "$price" },
                            prd_id: { $first: "$prodct_id" },
                            name: { $first: "$name" },
                            description: { $first: "$description" },
                            images: { $first: "$images" },
                            actual_price: { $first: "$price" },
                            discount_percantage: { $first: "$discount_percantage" },
                            discount_price: { $first: "$discount_price" },
                            // product_quantity: { $first: "$quantity" },
                            category_name: { $first: "$categories.name" },
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
exports.lookup_product_order_item = lookup_product_order_item;
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
                                $eq: ["$product_id", "$$product_id"],
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id",
                            as: "users"
                        }
                    },
                    {
                        $unwind: "$users"
                    },
                    {
                        $set: {
                            user_info: {
                                "_id": "$users._id",
                                "profile_pic": "$users.profile_pic",
                                "name": "$users.name"
                            }
                        }
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
                            created_at: { $first: "$created_at" }
                        }
                    },
                    {
                        $sort: {
                            _id: -1
                        }
                    }
                ],
                as: "reviews"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_reviews = lookup_reviews;
const lookup_order_reviews = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "reviews",
                let: { product_id: "$product_id", user_id: "$user_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ["$user_id", "$$user_id"] },
                                    { $eq: ["$product_id", "$$product_id"] }
                                ]
                            }
                        }
                    },
                    {
                        $lookup: {
                            from: "users",
                            localField: "user_id",
                            foreignField: "_id",
                            as: "users"
                        }
                    },
                    {
                        $unwind: "$users"
                    },
                    {
                        $set: {
                            user_info: {
                                "_id": "$users._id",
                                "profile_pic": "$users.profile_pic",
                                "name": "$users.name"
                            }
                        }
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
                            created_at: { $first: "$created_at" }
                        }
                    },
                    {
                        $sort: {
                            _id: -1
                        }
                    }
                ],
                as: "reviews"
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_order_reviews = lookup_order_reviews;
// const unwind_reviews = async () => {
//     try {
//         return {
//             $unwind: {
//                 path: "$reviews",
//                 preserveNullAndEmptyArrays: true
//             }
//         };
//     }
//     catch (err) {
//         throw err;
//     }
// }
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
                order_object_id: { $first: "$orders._id" },
                order_id: { $first: "$orders.order_id" },
                product_order_id: { $first: "$product_order_id" },
                product_id: { $first: "$products" },
                user_id: { $first: "$users" },
                address_id: { $first: "$address_data" },
                seller_id: { $first: "$sellers" },
                quantity: { $first: "$quantity" },
                price: { $first: "$price" },
                actual_product_price: { $first: "$price" },
                product_discount_percentage: { $first: "$discount_percantage" },
                product_discount_price: { $first: "$discount_price" },
                delivery_price: { $first: "$delivery_price" },
                coupon_discount: { $first: "$coupon_discount" },
                total_price: { $first: "$total_price" },
                tax_percentage: { $first: "$tax_percentage" },
                tax_amount: { $first: "$tax_amount" },
                admin_commision: { $first: "$admin_commision" },
                seller_earnings: { $first: "$total_earnings" },
                shippo_data: { $first: "$shippo_data" },
                order_status: { $first: "$order_status" },
                payment_status: { $first: "$payment_status" },
                tracking_link: { $first: "$tracking_link" },
                delivery_date: { $first: "$delivery_date" },
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
exports.group_data = group_data;
const group_order_items = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                order_object_id: { "$first": "$order_id" },
                order_id: { "$first": "$orders.order_id" },
                product_order_id: { "$first": "$product_order_id" },
                product_id: { "$first": "$products" },
                user_id: { "$first": "$users" },
                // address_id: { "$first": "$address" },
                seller_id: { "$first": "$sellers" },
                quantity: { "$first": "$quantity" },
                price: { "$first": "$price" },
                delivery_price: { "$first": "$delivery_price" },
                coupon_discount: { "$first": "$coupon_discount" },
                total_price: { "$first": "$total_price" },
                tax_percentage: { "$first": "$tax_percentage" },
                tax_amount: { "$first": "$tax_amount" },
                admin_commision: { $first: "$admin_commision" },
                shippo_data: { "$first": "$shippo_data" },
                order_status: { "$first": "$order_status" },
                payment_status: { "$first": "$payment_status" },
                tracking_link: { "$first": "$tracking_link" },
                delivery_date: { "$first": "$delivery_date" },
                // reviews: { "$first": "$reviews" },
                updated_at: { "$first": "$updated_at" },
                created_at: { "$first": "$created_at" },
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_order_items = group_order_items;
const match_data = (_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                _id: mongoose_1.default.Types.ObjectId(_id),
                // user_id: mongoose.Types.ObjectId(user_id),
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_data = match_data;
const lookup_ordered_products = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "order_products",
                let: { order_id: "$_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$order_id", "$$order_id"],
                            },
                        },
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
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        name: 1,
                                        description: 1,
                                        images: 1,
                                        prodct_id: 1
                                    },
                                },
                            ],
                            as: "products",
                        },
                    },
                    {
                        $unwind: {
                            path: "$products",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            order_id: { $first: "$order_id" },
                            product_order_id: { $first: "$product_order_id" },
                            product_id: { $first: "$product_id" },
                            tax_no: { $first: "$tax_no" },
                            quantity: { $first: "$quantity" },
                            price: { $first: "$price" },
                            discount_percantage: { $first: "$discount_percantage" },
                            discount_price: { $first: "$discount_price" },
                            delivery_price: { $first: "$delivery_price" },
                            coupon_discount: { $first: "$coupon_discount" },
                            total_price: { $first: "$total_price" },
                            total_earnings: { $first: "$total_earnings" },
                            admin_commision: { $first: "$admin_commision" },
                            tax_percentage: { $first: "$tax_percentage" },
                            tax_amount: { $first: "$tax_amount" },
                            order_status: { $first: "$order_status" },
                            previous_status: { $first: "$previous_status" },
                            cancellation_reason: { $first: "$cancellation_reason" },
                            cancel_requested: { $first: "$cancel_requested" },
                            cancel_request_accepted: { $first: "$cancel_request_accepted" },
                            payment_status: { $first: "$payment_status" },
                            tracking_link: { $first: "$tracking_link" },
                            products: { $first: "$products" },
                            updated_at: { $first: "$updated_at" },
                            shipped_at: { $first: "$shipped_at" },
                            delivery_date: { $first: "$delivery_date" },
                            cancelled_at: { $first: "$cancelled_at" },
                            created_at: { $first: "$created_at" },
                            address_data: { $first: "$address_data" },
                        },
                    },
                ],
                as: "order_products",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_ordered_products = lookup_ordered_products;
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
const group_data1 = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$_id",
                payment_mode: { $first: "$payment_mode" },
                order_id: { $first: "$order_id" },
                order_products: { $first: "$order_products" },
                // product_id: { $first: "$products" },
                address_id: { $first: { "$arrayElemAt": ["$order_products.address_data", 0] } },
                created_at: { $first: "$created_at" },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_data1 = group_data1;
const lookup_ordered_invoice = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "order_products",
                // let: { order_id: order_id, user_id: user_id },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$order_id", mongoose_1.default.Types.ObjectId(order_id)],
                                    },
                                    // {
                                    //   $eq: ["$user_id", user_id],
                                    // },
                                ],
                            },
                        },
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
                                        added_by: 1,
                                        category_id: 1,
                                        subcategory_id: 1,
                                        brand_id: 1,
                                    },
                                },
                                {
                                    $lookup: {
                                        from: "sellers",
                                        let: { seller_id: "$added_by" },
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
                                                    city: 1,
                                                    country: 1,
                                                    country_code: 1,
                                                    phone_number: 1,
                                                    company: 1,
                                                },
                                            },
                                        ],
                                        as: "seller",
                                    },
                                },
                                {
                                    $unwind: {
                                        path: "$seller",
                                        preserveNullAndEmptyArrays: true,
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
                                        localField: "subcategory_id",
                                        foreignField: "_id",
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
                                //       {
                                //         $lookup: {
                                //           from: "product_services",
                                //           localField: "_id",
                                //           foreignField: "product_id",
                                //           as: "product_services",
                                //         },
                                //       },
                            ],
                            as: "products",
                        },
                    },
                    {
                        $unwind: {
                            path: "$products",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $lookup: {
                            from: "order_invoices",
                            let: { order_id: "$_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$order_product_id", "$$order_id"],
                                        },
                                    },
                                },
                                {
                                    $project: {
                                        _id: 1,
                                        invoice_id: 1,
                                        created_at: 1,
                                    },
                                },
                            ],
                            as: "invoice",
                        },
                    },
                    {
                        $unwind: {
                            path: "$invoice",
                            preserveNullAndEmptyArrays: true,
                        },
                    },
                    {
                        $group: {
                            _id: "$_id",
                            tax_no: { $first: "$tax_no" },
                            invoice_id: { $first: "$invoice.invoice_id" },
                            product_id: { $first: "$products.prodct_id" },
                            product_name: { $first: "$products.name" },
                            description: { $first: "$products.description" },
                            category_name: { $first: "$products.categories.name" },
                            subcategory_name: { $first: "$products.subcategories.name" },
                            brand_name: { $first: "$products.brands.name" },
                            seller_name: { $first: "$products.seller.name" },
                            seller_country_code: { $first: "$products.seller.country_code" },
                            seller_phn_no: { $first: "$products.seller.phone_number" },
                            seller_pincode: { $first: "$products.seller.pin_code" },
                            seller_company: { $first: "$products.seller.company" },
                            seller_city: { $first: "$products.seller.city" },
                            seller_state: { $first: "$products.seller.state" },
                            seller_country: { $first: "$products.seller.country" },
                            seller_full_address: { $first: "$products.seller.full_address" },
                            quantity: { $first: "$quantity" },
                            price: { $first: "$price" },
                            delivery_price: { $first: "$delivery_price" },
                            coupon_discount: { $first: "$coupon_discount" },
                            total_price: { $first: "$total_price" },
                            tax_percentage: { $first: "$tax_percentage" },
                            tax_amount: { $first: "$tax_amount" },
                            invoice_date: { $first: "$invoice.created_at" },
                            // quantity: { $first: "$quantity" },
                            // quantity: { $first: "$quantity" },
                            // quantity: { $first: "$quantity" },
                        },
                    },
                    //   {
                    //     $group: {
                    //       _id: "$_id",
                    //         name: { $first: "$products.name" },
                    //         description: { $first: "$products.description" },
                    //         images: { $first: "$products.images" },
                    //         seller: { $first: "$products.seller" },
                    //     },
                    //   },
                ],
                as: "order_products",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_ordered_invoice = lookup_ordered_invoice;
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
                                $eq: ["$_id", "$$product_id"],
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
