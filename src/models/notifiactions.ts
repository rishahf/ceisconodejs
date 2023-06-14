import { createSchema, Type, typedModel } from 'ts-mongoose';
import * as Models from './index';

const type = [
  "PHONE_VERIFICATION_SUCCESS",
  "ORDER_CREATED",
  "ORDER_CANCELLED_BY_SELLER",
  "NEW_ORDER",
  "CONFIRMED_ORDER",
  "ORDER_DELIVERED",
  "DELIVERED_ORDER",
  "DELIVERED",
  "ORDER_DELIVERED",
  "DELIVERED",
  "CANCELLED",
  "ORDER_CANCELLED",
  "ORDER_CANCELLED_REQUEST",
  "ORDER_CANCELLED_REQUESTED",
  "REQUEST_CANCELLED",
  "REQUESTED_CANCELLED",
  "CANCELLED_ORDER",
  "NEW_PRODUCTS_ADDED",
  "ORDER_SHIPPED",
  "SHIPPED",
  "NEW_REVIEW",
  "NEW_NOTIFICATION",
];

const language = [ "ENGLISH", "ARABIC" ]

const NotificationSchema = createSchema({
  user_id: Type.ref(Type.objectId({ default: null })).to("users",<any>Models.Users),
  seller_id: Type.ref(Type.objectId({ default: null })).to("sellers",<any>Models.Sellers),
  admin_id: Type.ref(Type.objectId({ default: null })).to("admins",<any>Models.Admin),
  product_id: Type.ref(Type.objectId({ default: null })).to("products",<any>Models.Products),
  order_id: Type.ref(Type.objectId({ default: null })).to("orders",<any>Models.Orders),
  orderProduct_id: Type.ref(Type.objectId({ default: null })).to("order_products",<any>Models.OrderProducts),
  title: Type.string({ default: null }),
  type: Type.string({ default: null, enum: type }),
  images: Type.array().of(Type.string({ default: [] })),
  message: Type.string({ default: null }),
  read_by_user: Type.boolean({ default: false }),
  read_by_seller: Type.boolean({ default: false }),
  read_by_admin: Type.boolean({ default: false }),
  clear_for_user: Type.boolean({ default: false }),
  clear_for_seller: Type.boolean({ default: false }),
  clear_for_admin: Type.boolean({ default: false }),
  // previous_seller: Type.boolean({ default: false }),
  // previous_user: Type.boolean({ default: false }),
  // previous_admin: Type.boolean({ default: false }),
  language: Type.string({ default: "ENGLISH",enum:language }),
  created_at: Type.string({ default: +new Date() }),
});


const Notifications = typedModel('notifications', NotificationSchema);
export default Notifications