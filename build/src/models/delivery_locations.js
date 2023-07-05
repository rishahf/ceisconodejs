"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const mongoose_1 = require("mongoose");
const DeliveryAddressSchema = (0, ts_mongoose_1.createSchema)({
    product_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('products', mongoose_1.models.Products),
    address: ts_mongoose_1.Type.string({ default: null }),
    country: ts_mongoose_1.Type.string({ default: null }),
    location: {
        type: ts_mongoose_1.Type.string({ default: "Point" }),
        coordinates: ts_mongoose_1.Type.array().of(ts_mongoose_1.Type.number({ default: [0, 1] })),
    },
    radius: ts_mongoose_1.Type.number({ default: 0 }),
    units: ts_mongoose_1.Type.string({ default: null }),
    delivery_time: ts_mongoose_1.Type.string({ default: null }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
DeliveryAddressSchema.index({ location: "2dsphere" });
const Delivery_Locations = (0, ts_mongoose_1.typedModel)('delivery_locations', DeliveryAddressSchema);
exports.default = Delivery_Locations;
