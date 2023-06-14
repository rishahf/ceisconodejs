import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";


const HotdealSchema = createSchema({
    subcategory_id: Type.ref(Type.objectId({ default: null })).to('subcategories', <any>models.SubCategory),
    title: Type.string({ default: null }),
    sub_title: Type.string({ default: null }),
    price_description: Type.string({ default: null }),
    image: Type.string({ default: null }),
    is_removed: Type.boolean({ default: false }),
    created_at: Type.string({ default: +new Date() })
})
const Hot_deals = typedModel('hot_deals', HotdealSchema)
export default Hot_deals
