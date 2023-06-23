"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const mongoose_1 = require("mongoose");
const language = ["ENGLISH", "ARABIC"];
const Sub_subcategorySchema = (0, ts_mongoose_1.createSchema)({
    subcategory_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('subcategories', mongoose_1.models.SubCategory),
    name: ts_mongoose_1.Type.string({ default: null }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Sub_subcategories = (0, ts_mongoose_1.typedModel)('sub_subcategories', Sub_subcategorySchema);
exports.default = Sub_subcategories;
