import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";

const DeliveryAddressSchema = createSchema({
    product_id              : Type.ref(Type.objectId({ default: null })).to('products', <any>models.Products),
    address                 : Type.string({ default: null }),
    country                 : Type.string({ default: null }),
    location                : { 
        type: Type.string({ default: "Point" }),
        coordinates: Type.array().of(Type.number({ default: [0, 1] })),
    },
    radius                  : Type.number({ default: 0 }),
    units                   : Type.string({ default: null }),
    delivery_time           : Type.string({ default: null }),
    created_at              : Type.string({ default: +new Date() })
})
DeliveryAddressSchema.index({ location: "2dsphere" });

const Delivery_Locations = typedModel('delivery_locations', DeliveryAddressSchema)
export default Delivery_Locations


