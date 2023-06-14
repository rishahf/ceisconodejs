import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';

const VariationSchema = createSchema({
    product_id_1  : Type.ref(Type.objectId({ default: null })).to('products', <any>Models.Products),
    product_id_2    : Type.ref(Type.objectId({ default: null })).to('products', <any>Models.Products),
    // variants_ids   : Type.array().of(Type.ref(Type.objectId({ default: null })).to('products', <any>Models.Products)),
    updated_at  : Type.string({ default : +new Date() }),
    created_at  : Type.string({ default: +new Date() })
    // title       : Type.string({default:null}),
    // images      : Type.array().of(Type.string({ default: [] })),
    // price       : Type.number({default:0}),
})
const Product_Variations = typedModel('product_variations', VariationSchema)
export default Product_Variations
