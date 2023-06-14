import { createSchema, Type, typedModel } from "ts-mongoose";

const language = [ "ENGLISH", "ARABIC"]

const BrandSchema = createSchema({
    name        : Type.string({ default: null }),
    is_deleted  : Type.boolean({ default: false }),
    updated_at  : Type.string({ default : +new Date() }),
    created_at  : Type.string({ default: +new Date() }),
    language  : Type.string({ default: "ENGLISH", enum:language }),
});
const Brands = typedModel("brands", BrandSchema);
export default Brands;
