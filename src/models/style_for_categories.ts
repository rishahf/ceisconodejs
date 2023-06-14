import { createSchema, Type, typedModel } from 'ts-mongoose';
import { StyleFor, Category, SubCategory, Sub_subcategories, Brands } from './index';

const style_for_ref = Type.ref(Type.objectId({ default: null })).to('style_for', <any>StyleFor)
const reference = [
    Type.ref(Type.objectId({ default: null })).to('categories', <any>Category),
    Type.ref(Type.objectId({ default: null })).to('subcategories', <any>SubCategory),
    Type.ref(Type.objectId({ default: null })).to('sub_subcategories', <any>Sub_subcategories),
    Type.ref(Type.objectId({ default: null })).to('brands', <any>Brands)
]

const language = [ "ENGLISH", "ARABIC"]

const StyleForCategoriesSchema = createSchema({
    style_for_id        : style_for_ref,
    image               : Type.string({ default: null }),
    category_id         : reference[0],
    subcategory_id      : reference[1],
    sub_subcategory_id  : reference[2],
    brand_id            : reference[3],
    is_enable           : Type.boolean({ default: true }),
    is_deleted          : Type.boolean({ default: false }),
     language  : Type.string({ default: "ENGLISH", enum:language }),
    updated_at          : Type.string({ default: +new Date() }),
    created_at          : Type.string({ default: +new Date() })

})
const StyleForCategories = typedModel('style_for_categories', StyleForCategoriesSchema)
export default StyleForCategories

// Image, Category Level 1, Category Level 2, Category level 3, Brand (Clothing)
// Image, Category Level 1, Category Level 2, Category level 3, Brand (Footwear)
// Image, Category Level 1, Category Level 2, Category level 3, Brand (Men's watch)
// Image, Category Level 1, Category Level 2, Category level 3, Brand (Bags & Luggage)