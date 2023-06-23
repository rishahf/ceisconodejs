"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const index_1 = require("./index");
const product_type = ["WAERABLE_PRODUCT", "ELECTRONIC_PRODUCT"];
const reference = [
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('sellers', index_1.Sellers),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('parcels', index_1.Parcel),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('categories', index_1.Category),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('subcategories', index_1.SubCategory),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('sub_subcategories', index_1.Sub_subcategories),
    ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('brands', index_1.Brands)
];
const language = ["ENGLISH", "ARABIC"];
const ProductsSchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ default: null }),
    description: ts_mongoose_1.Type.string({ default: null }),
    prodct_id: ts_mongoose_1.Type.string({ default: null }),
    // product_type        : Type.string({ default : "WAERABLE_PRODUCT", enum : product_type }),
    added_by: reference[0],
    parcel_id: reference[1],
    category_id: reference[2],
    subcategory_id: reference[3],
    sub_subcategory_id: reference[4],
    brand_id: reference[5],
    images: ts_mongoose_1.Type.array().of(ts_mongoose_1.Type.string({ default: [] })),
    quantity: ts_mongoose_1.Type.number({ default: null }),
    tax_percentage: ts_mongoose_1.Type.number({ default: 0 }),
    price: ts_mongoose_1.Type.number({ default: 0 }),
    discount_percantage: ts_mongoose_1.Type.number({ default: 0 }),
    discount: ts_mongoose_1.Type.number({ default: 0 }),
    discount_price: ts_mongoose_1.Type.number({ default: 0 }),
    total_reviews: ts_mongoose_1.Type.number({ default: 0 }),
    total_ratings: ts_mongoose_1.Type.number({ default: 0 }),
    average_rating: ts_mongoose_1.Type.number({ default: 0 }),
    one_star_ratings: ts_mongoose_1.Type.number({ default: 0 }),
    two_star_ratings: ts_mongoose_1.Type.number({ default: 0 }),
    three_star_ratings: ts_mongoose_1.Type.number({ default: 0 }),
    four_star_ratings: ts_mongoose_1.Type.number({ default: 0 }),
    five_star_ratings: ts_mongoose_1.Type.number({ default: 0 }),
    sold: ts_mongoose_1.Type.boolean({ default: false }),
    is_visible: ts_mongoose_1.Type.boolean({ default: false }),
    is_delivery_available: ts_mongoose_1.Type.boolean({ default: false }),
    is_blocked: ts_mongoose_1.Type.boolean({ default: false }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Products = (0, ts_mongoose_1.typedModel)('products', ProductsSchema);
exports.default = Products;
// product_details: Type.array().of(Type.ref(Type.objectId({ default: null })).to('productdetails', <any>Models.ProductDetails)),
// services: Type.array().of(Type.ref(Type.objectId({ default: null })).to('product_services', <any>Models.ProductServices)),
// highlights: Type.array().of(Type.ref(Type.objectId({ default: null })).to('product_highlights', <any>Models.ProductHighlights)),
// deliverable_cities: Type.array().of(Type.ref(Type.objectId({ default: null })).to('deliverable_locations', <any>Models.DeliverableLocations)),
