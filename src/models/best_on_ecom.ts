import { createSchema, Type, typedModel } from 'ts-mongoose';
import { Category, SubCategory, Sub_subcategories, Brands } from './index';
const reference = [
    Type.ref(Type.objectId({ default: null })).to('categories', <any>Category),
    Type.ref(Type.objectId({ default: null })).to('subcategories', <any>SubCategory),
    Type.ref(Type.objectId({ default: null })).to('sub_subcategories', <any>Sub_subcategories),
    Type.ref(Type.objectId({ default: null })).to('brands', <any>Brands)
]

const language = ["ENGLISH", "ARABIC"];

const BestOnEcomSchema = createSchema({
    image               : Type.string({ default: null }),
    title               : Type.string({ default: null }),
    sub_title               : Type.string({ default: null }),
    category_id         : reference[0],
    subcategory_id      : reference[1],
    sub_subcategory_id  : reference[2],
    brand_id            : reference[3],
    is_deleted          : Type.boolean({ default: false }),
    is_enable          : Type.boolean({ default: true }),
    language  : Type.string({ default: "ENGLISH", enum:language }),
    updated_at          : Type.string({ default: +new Date() }),
    created_at          : Type.string({ default: +new Date() })

})
const BestOnEcom = typedModel('best_on_ecom', BestOnEcomSchema)
export default BestOnEcom


// Best of Electronics
// Listing of Deal Categories - Params: Image, Title, Price, Category level 1, Category level 2, Category level 3, Brand, Discount
// Option to Enable / Disable this section