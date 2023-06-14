import { createSchema, Type, typedModel } from 'ts-mongoose';
import { Category, SubCategory, Sub_subcategories, Brands } from './index';
const reference = [
    Type.ref(Type.objectId({ default: null })).to('categories', <any>Category),
    Type.ref(Type.objectId({ default: null })).to('subcategories', <any>SubCategory),
    Type.ref(Type.objectId({ default: null })).to('sub_subcategories', <any>Sub_subcategories),
    Type.ref(Type.objectId({ default: null })).to('brands', <any>Brands)
]

const DealSchema = createSchema({
    image              : Type.string({ default: null }),
    title               : Type.string({ default: null }),
    price               : Type.number({ default: 0 }),
    category_id         : reference[0],
    subcategory_id      : reference[1],
    sub_subcategory_id  : reference[2],
    brand_id            : reference[3],
    discount            : Type.number({ default: 0 }),
    valid_till          : Type.string({ default: null }),
    is_enable           : Type.boolean({ default: false }),
    is_deleted          : Type.boolean({ default: false }),
    updated_at          : Type.string({ default: +new Date() }),
    created_at          : Type.string({ default: +new Date() }),
    language          : Type.string({ default: "ENGLISH" })

})
const Deals_of_the_day = typedModel('deals_of_the_day', DealSchema)
export default Deals_of_the_day



// Deals of the day
// Listing of Deal Categories - Params: Image, Title, Price, Category level 1, Category level 2, Category level 3, Brand, Discount
// Option to Enable / Disable this section
// Deal timer - On timer end hide section and make it disable