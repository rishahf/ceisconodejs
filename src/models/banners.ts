import { createSchema, Type, typedModel } from 'ts-mongoose';
import { Category, SubCategory, Sub_subcategories, Brands } from './index';
const position = [ "TOP", "MIDDLE", "BOTTOM" ]
const reference = [
    Type.ref(Type.objectId({ default: null })).to('categories', <any>Category),
    Type.ref(Type.objectId({ default: null })).to('subcategories', <any>SubCategory),
    Type.ref(Type.objectId({ default: null })).to('sub_subcategories', <any>Sub_subcategories),
    Type.ref(Type.objectId({ default: null })).to('brands', <any>Brands)
]

const language = ["ENGLISH","ARABIC"]

const BannerSchema = createSchema({
    title               : Type.string({ default: null }),
    sub_title           : Type.string({ default: null }),
    image               : Type.string({ default: null }),
    category_id         : reference[0],
    subcategory_id      : reference[1],
    sub_subcategory_id  : reference[2],
    brand_id            : reference[3],
    position            : Type.string({ default: "TOP", enum: position }),
    is_enable           : Type.boolean({ default: false }),
    is_deleted          : Type.boolean({ default: false }),
     language  : Type.string({ default: "ENGLISH", enum:language }),
    updated_at          : Type.string({ default: +new Date() }),
    created_at          : Type.string({ default: +new Date() })
})
const Banners = typedModel('banners', BannerSchema)
export default Banners



// Banner listing - Image, Title, Subtitle, Category level 1, Category level 2, Category level 3, Brand
// Ability to remove image
// Add / Update image
// Option to Enable / Disable this section