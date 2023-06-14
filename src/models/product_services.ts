import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';

const ProductServicesSchema = createSchema({
    product_id  : Type.ref(Type.objectId({ default : null })).to('products', <any>Models.Products),
    content     : Type.string({default : null}),
    updated_at  :  Type.string({ default : +new Date() }),
    created_at  :  Type.string({ default : +new Date() }),
})
const Product_Services = typedModel('product_services', ProductServicesSchema)
export default Product_Services