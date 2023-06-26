"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const mongoose_1 = require("mongoose");
const DiscountSchema = (0, ts_mongoose_1.createSchema)({
    sub_category_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('sub_categories', mongoose_1.models.Category),
    product_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('products', mongoose_1.models.Products),
    brand_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('brands', mongoose_1.models.Brands),
    discount_percentage: ts_mongoose_1.Type.string({ default: null }),
    is_removed: ts_mongoose_1.Type.boolean({ default: false }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Discounts = (0, ts_mongoose_1.typedModel)('discounts', DiscountSchema);
exports.default = Discounts;
