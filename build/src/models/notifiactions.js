"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const Models = __importStar(require("./index"));
const type = [
    "PHONE_VERIFICATION_SUCCESS",
    "ORDER_CREATED",
    "ORDER_CANCELLED_BY_SELLER",
    "NEW_ORDER",
    "CONFIRMED_ORDER",
    "ORDER_DELIVERED",
    "DELIVERED_ORDER",
    "DELIVERED",
    "ORDER_DELIVERED",
    "DELIVERED",
    "CANCELLED",
    "ORDER_CANCELLED",
    "ORDER_CANCELLED_REQUEST",
    "ORDER_CANCELLED_REQUESTED",
    "REQUEST_CANCELLED",
    "REQUESTED_CANCELLED",
    "CANCELLED_ORDER",
    "NEW_PRODUCTS_ADDED",
    "ORDER_SHIPPED",
    "SHIPPED",
    "NEW_REVIEW",
    "NEW_NOTIFICATION",
];
const language = ["ENGLISH", "ARABIC"];
const NotificationSchema = (0, ts_mongoose_1.createSchema)({
    user_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to("users", Models.Users),
    seller_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to("sellers", Models.Sellers),
    admin_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to("admins", Models.Admin),
    product_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to("products", Models.Products),
    order_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to("orders", Models.Orders),
    orderProduct_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to("order_products", Models.OrderProducts),
    title: ts_mongoose_1.Type.string({ default: null }),
    type: ts_mongoose_1.Type.string({ default: null, enum: type }),
    images: ts_mongoose_1.Type.array().of(ts_mongoose_1.Type.string({ default: [] })),
    message: ts_mongoose_1.Type.string({ default: null }),
    read_by_user: ts_mongoose_1.Type.boolean({ default: false }),
    read_by_seller: ts_mongoose_1.Type.boolean({ default: false }),
    read_by_admin: ts_mongoose_1.Type.boolean({ default: false }),
    clear_for_user: ts_mongoose_1.Type.boolean({ default: false }),
    clear_for_seller: ts_mongoose_1.Type.boolean({ default: false }),
    clear_for_admin: ts_mongoose_1.Type.boolean({ default: false }),
    // previous_seller: Type.boolean({ default: false }),
    // previous_user: Type.boolean({ default: false }),
    // previous_admin: Type.boolean({ default: false }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
});
const Notifications = (0, ts_mongoose_1.typedModel)('notifications', NotificationSchema);
exports.default = Notifications;
