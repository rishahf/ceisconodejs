import { createSchema, Type, typedModel } from 'ts-mongoose';
import { models } from "mongoose";
const order_status = [
    "PENDING", "PLACED", "DELIVERED", "CANCELLED"]

const CartSchema = createSchema({
    user_id     : Type.ref(Type.objectId({ default: null })).to('users', <any>models.Users),
    product_id  : Type.ref(Type.objectId({ default: null })).to('products', <any>models.Products),
    quantity    : Type.number({ default: 0 }),
    updated_at  : Type.string({ default : +new Date() }),
    created_at  : Type.string({ default: +new Date() })
})
const Cart = typedModel('cart', CartSchema)
export default Cart



    // total_price: Type.number({ default: null }),
    // order_status: Type.string({
    //     default: 'PENDING',
    //     enum: order_status
    // }),
    // is_removed: Type.boolean({ default: false }),

// const CartSchema = createSchema({
//     user_id: Type.ref(Type.objectId({ default: null })).to('users', <any>models.Users),
//     products : Type.array().of({
//         product_id : Type.ref(Type.objectId({ default: null })).to('products', <any>models.Products),
//         price: Type.number({ default: 0 }),
//         quantity : Type.number({ default: 0 }),
//         total_price: Type.number({ default: 0 })
//     }),
//     total_price: Type.number({ default: 0 }),
//     total_quantity : Type.number({ default: 0 }),
//     order_status: Type.string({default: 'PENDING', enum: order_status }),    
//     created_at: Type.string({ default: +new Date() })
// })
// const Cart = typedModel('cart', CartSchema)
// export default Cart