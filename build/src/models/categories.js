"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const design_type = ["1 for VERTICALLY", "2 for HORIZONTALLY"];
const language = ["ENGLISH", "ARABIC"];
const CategorySchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ default: null }),
    design_type: ts_mongoose_1.Type.number({ default: 1 }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
});
const Category = (0, ts_mongoose_1.typedModel)('categories', CategorySchema);
exports.default = Category;
