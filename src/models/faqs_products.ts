import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';

const language = ["ENGLISH", "ARABIC"];

const FaqSchema = createSchema({
    product_id  : Type.ref(Type.objectId({ default: null })).to('products', <any>Models.Products),
    seller_id   :Type.ref(Type.objectId({ default: null })).to('sellers', <any>Models.Sellers),
    question    : Type.string({ default: null }),
    answer      : Type.string({ default: null }),
    language    : Type.string({default: "ENGLISH", enum:language}),
    updated_at  : Type.string({ default : +new Date() }),
    created_at  : Type.string({ default: +new Date() }),
})

const FaqsProducts = typedModel("faqs_products", FaqSchema);
export default FaqsProducts