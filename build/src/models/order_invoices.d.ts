/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const OrderInvoices: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    updated_at: string;
    order_product_id: any;
    status: string;
    invoice_id: string;
} & {
    order_product_id?: unknown;
}> & {
    [name: string]: Function;
};
export default OrderInvoices;
