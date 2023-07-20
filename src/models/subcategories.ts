import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";

const language = ["ENGLISH","ARABIC"]
const size_type = [null, "NUMBER","STRING"]

const SubCatergorySchema = createSchema({
    category_id : Type.ref(Type.objectId({ default: null })).to('categories', <any>models.Category),
    name        : Type.string({ default: null }),
    size_type   : Type.string({ default: null, enum:size_type }),
    is_deleted  : Type.boolean( { default: false }),
    language  : Type.string({ default: "ENGLISH", enum:language }),
    updated_at  : Type.string({ default : +new Date() }),
    created_at  : Type.string({ default: +new Date() })
})
const SubCategory = typedModel('subcategories', SubCatergorySchema)
export default SubCategory
