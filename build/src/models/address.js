"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const mongoose_1 = require("mongoose");
const address_type = [
    "HOME", "WORK"
];
const language = ["ENGLISH", "ARABIC"];
const AddressSchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ default: null }),
    user_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('users', mongoose_1.models.Users),
    country_code: ts_mongoose_1.Type.string({ default: null }),
    phone_no: ts_mongoose_1.Type.number({ default: null }),
    company: ts_mongoose_1.Type.string({ default: null }),
    country: ts_mongoose_1.Type.string({ default: null }),
    state: ts_mongoose_1.Type.string({ default: null }),
    city: ts_mongoose_1.Type.string({ default: null }),
    pin_code: ts_mongoose_1.Type.string({ default: null }),
    apartment_number: ts_mongoose_1.Type.string({ default: null }),
    full_address: ts_mongoose_1.Type.string({ default: null }),
    shippo_user_address_id: ts_mongoose_1.Type.string({ default: null }),
    address_type: ts_mongoose_1.Type.string({ default: "HOME", enum: address_type }),
    location: {
        type: ts_mongoose_1.Type.string({ default: "Point" }),
        coordinates: ts_mongoose_1.Type.array().of(ts_mongoose_1.Type.number({ default: [0, 1] })),
    },
    lat: ts_mongoose_1.Type.string({ default: null }),
    lng: ts_mongoose_1.Type.string({ default: null }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    is_default: ts_mongoose_1.Type.boolean({ default: false }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
AddressSchema.index({ location: "2dsphere" });
const Address = (0, ts_mongoose_1.typedModel)('address', AddressSchema);
exports.default = Address;
