import { createSchema, Type, typedModel } from 'ts-mongoose';
import { Users, Address, Cards, Products, Sellers } from "./index";

const reference = [
    Type.ref(Type.objectId({ default: null })).to('users', <any>Users),
    Type.ref(Type.objectId({ default: null })).to('address', <any>Address),
    Type.ref(Type.objectId({ default: null })).to('cards', <any>Cards),
]

const stripe_data = Type.object().of({
    payment_intent  : Type.string({ default: null }),
    refund_id       : Type.string({ default: null })
})

const language = ["ENGLISH", "ARABIC"];
const  cancelled_by = [ null, "BY_USER","BY_SELLER"]
const payment_mode = ["CASH_ON_DELIVERY", "BY_CARD"]
const payment_status = ["SUCCESS","REFUNDED", "REFUND_IN_PROGESS"];
const cancellation_reason = [
    null, 
    "DO_NOT_LIKE_THE_ITEM", 
    "DEFFECTIVE_ITEM", 
    "ADDRESS_ISSUE", 
    "FOR_OTHER_REASON", 
    "OUT_OF_STOCK",
    "ORDER_CANCELLED_BY_SELLER"
]

const OrderSchema = createSchema({
    order_id            : Type.string({ default : null }),
    user_id             : reference[0],
    address_id          : reference[1],
    card_id             : reference[2],
    coupon_code         : Type.string({ default : null }),
    coupon_discount     : Type.number({ default : 0 }),
    total_price         : Type.number({ default : 0 }),
    total_earnings      : Type.number({ default : 0 }),
    payment_mode        : Type.string({ default : null, enum : payment_mode }),
    stripe_data         : stripe_data,
    cancelled_by        : Type.string({ default :null, enum:cancelled_by }),
    cancellation_reason : Type.string({ default : null, enum : cancellation_reason }),
    description         : Type.string({ default : null }),
    cancel_requested    : Type.boolean({ default:false }),
    cancel_request_accepted   : Type.boolean({ default:false }),
    payment_status   : Type.string({ default:"SUCCESS", enum:payment_status }),
    cancelled_at        : Type.string({ default :null }),
    language            : Type.string({default: "ENGLISH", enum:language}),
    updated_at          : Type.string({ default : +new Date() }),
    created_at          : Type.string({ default : +new Date() })
})
const Orders = typedModel('orders', OrderSchema)
export default Orders





// products            : products,
// const products = Type.array().of({
//     product_id : Type.ref(Type.objectId({ default: null })).to('products', <any>Products),
//     seller_id  : Type.ref(Type.objectId({ default: null })).to('sellers', <any>Sellers),
//     quantity   : Type.number({ default  : 0 })
// })


// const OrderSchema = createSchema({
//     quantity            : Type.number({ default: 1 }),
//     order_id            : Type.string({ default: null }),
//     user_id             : Type.ref(Type.objectId({ default: null })).to('users', <any>models.Users),
//     product             : Type.ref(Type.objectId({ default: null })).to('products', <any>models.Products),
//     address_id          : Type.ref(Type.objectId({ default: null })).to('address', <any>models.Address),
//     card_id             : Type.ref(Type.objectId({ default: null })).to('cards', <any>models.Cards),
//     delivery_charges    : Type.number({ default: null }),
//     discount            : Type.number({ default: null }),
//     coupon              : Type.number({ default: null }),
//     total_price         : Type.number({ default: null }),
//     coupon_code         : Type.string({ default: null }),
//     shipment_id         : Type.string({ default: null }),
//     parcel_id           : Type.string({ default: null }),
//     transaction_id      : Type.string({ default: null }),
//     tracking_number     : Type.string({ default: null }),
//     servicelevel        : Type.string({ default: null }),
//     refund_id           : Type.string({ default: null }),
//     estimated_days      : Type.string({ default: null }),
//     label_url           : Type.string({ default: null }),
//     rate_id             : Type.string({ default: null }),
//     order_status        : Type.string({ default: 'PENDING', enum: order_status }),
//     delivery_status     : Type.string({ default: 'CONFIRMED', enum: delivery_status }),
//     payment_mode        : Type.string({ default: null, enum: payment_mode }),
//     is_removed          : Type.boolean({ default: false }),
//     _is_sold            : Type.boolean({ default: false }),
//     cancellation_reason : Type.string({ default: null, enum: cancellation_reason }),
//     created_at          : Type.string({ default: +new Date() })
// })
// const Orders = typedModel('orders', OrderSchema)
// export default Orders