"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const index_1 = require("./index");
const type = ["FIXED", "PERCENTAGE"];
const sub_type = ["ONE_TIME", "FIXED_VALUE_TIME", "UNLIMITED_TIME"];
const applicable_for = ["ALL", "LIMITED"];
const added_by = ["ADMIN", "SELLER"];
const language = ["ENGLISH", "ARABIC"];
const CouponSchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ default: null }),
    for_homepage: ts_mongoose_1.Type.boolean({ default: false }),
    code: ts_mongoose_1.Type.string({ default: null }),
    description: ts_mongoose_1.Type.string({ default: null }),
    type: ts_mongoose_1.Type.string({ default: "FIXED", enum: type }),
    sub_type: ts_mongoose_1.Type.string({ default: "ONE_TIME", enum: sub_type }),
    start_date: ts_mongoose_1.Type.string({ default: null }),
    end_date: ts_mongoose_1.Type.string({ default: null }),
    price: ts_mongoose_1.Type.number({ default: 0 }),
    percentage: ts_mongoose_1.Type.number({ default: 0 }),
    max_discount: ts_mongoose_1.Type.number({ default: 0 }),
    is_available: ts_mongoose_1.Type.boolean({ default: true }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    applicable_for: ts_mongoose_1.Type.string({ default: "ALL", enum: applicable_for }),
    product_ids: ts_mongoose_1.Type.array().of(ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('products', index_1.Products)),
    added_by: ts_mongoose_1.Type.string({ default: "ADMIN", enum: added_by }),
    seller_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('sellers', index_1.Sellers),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Coupons = (0, ts_mongoose_1.typedModel)('coupons', CouponSchema);
exports.default = Coupons;
