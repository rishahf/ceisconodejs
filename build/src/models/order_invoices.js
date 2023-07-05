"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const index_1 = require("./index");
const stripe_data = ts_mongoose_1.Type.object().of({
    payment_intent: ts_mongoose_1.Type.string({ default: null }),
    refund_id: ts_mongoose_1.Type.string({ default: null }),
});
const status = ["ACTIVE", "CANCELLED"];
const cancellation_reason = [
    null,
    "DO_NOT_LIKE_THE_ITEM",
    "DEFFECTIVE_ITEM",
    "ADDRESS_ISSUE",
    "FOR_OTHER_REASON",
    "ORDER_CANCELLED_BY_SELLER",
];
const InvoiceSchema = (0, ts_mongoose_1.createSchema)({
    order_product_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('order_products', index_1.OrderProducts),
    status: ts_mongoose_1.Type.string({ default: "ACTIVE", enum: status }),
    invoice_id: ts_mongoose_1.Type.string({ default: 0 }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
});
const OrderInvoices = (0, ts_mongoose_1.typedModel)("order_invoices", InvoiceSchema);
exports.default = OrderInvoices;
