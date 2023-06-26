"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const index_1 = require("./index");
const shippo_data = ts_mongoose_1.Type.object().of({
    shipment_id: ts_mongoose_1.Type.string({ default: null }),
    parcel_id: ts_mongoose_1.Type.string({ default: null }),
    rate_id: ts_mongoose_1.Type.string({ default: null }),
    transaction_id: ts_mongoose_1.Type.string({ default: null }),
    tracking_no: ts_mongoose_1.Type.string({ default: null }),
    service_level: ts_mongoose_1.Type.string({ default: null }),
    refund_id: ts_mongoose_1.Type.string({ default: null }),
    estimated_days: ts_mongoose_1.Type.string({ default: null }),
    label_url: ts_mongoose_1.Type.string({ default: null })
});
const address_data = ts_mongoose_1.Type.object().of({
    name: ts_mongoose_1.Type.string({ default: null }),
    country_code: ts_mongoose_1.Type.string({ default: null }),
    phone_no: ts_mongoose_1.Type.number({ default: null }),
    company: ts_mongoose_1.Type.string({ default: null }),
    country: ts_mongoose_1.Type.string({ default: null }),
    state: ts_mongoose_1.Type.string({ default: null }),
    city: ts_mongoose_1.Type.string({ default: null }),
    pin_code: ts_mongoose_1.Type.string({ default: null }),
    apartment_number: ts_mongoose_1.Type.string({ default: null }),
    full_address: ts_mongoose_1.Type.string({ default: null }),
    address_type: ts_mongoose_1.Type.string({ default: null }),
    lat: ts_mongoose_1.Type.string({ default: null }),
    lng: ts_mongoose_1.Type.string({ default: null }),
});
const language = ["ENGLISH", "ARABIC"];
const seller_address = ts_mongoose_1.Type.object().of({
    name: ts_mongoose_1.Type.string({ default: null }),
    country_code: ts_mongoose_1.Type.string({ default: null }),
    phone_no: ts_mongoose_1.Type.number({ default: null }),
    company: ts_mongoose_1.Type.string({ default: null }),
    country: ts_mongoose_1.Type.string({ default: null }),
    state: ts_mongoose_1.Type.string({ default: null }),
    city: ts_mongoose_1.Type.string({ default: null }),
    pin_code: ts_mongoose_1.Type.string({ default: null }),
    apartment_number: ts_mongoose_1.Type.string({ default: null }),
    full_address: ts_mongoose_1.Type.string({ default: null }),
    address_type: ts_mongoose_1.Type.string({ default: null }),
    lat: ts_mongoose_1.Type.string({ default: null }),
    lng: ts_mongoose_1.Type.string({ default: null }),
});
const order_status = ["PLACED", "CONFIRMED", "DELIVERED", "CANCELLED", "DISPUTE", "RETURNED", "REFUND_IN_PROGESS", "REFUNDED", "PENDING_CANCELLATION"];
const delivery_status = ["PENDING", "CONFIRMED", "PAID", "SHIPPED", "DISPACHED", "DELIVERED", "CANCELLED"];
const cancelled_by = [null, "BY_USER", "BY_SELLER"];
const payment_status = ["SUCCESS", "REFUNDED", "REFUND_IN_PROGESS"];
const cancellation_reason = [
    null,
    "DO_NOT_LIKE_THE_ITEM",
    "DEFFECTIVE_ITEM",
    "ADDRESS_ISSUE",
    "FOR_OTHER_REASON",
    "OUT_OF_STOCK",
    "ORDER_CANCELLED_BY_SELLER",
];
const OrderProductsSchema = (0, ts_mongoose_1.createSchema)({
    order_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('orders', index_1.Orders),
    product_order_id: ts_mongoose_1.Type.string({ default: null }),
    product_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('products', index_1.Products),
    user_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('users', index_1.Users),
    seller_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('sellers', index_1.Sellers),
    tax_no: ts_mongoose_1.Type.string({ default: null }),
    quantity: ts_mongoose_1.Type.number({ default: 0 }),
    price: ts_mongoose_1.Type.number({ default: 0 }),
    discount_percantage: ts_mongoose_1.Type.number({ default: 0 }),
    discount_price: ts_mongoose_1.Type.number({ default: 0 }),
    delivery_price: ts_mongoose_1.Type.number({ default: 0 }),
    coupon_discount: ts_mongoose_1.Type.number({ default: 0 }),
    total_price: ts_mongoose_1.Type.number({ default: 0 }),
    total_earnings: ts_mongoose_1.Type.number({ default: 0 }),
    admin_commision: ts_mongoose_1.Type.number({ default: 0 }),
    tax_percentage: ts_mongoose_1.Type.number({ default: 0 }),
    tax_amount: ts_mongoose_1.Type.number({ default: 0 }),
    shippo_data: shippo_data,
    order_status: ts_mongoose_1.Type.string({ default: 'PLACED', enum: order_status }),
    previous_status: ts_mongoose_1.Type.string({ default: null }),
    // delivery_status : Type.string({ default : 'PENDING', enum : delivery_status }),
    cancelled_by: ts_mongoose_1.Type.string({ default: null, enum: cancelled_by }),
    cancellation_reason: ts_mongoose_1.Type.string({ default: null, enum: cancellation_reason }),
    description: ts_mongoose_1.Type.string({ default: null }),
    cancel_requested: ts_mongoose_1.Type.boolean({ default: false }),
    cancel_request_accepted: ts_mongoose_1.Type.boolean({ default: false }),
    payment_status: ts_mongoose_1.Type.string({ default: "SUCCESS", enum: payment_status }),
    cancelled_at: ts_mongoose_1.Type.string({ default: null }),
    delivery_date: ts_mongoose_1.Type.string({ default: null }),
    shipped_at: ts_mongoose_1.Type.string({ default: null }),
    tracking_link: ts_mongoose_1.Type.string({ default: null }),
    refund_id: ts_mongoose_1.Type.string({ default: null }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    address_data: address_data,
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const OrderProducts = (0, ts_mongoose_1.typedModel)('order_products', OrderProductsSchema);
exports.default = OrderProducts;
// coupon_code     : Type.string({ default : null }),
// coupon_discount : Type.number({ default : 0 }),
// delivery_price  : Type.number({ default : 0 }),
