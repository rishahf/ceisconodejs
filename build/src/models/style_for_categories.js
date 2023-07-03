"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const index_1 = require("./index");
const style_for_ref = ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('style_for', index_1.StyleFor);
const reference = [
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('categories', index_1.Category),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('subcategories', index_1.SubCategory),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('sub_subcategories', index_1.Sub_subcategories),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('brands', index_1.Brands)
];
const language = ["ENGLISH", "ARABIC"];
const StyleForCategoriesSchema = (0, ts_mongoose_1.createSchema)({
    style_for_id: style_for_ref,
    image: ts_mongoose_1.Type.string({ default: null }),
    category_id: reference[0],
    subcategory_id: reference[1],
    sub_subcategory_id: reference[2],
    brand_id: reference[3],
    is_enable: ts_mongoose_1.Type.boolean({ default: true }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const StyleForCategories = (0, ts_mongoose_1.typedModel)('style_for_categories', StyleForCategoriesSchema);
exports.default = StyleForCategories;
// Image, Category Level 1, Category Level 2, Category level 3, Brand (Clothing)
// Image, Category Level 1, Category Level 2, Category level 3, Brand (Footwear)
// Image, Category Level 1, Category Level 2, Category level 3, Brand (Men's watch)
// Image, Category Level 1, Category Level 2, Category level 3, Brand (Bags & Luggage)
