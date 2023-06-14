import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index'

const ShippingSchema = createSchema({
    name: Type.string({ default: null }),
    company: Type.string({ default: null }),
    street1: Type.string({ default: null}),
    city: Type.string({ default: null }),
    state: Type.string({ default: null }),
    zip: Type.string({ default: null}),
    country: Type.string({ default: null}),
    phone: Type.number({ default: null}),
    email: Type.string({ default: null}),
    created_at: Type.string({ default: +new Date()}),
})

const Shipping = typedModel('shipping', ShippingSchema);
export default Shipping