import { createSchema, Type, typedModel } from 'ts-mongoose';
import { Users, Products, Sellers, OrderProducts, Orders } from "./index";

const language = ["ENGLISH", "ARABIC"];

const ReviewSchema = createSchema({
   user_id     : Type.ref(Type.objectId({ default: null })).to('users', <any>Users),
   product_id  : Type.ref(Type.objectId({ default: null })).to('products', <any>Products),
   seller_id   : Type.ref(Type.objectId({ default: null })).to('sellers', <any>Sellers),
   title       : Type.string({default  : null }),
   description : Type.string({default  : null}),
   ratings     : Type.number({ default : 0, min : 1, max : 5 }),
   images      : Type.array().of(Type.string({ default : [] })),
   language            : Type.string({default: "ENGLISH", enum:language}),
   updated_at  : Type.string({ default : +new Date() }),
   created_at  : Type.string({ default : +new Date() })
})

const Reviews = typedModel('reviews', ReviewSchema)
export default Reviews
