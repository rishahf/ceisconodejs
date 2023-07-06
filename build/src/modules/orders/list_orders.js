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
exports.limit_data = exports.skip_data = exports.sort_data = exports.filter_data = exports.group_data = exports.unwind_products = exports.lookup_reviewd_products = exports.lookup_products = exports.unwind_order_products = exports.lookup_order_products = exports.match_data = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const match_data = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                user_id: mongoose_1.default.Types.ObjectId(user_id),
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_data = match_data;
const lookup_order_products = () => __awaiter(void 0, void 0, void 0, function* () {
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
                ],
                as: "order_products",
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.lookup_order_products = lookup_order_products;
const unwind_order_products = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $unwind: {
                path: "$order_products",
                preserveNullAndEmptyArrays: true,
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_order_products = unwind_order_products;
const lookup_products = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "products",
                let: { product_id: "$order_products.product_id" },
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
                        },
                    },
                    {
                        $lookup: {
                            from: "reviews",
                            let: { product_id: "$_id", },
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
const lookup_reviewd_products = (user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $lookup: {
                from: "products",
                let: { product_id: "$order_products.product_id" },
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
                        },
                    },
                    {
                        $lookup: {
                            from: "reviews",
                            let: { product_id: "$_id", user_id: user_id },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            // $eq: ["$product_id", "$$product_id"],
                                            $and: [
                                                {
                                                    $eq: ["$product_id", "$$product_id"],
                                                },
                                                {
                                                    $eq: ["$user_id", "$$user_id"],
                                                },
                                            ],
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
                        $unwind: {
                            path: "$reviews",
                            preserveNullAndEmptyArrays: true,
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
exports.lookup_reviewd_products = lookup_reviewd_products;
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
const group_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$order_products._id",
                orderId: { $first: "$order_id" },
                productOrderId: { $first: "$order_products.product_order_id" },
                order_id: { $first: "$order_products.order_id" },
                user_id: { $first: "$user_id" },
                seller_id: { $first: "$order_products.seller_id" },
                product_id: { $first: "$products" },
                quantity: { $first: "$order_products.quantity" },
                price: { $first: "$order_products.price" },
                delivery_price: { $first: "$order_products.delivery_price" },
                coupon_discount: { $first: "$order_products.coupon_discount" },
                total_price: { $first: "$order_products.total_price" },
                total_earnings: { $first: "$order_products.total_earnings" },
                shippo_data: { $first: "$order_products.shippo_data" },
                order_status: { $first: "$order_products.order_status" },
                tracking_link: { $first: "$order_products.tracking_link" },
                stripe_data: { $first: "$stripe_data" },
                updated_at: { $first: "$order_products.updated_at" },
                shipped_at: { $first: "$order_products.shipped_at" },
                delivery_date: { $first: "$order_products.delivery_date" },
                created_at: { $first: "$order_products.created_at" },
            },
        };
    }
    catch (err) {
        throw err;
    }
});
exports.group_data = group_data;
const filter_data = (payload_data) => __awaiter(void 0, void 0, void 0, function* () {
    console.log('payload-order-list ', payload_data);
    try {
        let { order_status } = payload_data;
        if (order_status == "ALL") {
            order_status = undefined;
        }
        else if (order_status == "CONFIRMED") {
            order_status = ["PLACED", "SHIPPED"];
        }
        else if (order_status == "DELIVERED") {
            order_status = ["DELIVERED"];
        }
        else if (order_status == "CANCELLED") {
            order_status = ["CANCELLED", "PENDING_CANCELLATION"];
        }
        return {
            $redact: {
                $cond: {
                    if: {
                        $and: [
                            {
                                $or: [
                                    { $eq: [order_status, undefined] },
                                    { $in: ["$order_status", order_status] },
                                ],
                            },
                            // {
                            //   $or: [
                            //     { $eq: [order_status, undefined] },
                            //     { $ne: ["$order_status", null] },
                            //   ],
                            // },
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
