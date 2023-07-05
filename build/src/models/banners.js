"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const index_1 = require("./index");
const position = ["TOP", "MIDDLE", "BOTTOM"];
const reference = [
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('categories', index_1.Category),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('subcategories', index_1.SubCategory),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('sub_subcategories', index_1.Sub_subcategories),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('brands', index_1.Brands)
];
const language = ["ENGLISH", "ARABIC"];
const BannerSchema = (0, ts_mongoose_1.createSchema)({
    title: ts_mongoose_1.Type.string({ default: null }),
    sub_title: ts_mongoose_1.Type.string({ default: null }),
    image: ts_mongoose_1.Type.string({ default: null }),
    category_id: reference[0],
    subcategory_id: reference[1],
    sub_subcategory_id: reference[2],
    brand_id: reference[3],
    position: ts_mongoose_1.Type.string({ default: "TOP", enum: position }),
    is_enable: ts_mongoose_1.Type.boolean({ default: false }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Banners = (0, ts_mongoose_1.typedModel)('banners', BannerSchema);
exports.default = Banners;
// Banner listing - Image, Title, Subtitle, Category level 1, Category level 2, Category level 3, Brand
// Ability to remove image
// Add / Update image
// Option to Enable / Disable this section
