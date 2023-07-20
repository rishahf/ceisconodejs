import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";

const language = ["ENGLISH","ARABIC"]

const SubCatergorySchema = createSchema({
    category_id : Type.ref(Type.objectId({ default: null })).to('categories', <any>models.Category),
    name        : Type.string({ default: null }),
    size_in_number: Type.number({default: null}),
    size_in_string: Type.string({default: null}),
    is_deleted  : Type.boolean( { default: false }),
    language  : Type.string({ default: "ENGLISH", enum:language }),
    updated_at  : Type.string({ default : +new Date() }),
    created_at  : Type.string({ default: +new Date() })
})
const SubCategory = typedModel('subcategories', SubCatergorySchema)
export default SubCategory
