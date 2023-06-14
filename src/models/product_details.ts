import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';

const ProductDetailSchema = createSchema({
   product_id     :  Type.ref(Type.objectId({ default: null })).to('products', <any>Models.Products),
   key            :  Type.string({ default: null }),
   value          :  Type.string({ default: null }),
   unique_number  :  Type.number({ default : 0 }),
   updated_at     :  Type.string({ default : +new Date() }),
   created_at     :  Type.string({ default : +new Date() }),
   
})

const ProductDetails = typedModel('productdetails', ProductDetailSchema);
export default ProductDetails