import { createSchema, Type, typedModel } from 'ts-mongoose';
import { Category, SubCategory, Sub_subcategories, Brands } from './index';
const reference = [
    Type.ref(Type.objectId({ default: null })).to('categories', <any>Category),
    Type.ref(Type.objectId({ default: null })).to('subcategories', <any>SubCategory),
    Type.ref(Type.objectId({ default: null })).to('sub_subcategories', <any>Sub_subcategories),
    Type.ref(Type.objectId({ default: null })).to('brands', <any>Brands)
]

const language = ["ENGLISH","ARABIC"]

const ShopWithUsSchema = createSchema({
    image               : Type.string({ default: null }),
    title               : Type.string({ default: null }),
    price               : Type.number({ default: 0 }),
    category_id         : reference[0],
    is_enable           : Type.boolean({ default: false }),
    is_deleted          : Type.boolean({ default: false }),
     language  : Type.string({ default: "ENGLISH", enum:language }),
    updated_at          : Type.string({ default: +new Date() }),
    created_at          : Type.string({ default: +new Date() })

})
const ShopWithUs = typedModel('shop_with_us', ShopWithUsSchema)
export default ShopWithUs


// Shop with us
// Listing of Deal Categories - Params: Image, Title, Price, Category level 1
// Option to Enable / Disable this section
