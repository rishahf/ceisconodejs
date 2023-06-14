import { createSchema, Type, typedModel } from "ts-mongoose";
import { OrderProducts } from "./index";

const stripe_data = Type.object().of({
  payment_intent: Type.string({ default: null }),
  refund_id: Type.string({ default: null }),
});

const status = ["ACTIVE", "CANCELLED"];
const cancellation_reason = [
  null,
  "DO_NOT_LIKE_THE_ITEM",
  "DEFFECTIVE_ITEM",
  "ADDRESS_ISSUE",
  "FOR_OTHER_REASON",
  "ORDER_CANCELLED_BY_SELLER",
];

const InvoiceSchema = createSchema({
  order_product_id: Type.ref(Type.objectId({ default: null })).to('order_products', <any>OrderProducts),
  status          : Type.string({default:"ACTIVE", enum:status}),
  invoice_id      : Type.string({ default: 0 }),
  updated_at: Type.string({ default: +new Date() }),
  created_at: Type.string({ default: +new Date() }),
});
const OrderInvoices = typedModel("order_invoices", InvoiceSchema);
export default OrderInvoices;
