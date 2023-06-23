"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const ShippingSchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ default: null }),
    company: ts_mongoose_1.Type.string({ default: null }),
    street1: ts_mongoose_1.Type.string({ default: null }),
    city: ts_mongoose_1.Type.string({ default: null }),
    state: ts_mongoose_1.Type.string({ default: null }),
    zip: ts_mongoose_1.Type.string({ default: null }),
    country: ts_mongoose_1.Type.string({ default: null }),
    phone: ts_mongoose_1.Type.number({ default: null }),
    email: ts_mongoose_1.Type.string({ default: null }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
});
const Shipping = (0, ts_mongoose_1.typedModel)('shipping', ShippingSchema);
exports.default = Shipping;
