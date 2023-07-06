"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const mongoose_1 = require("mongoose");
const UsedCouponsSchema = (0, ts_mongoose_1.createSchema)({
    user_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('users', mongoose_1.models.Users),
    coupon_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('coupons', mongoose_1.models.Coupons),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Used_Coupons = (0, ts_mongoose_1.typedModel)('used_coupons', UsedCouponsSchema);
exports.default = Used_Coupons;
