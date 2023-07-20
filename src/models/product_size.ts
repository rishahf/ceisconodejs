import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as models from './index';

const SizeSchema = createSchema({
  category_id  : Type.ref(Type.objectId({ default: null })).to('subcategories', <any>models.SubCategory),
  size: Type.string({ default: null }),
  is_deleted: Type.boolean({ default: false }),
  updated_at: Type.string({ default: +new Date() }),
  created_at: Type.string({ default: +new Date() }),
});

const Size = typedModel('sizes', SizeSchema)
export default Size