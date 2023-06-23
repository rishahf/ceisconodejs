"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const index_1 = require("./index");
const reference = [
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('categories', index_1.Category),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('subcategories', index_1.SubCategory),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('sub_subcategories', index_1.Sub_subcategories),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('brands', index_1.Brands)
];
const language = ["ENGLISH", "ARABIC"];
const ShopWithUsSchema = (0, ts_mongoose_1.createSchema)({
    image: ts_mongoose_1.Type.string({ default: null }),
    title: ts_mongoose_1.Type.string({ default: null }),
    price: ts_mongoose_1.Type.number({ default: 0 }),
    category_id: reference[0],
    is_enable: ts_mongoose_1.Type.boolean({ default: false }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const ShopWithUs = (0, ts_mongoose_1.typedModel)('shop_with_us', ShopWithUsSchema);
exports.default = ShopWithUs;
// Shop with us
// Listing of Deal Categories - Params: Image, Title, Price, Category level 1
// Option to Enable / Disable this section
