"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const address = ts_mongoose_1.Type.object().of({
    company: ts_mongoose_1.Type.string({ default: null }),
    country: ts_mongoose_1.Type.string({ default: null }),
    state: ts_mongoose_1.Type.string({ default: null }),
    city: ts_mongoose_1.Type.string({ default: null }),
    full_address: ts_mongoose_1.Type.string({ default: null }),
});
const AdminSchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ default: null }),
    image: ts_mongoose_1.Type.string({ default: null }),
    email: ts_mongoose_1.Type.string({ default: null }),
    password: ts_mongoose_1.Type.string({ default: null }),
    country_code: ts_mongoose_1.Type.string({ default: null }),
    phone_number: ts_mongoose_1.Type.number({ default: null }),
    roles: ts_mongoose_1.Type.array().of(ts_mongoose_1.Type.string({ default: [] })),
    super_admin: ts_mongoose_1.Type.boolean({ default: false }),
    company: ts_mongoose_1.Type.string({ default: null }),
    country: ts_mongoose_1.Type.string({ default: null }),
    state: ts_mongoose_1.Type.string({ default: null }),
    city: ts_mongoose_1.Type.string({ default: null }),
    full_address: ts_mongoose_1.Type.string({ default: null }),
    is_blocked: ts_mongoose_1.Type.boolean({ default: false }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Admin = (0, ts_mongoose_1.typedModel)('admins', AdminSchema);
exports.default = Admin;
