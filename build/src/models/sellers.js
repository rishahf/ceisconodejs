"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const account_status = ["ACTIVATED", "DEACTIVATED"];
// const deactivation_reason = [
//     null,
//     "1. Finding difficulty while using the service",
//     "2. Not happy with the services",
//     "3. Deactivating for temporary",
//     "4. For other Reason"
// ]
const language = ["ENGLISH", "ARABIC"];
const SellerSchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ default: null }),
    email: ts_mongoose_1.Type.string({ default: null }),
    password: ts_mongoose_1.Type.string({ default: null }),
    country_code: ts_mongoose_1.Type.string({ default: null }),
    phone_number: ts_mongoose_1.Type.number({ default: null }),
    image: ts_mongoose_1.Type.string({ default: null }),
    email_otp: ts_mongoose_1.Type.number({ default: 0 }),
    email_verified: ts_mongoose_1.Type.boolean({ default: false }),
    unique_code: ts_mongoose_1.Type.string({ default: null }),
    fp_otp: ts_mongoose_1.Type.number({ default: 0 }),
    fp_otp_verified: ts_mongoose_1.Type.boolean({ default: false }),
    company: ts_mongoose_1.Type.string({ default: null }),
    country: ts_mongoose_1.Type.string({ default: null }),
    state: ts_mongoose_1.Type.string({ default: null }),
    city: ts_mongoose_1.Type.string({ default: null }),
    pin_code: ts_mongoose_1.Type.string({ default: null }),
    apartment_number: ts_mongoose_1.Type.string({ default: null }),
    full_address: ts_mongoose_1.Type.string({ default: null }),
    shippo_address_id: ts_mongoose_1.Type.string({ default: null }),
    account_status: ts_mongoose_1.Type.string({ default: "ACTIVATED", account_status: account_status }),
    deactivation_reason: ts_mongoose_1.Type.string({ default: null }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    is_blocked: ts_mongoose_1.Type.boolean({ default: false }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
});
const Sellers = (0, ts_mongoose_1.typedModel)("sellers", SellerSchema);
exports.default = Sellers;
