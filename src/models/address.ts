import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";
const address_type = [
    "HOME", "WORK"
]

const language = ["ENGLISH", "ARABIC"];

const AddressSchema = createSchema({
    name                    : Type.string({ default: null }),
    user_id                 : Type.ref(Type.objectId({ default: null })).to('users', <any>models.Users),
    country_code            : Type.string({ default: null }),
    phone_no                : Type.number({ default: null }),
    company                 : Type.string({ default: null }),
    country                 : Type.string({ default: null }),
    state                   : Type.string({ default: null }),
    city                    : Type.string({ default: null }),
    pin_code                : Type.string({ default: null }),
    apartment_number        : Type.string({ default: null }),
    full_address            : Type.string({ default: null }),
    shippo_user_address_id  : Type.string({ default: null }),
    address_type            : Type.string({ default: "HOME", enum: address_type }),
    location                : { 
        type: Type.string({ default: "Point" }),
        coordinates: Type.array().of(Type.number({ default: [0, 1] })),
    },
    lat                     : Type.string({ default: null }),
    lng                     : Type.string({ default: null }),
    language                : Type.string({default: "ENGLISH", enum:language}),
    is_default              : Type.boolean({ default: false }),
    is_deleted              : Type.boolean({ default: false }),
    created_at              : Type.string({ default: +new Date() })
})

AddressSchema.index({ location: "2dsphere" });

const Address = typedModel('address', AddressSchema)
export default Address
