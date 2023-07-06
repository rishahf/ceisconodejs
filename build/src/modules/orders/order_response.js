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
exports.sort_data = exports.group_data = exports.unwind_address = exports.lookup_address = exports.unwind_products = exports.lookup_products = exports.unwind_order_products = exports.lookup_order_products = exports.unwind_orders = exports.lookup_orders = exports.match_data = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const match_data = (order_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $match: {
                order_id: mongoose_1.default.Types.ObjectId(order_id)
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.match_data = match_data;
const lookup_orders = () => __awaiter(void 0, void 0, void 0, function* () {
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
exports.lookup_orders = lookup_orders;
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
                let: { order_id: "$order_id" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ["$order_id", "$$order_id"],
                            }
                        }
                    }
                ],
                as: "order_products"
            }
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
                preserveNullAndEmptyArrays: true
            }
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
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            description: 1,
                            images: 1
                        }
                    }
                ],
                as: "products"
            }
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
                preserveNullAndEmptyArrays: true
            }
        };
    }
    catch (err) {
        throw err;
    }
});
exports.unwind_products = unwind_products;
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
                            shippo_user_address_id: 0,
                            is_default: 0,
                            is_deleted: 0,
                            created_at: 0,
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
const group_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return {
            $group: {
                _id: "$order_products._id",
                order_id: { "$first": "$order_products.order_id" },
                user_id: { "$first": "$order_products.user_id" },
                seller_id: { "$first": "$order_products.seller_id" },
                product_id: { "$first": "$products" },
                address_id: { "$first": "$address" },
                quantity: { "$first": "$order_products.quantity" },
                price: { "$first": "$order_products.price" },
                delivery_price: { "$first": "$order_products.delivery_price" },
                coupon_discount: { "$first": "$order_products.coupon_discount" },
                total_price: { "$first": "$order_products.total_price" },
                total_earnings: { "$first": "$order_products.total_earnings" },
                shippo_data: { "$first": "$order_products.shippo_data" },
                order_status: { "$first": "$order_products.order_status" },
                // delivery_status: { "$first": "$order_products.delivery_status" },
                stripe_data: { "$first": "$orders.stripe_data" },
                updated_at: { "$first": "$order_products.updated_at" },
                created_at: { "$first": "$order_products.created_at" }
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
