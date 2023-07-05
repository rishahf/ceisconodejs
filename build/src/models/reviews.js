"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const index_1 = require("./index");
const language = ["ENGLISH", "ARABIC"];
const ReviewSchema = (0, ts_mongoose_1.createSchema)({
    user_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('users', index_1.Users),
    product_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('products', index_1.Products),
    seller_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('sellers', index_1.Sellers),
    title: ts_mongoose_1.Type.string({ default: null }),
    description: ts_mongoose_1.Type.string({ default: null }),
    ratings: ts_mongoose_1.Type.number({ default: 0, min: 1, max: 5 }),
    images: ts_mongoose_1.Type.array().of(ts_mongoose_1.Type.string({ default: [] })),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Reviews = (0, ts_mongoose_1.typedModel)('reviews', ReviewSchema);
exports.default = Reviews;
