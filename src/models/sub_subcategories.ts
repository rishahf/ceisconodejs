import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";

const language = [ "ENGLISH","ARABIC"]

const Sub_subcategorySchema = createSchema({
    subcategory_id  : Type.ref(Type.objectId({ default: null })).to('subcategories', <any>models.SubCategory),
    name            : Type.string({ default: null }),
    is_deleted      : Type.boolean( { default: false }),
    language  : Type.string({ default: "ENGLISH", enum:language }),
    updated_at      : Type.string({ default : +new Date() }),
    created_at      : Type.string({ default: +new Date() })
})
const Sub_subcategories = typedModel('sub_subcategories',  Sub_subcategorySchema)
export default Sub_subcategories