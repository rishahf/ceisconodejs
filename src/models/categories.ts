import { createSchema, Type, typedModel } from 'ts-mongoose';

const design_type = [ "1 for VERTICALLY" , "2 for HORIZONTALLY"]
const language = ["ENGLISH","ARABIC"]

const CategorySchema = createSchema({
  name: Type.string({ default: null }),
  design_type: Type.number({ default: 1 }),
  is_deleted: Type.boolean({ default: false }),
  updated_at: Type.string({ default: +new Date() }),
  language: Type.string({ default: "ENGLISH", enum: language }),
  created_at: Type.string({ default: +new Date() }),
});

const Category = typedModel('categories', CategorySchema)
export default Category
