"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const social_type = [null, "GOOGLE", "FACEBOOK", "APPLE"];
const account_status = ["ACTIVATED", "DEACTIVATED"];
const deactivation_reason = [
    null,
    "1. Finding difficulty while using the service",
    "2. Not happy with the services",
    "3. Deactivating for temporary",
    "4. For other Reason"
];
const language = ["ENGLISH", "ARABIC"];
const UserSchema = (0, ts_mongoose_1.createSchema)({
    social_type: ts_mongoose_1.Type.string({ default: null, enum: social_type }),
    social_token: ts_mongoose_1.Type.string({ default: null }),
    profile_pic: ts_mongoose_1.Type.string({ default: null }),
    name: ts_mongoose_1.Type.string({ default: null }),
    email: ts_mongoose_1.Type.string({ default: null }),
    country_code: ts_mongoose_1.Type.string({ default: null }),
    phone_no: ts_mongoose_1.Type.number({ default: 0 }),
    password: ts_mongoose_1.Type.string({ default: null }),
    otp: ts_mongoose_1.Type.number({ default: 0 }),
    phone_otp: ts_mongoose_1.Type.number({ default: 0 }),
    unique_code: ts_mongoose_1.Type.string({ default: null }),
    fp_otp: ts_mongoose_1.Type.number({ default: 0 }),
    fp_otp_verified: ts_mongoose_1.Type.boolean({ default: false }),
    wrong_pwd_count: ts_mongoose_1.Type.number({ default: 0 }),
    locked_till: ts_mongoose_1.Type.string({ default: null }),
    customer_id: ts_mongoose_1.Type.string({ default: null }),
    payment_id: ts_mongoose_1.Type.string({ default: null }),
    description: ts_mongoose_1.Type.string({ default: null }),
    admin_verified: ts_mongoose_1.Type.boolean({ default: false }),
    email_verified: ts_mongoose_1.Type.boolean({ default: false }),
    phone_verified: ts_mongoose_1.Type.boolean({ default: false }),
    about: ts_mongoose_1.Type.string({ default: null }),
    account_status: ts_mongoose_1.Type.string({ default: "ACTIVATED", account_status: account_status }),
    deactivation_reason: ts_mongoose_1.Type.string({ default: null, enum: deactivation_reason }),
    is_blocked: ts_mongoose_1.Type.boolean({ default: false }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Users = (0, ts_mongoose_1.typedModel)('users', UserSchema);
exports.default = Users;
