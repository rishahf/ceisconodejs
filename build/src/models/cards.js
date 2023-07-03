"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const mongoose_1 = require("mongoose");
const CardSchema = (0, ts_mongoose_1.createSchema)({
    user_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('users', mongoose_1.models.Users),
    payment_method: ts_mongoose_1.Type.string({ default: null }),
    brand: ts_mongoose_1.Type.string({ default: null }),
    exp_month: ts_mongoose_1.Type.number({ default: 0 }),
    exp_year: ts_mongoose_1.Type.number({ default: 0 }),
    last4: ts_mongoose_1.Type.number({ default: 0 }),
    fingerprint: ts_mongoose_1.Type.string({ default: null }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    is_default: ts_mongoose_1.Type.boolean({ default: false }),
    is_saved: ts_mongoose_1.Type.boolean({ default: false }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Cards = (0, ts_mongoose_1.typedModel)('cards', CardSchema);
exports.default = Cards;
