"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const language = ["ENGLISH", "ARABIC"];
const HomePageSectionsSchema = (0, ts_mongoose_1.createSchema)({
    // banners                 : Type.boolean({ default: true }),
    top_banners: ts_mongoose_1.Type.boolean({ default: true }),
    middle_banners: ts_mongoose_1.Type.boolean({ default: true }),
    bottom_banners: ts_mongoose_1.Type.boolean({ default: true }),
    deal_of_the_day: ts_mongoose_1.Type.boolean({ default: true }),
    top_deals: ts_mongoose_1.Type.boolean({ default: true }),
    fashion_deals: ts_mongoose_1.Type.boolean({ default: true }),
    style_for_categories: ts_mongoose_1.Type.boolean({ default: true }),
    featured_categories: ts_mongoose_1.Type.boolean({ default: true }),
    shop_with_us: ts_mongoose_1.Type.boolean({ default: true }),
    best_on_ecom: ts_mongoose_1.Type.boolean({ default: true }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const HomePageSections = (0, ts_mongoose_1.typedModel)('homePage_sections', HomePageSectionsSchema);
exports.default = HomePageSections;
