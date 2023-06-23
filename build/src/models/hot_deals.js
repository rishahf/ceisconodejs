"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const mongoose_1 = require("mongoose");
const HotdealSchema = (0, ts_mongoose_1.createSchema)({
    subcategory_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('subcategories', mongoose_1.models.SubCategory),
    title: ts_mongoose_1.Type.string({ default: null }),
    sub_title: ts_mongoose_1.Type.string({ default: null }),
    price_description: ts_mongoose_1.Type.string({ default: null }),
    image: ts_mongoose_1.Type.string({ default: null }),
    is_removed: ts_mongoose_1.Type.boolean({ default: false }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Hot_deals = (0, ts_mongoose_1.typedModel)('hot_deals', HotdealSchema);
exports.default = Hot_deals;
