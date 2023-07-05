"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const mongoose_1 = require("mongoose");
const order_status = [
    "PENDING", "PLACED", "DELIVERED", "CANCELLED"
];
const CartSchema = (0, ts_mongoose_1.createSchema)({
    user_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('users', mongoose_1.models.Users),
    product_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('products', mongoose_1.models.Products),
    quantity: ts_mongoose_1.Type.number({ default: 0 }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Cart = (0, ts_mongoose_1.typedModel)('cart', CartSchema);
exports.default = Cart;
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
