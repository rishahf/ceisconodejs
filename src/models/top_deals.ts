import { createSchema, Type, typedModel } from 'ts-mongoose';
import { Category, SubCategory, Sub_subcategories, Brands } from './index';
const reference = [
    Type.ref(Type.objectId({ default: null })).to('categories', <any>Category),
    Type.ref(Type.objectId({ default: null })).to('subcategories', <any>SubCategory),
    Type.ref(Type.objectId({ default: null })).to('sub_subcategories', <any>Sub_subcategories),
    Type.ref(Type.objectId({ default: null })).to('brands', <any>Brands)
]

const language = ["ENGLISH","ARABIC"]

const TopDealsSchema = createSchema({
    image               : Type.string({ default: null }),
    title               : Type.string({ default: null }),
    price               : Type.number({ default: 0 }),
    category_id         : reference[0],
    subcategory_id      : reference[1],
    sub_subcategory_id  : reference[2],
    brand_id            : reference[3],
    discount            : Type.number({ default: 0 }),
    is_enable           : Type.boolean({ default: false }),
    is_deleted          : Type.boolean({ default: false }),
    language            : Type.string({ default: "ENGLISH", enum:language }),
    updated_at          : Type.string({ default: +new Date() }),
    created_at          : Type.string({ default: +new Date() })

})
const TopDeals = typedModel('top_deals', TopDealsSchema)
export default TopDeals



// Listing of Deal Categories - Params: Image, Title, Price, Category level 1, Category level 2, Category level 3, Brand, Discount
// There will be 3 top details
// Option to Enable / Disable this section