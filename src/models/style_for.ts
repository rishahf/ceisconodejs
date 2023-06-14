import { createSchema, Type, typedModel } from 'ts-mongoose';

const language = ["ENGLISH", "ARABIC"]

const StyleForSchema = createSchema({
    name        : Type.string({ default: null }),
    is_deleted  : Type.boolean({ default: false }),
    language            : Type.string({ default: "ENGLISH", enum:language }),
    updated_at  : Type.string({ default: +new Date() }),
    created_at  : Type.string({ default: +new Date() })

})
const StyleFor = typedModel('style_for', StyleForSchema)
export default StyleFor


// Listing of Deal Categories - Params: Image, Title, Price, Category level 1, Category level 2, Category level 3, Brand, Discount
// Option to Enable / Disable this section