import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";


const DiscountSchema = createSchema({
    sub_category_id: Type.ref(Type.objectId({ default: null })).to('sub_categories', <any>models.Category),
    product_id: Type.ref(Type.objectId({ default: null })).to('products', <any>models.Products),
    brand_id: Type.ref(Type.objectId({ default: null })).to('brands', <any>models.Brands),
    discount_percentage: Type.string({ default: null }),
    is_removed: Type.boolean({ default: false }),
    created_at: Type.string({ default: +new Date() })
})
const Discounts = typedModel('discounts', DiscountSchema)
export default Discounts
