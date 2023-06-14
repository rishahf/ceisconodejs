import { createSchema, Type, typedModel } from 'ts-mongoose';
import { Orders, Products, Sellers, Users  } from "./index";

const shippo_data = Type.object().of({
    shipment_id     : Type.string({ default: null }),
    parcel_id       : Type.string({ default: null }),
    rate_id         : Type.string({ default: null }),
    transaction_id  : Type.string({ default: null }),
    tracking_no     : Type.string({ default: null }),
    service_level   : Type.string({ default: null }),
    refund_id       : Type.string({ default: null }),
    estimated_days  : Type.string({ default: null }),
    label_url       : Type.string({ default: null })
})

const address_data = Type.object().of({
    name     : Type.string({ default: null }),
    country_code            : Type.string({ default: null }),
    phone_no                : Type.number({ default: null }),
    company                 : Type.string({ default: null }),
    country                 : Type.string({ default: null }),
    state                   : Type.string({ default: null }),
    city                    : Type.string({ default: null }),
    pin_code                : Type.string({ default: null }),
    apartment_number        : Type.string({ default: null }),
    full_address            : Type.string({ default: null }),
    address_type            : Type.string({ default: null }),
    lat  : Type.string({ default: null }),
    lng  : Type.string({ default: null }),
})

const language = ["ENGLISH", "ARABIC"];

const seller_address = Type.object().of({
    name                    : Type.string({ default: null }),
    country_code            : Type.string({ default: null }),
    phone_no                : Type.number({ default: null }),
    company                 : Type.string({ default: null }),
    country                 : Type.string({ default: null }),
    state                   : Type.string({ default: null }),
    city                    : Type.string({ default: null }),
    pin_code                : Type.string({ default: null }),
    apartment_number        : Type.string({ default: null }),
    full_address            : Type.string({ default: null }),
    address_type            : Type.string({ default: null }),
    lat  : Type.string({ default: null }),
    lng  : Type.string({ default: null }),
})
const order_status = [ "PLACED", "CONFIRMED", "DELIVERED", "CANCELLED","DISPUTE","RETURNED","REFUND_IN_PROGESS","REFUNDED","PENDING_CANCELLATION" ]
const delivery_status = [ "PENDING", "CONFIRMED", "PAID", "SHIPPED", "DISPACHED", "DELIVERED", "CANCELLED" ]
const cancelled_by = [null, "BY_USER", "BY_SELLER"];
const payment_status = ["SUCCESS", "REFUNDED", "REFUND_IN_PROGESS"];
const cancellation_reason = [
  null,
  "DO_NOT_LIKE_THE_ITEM",
  "DEFFECTIVE_ITEM",
  "ADDRESS_ISSUE",
  "FOR_OTHER_REASON",
  "OUT_OF_STOCK",
  "ORDER_CANCELLED_BY_SELLER",
];


const OrderProductsSchema = createSchema({
    order_id        : Type.ref(Type.objectId({ default: null })).to('orders', <any>Orders),
    product_order_id  : Type.string({ default : null }),
    product_id      : Type.ref(Type.objectId({ default: null })).to('products', <any>Products),
    user_id         : Type.ref(Type.objectId({ default: null })).to('users', <any>Users),
    seller_id       : Type.ref(Type.objectId({ default: null })).to('sellers', <any>Sellers),
    tax_no          : Type.string({ default  : null }),
    quantity        : Type.number({ default  : 0 }),
    price           : Type.number({ default : 0 }),
    discount_percantage: Type.number({ default : 0 }),
    discount_price  : Type.number({ default : 0 }),
    delivery_price  : Type.number({ default : 0 }),
    coupon_discount : Type.number({ default : 0 }),
    total_price     : Type.number({ default : 0 }),
    total_earnings  : Type.number({ default : 0 }),
    admin_commision : Type.number({ default : 0 }),
    tax_percentage  : Type.number({ default  : 0 }),
    tax_amount      : Type.number({ default  : 0 }),
    shippo_data     : shippo_data,
    order_status    : Type.string({ default : 'PLACED', enum : order_status }),
    previous_status : Type.string({default: null}),
    // delivery_status : Type.string({ default : 'PENDING', enum : delivery_status }),
    cancelled_by        : Type.string({ default :null, enum:cancelled_by }),
    cancellation_reason : Type.string({ default : null, enum : cancellation_reason }),
    description         : Type.string({ default : null }),
    cancel_requested    : Type.boolean({ default:false }),
    cancel_request_accepted   : Type.boolean({ default:false }),
    payment_status   : Type.string({ default:"SUCCESS", enum:payment_status }),
    cancelled_at        : Type.string({ default :null }),
    delivery_date   : Type.string({ default : null }),
    shipped_at      : Type.string({ default : null }),
    tracking_link   : Type.string({ default : null }),
    refund_id       : Type.string({ default: null }),
    updated_at      : Type.string({ default : +new Date() }),
    address_data    : address_data,
    language            : Type.string({default: "ENGLISH", enum:language}),
    created_at      : Type.string({ default : +new Date() })
})

const OrderProducts = typedModel('order_products', OrderProductsSchema)
export default OrderProducts






    // coupon_code     : Type.string({ default : null }),
    // coupon_discount : Type.number({ default : 0 }),
    // delivery_price  : Type.number({ default : 0 }),