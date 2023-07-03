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
const DealSchema = (0, ts_mongoose_1.createSchema)({
    image: ts_mongoose_1.Type.string({ default: null }),
    title: ts_mongoose_1.Type.string({ default: null }),
    price: ts_mongoose_1.Type.number({ default: 0 }),
    category_id: reference[0],
    subcategory_id: reference[1],
    sub_subcategory_id: reference[2],
    brand_id: reference[3],
    discount: ts_mongoose_1.Type.number({ default: 0 }),
    valid_till: ts_mongoose_1.Type.string({ default: null }),
    is_enable: ts_mongoose_1.Type.boolean({ default: false }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH" })
});
const Deals_of_the_day = (0, ts_mongoose_1.typedModel)('deals_of_the_day', DealSchema);
exports.default = Deals_of_the_day;
// Deals of the day
// Listing of Deal Categories - Params: Image, Title, Price, Category level 1, Category level 2, Category level 3, Brand, Discount
// Option to Enable / Disable this section
// Deal timer - On timer end hide section and make it disable