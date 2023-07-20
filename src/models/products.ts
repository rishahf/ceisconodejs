
import { createSchema, Type, typedModel } from 'ts-mongoose';
import { Sellers, Parcel, Category, SubCategory, Sub_subcategories, Brands ,Size } from "./index";
import { any } from 'joi';

const product_type = ["WAERABLE_PRODUCT", "ELECTRONIC_PRODUCT"]
const reference = [
    Type.ref(Type.objectId({ default  : null })).to('sellers', <any>Sellers),
    Type.ref(Type.objectId({ default  : null })).to('parcels', <any>Parcel),
    Type.ref(Type.objectId({ default  : null })).to('categories', <any>Category),
    Type.ref(Type.objectId({ default  : null })).to('subcategories', <any>SubCategory),
    Type.ref(Type.objectId({ default  : null })).to('sub_subcategories', <any>Sub_subcategories),
    Type.ref(Type.objectId({ default  : null })).to('brands', <any>Brands),
]
const language = ["ENGLISH", "ARABIC"];

const ProductsSchema = createSchema({
    name                : Type.string({ default : null }),
    description         : Type.string({ default : null }),
    prodct_id          : Type.string({ default : null }),
    // product_type        : Type.string({ default : "WAERABLE_PRODUCT", enum : product_type }),
    added_by            : reference[0],
    parcel_id           : reference[1],
    category_id         : reference[2],
    subcategory_id      : reference[3],
    sub_subcategory_id  : reference[4],
    brand_id            : reference[5],
    size                : Type.string({ default : null }),
    parent_id           : Type.string({ default : null }),
    images              : Type.array().of(Type.string({ default : [] })),
    quantity            : Type.number({ default : null }),
    tax_percentage      : Type.number({ default : 0 }),
    price               : Type.number({ default : 0 }),
    discount_percantage : Type.number({ default : 0 }),
    discount            : Type.number({ default : 0 }),
    discount_price      : Type.number({ default : 0 }),
    total_reviews       : Type.number({ default : 0 }),
    total_ratings       : Type.number({ default : 0 }),
    average_rating      : Type.number({ default : 0 }),
    one_star_ratings    : Type.number({ default : 0 }),
    two_star_ratings    : Type.number({ default : 0 }),
    three_star_ratings  : Type.number({ default : 0 }),
    four_star_ratings   : Type.number({ default : 0 }),
    five_star_ratings   : Type.number({ default : 0 }),
    sold                : Type.boolean({ default : false }),
    is_visible          : Type.boolean({ default : false }),
    is_delivery_available     : Type.boolean({ default : false }),
    is_blocked          : Type.boolean({ default : false }),
    is_deleted          : Type.boolean({ default : false }),
    colour              : Type.string({ default : null }),
    language            : Type.string({default: "ENGLISH", enum:language}), 
    updated_at          : Type.string({ default : +new Date() }),
    created_at          : Type.string({ default : +new Date() })
})
const Products = typedModel('products', ProductsSchema);
export default Products





    // product_details: Type.array().of(Type.ref(Type.objectId({ default: null })).to('productdetails', <any>Models.ProductDetails)),
    // services: Type.array().of(Type.ref(Type.objectId({ default: null })).to('product_services', <any>Models.ProductServices)),
    // highlights: Type.array().of(Type.ref(Type.objectId({ default: null })).to('product_highlights', <any>Models.ProductHighlights)),
    // deliverable_cities: Type.array().of(Type.ref(Type.objectId({ default: null })).to('deliverable_locations', <any>Models.DeliverableLocations)),