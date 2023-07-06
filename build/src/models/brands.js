"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const language = ["ENGLISH", "ARABIC"];
const BrandSchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ default: null }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
});
const Brands = (0, ts_mongoose_1.typedModel)("brands", BrandSchema);
exports.default = Brands;
