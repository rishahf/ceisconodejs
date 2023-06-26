/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Orders: import("mongoose").Model<import("mongoose").Document<any> & {
    description: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    language: string;
    user_id: any;
    updated_at: string;
    order_id: string;
    address_id: any;
    card_id: any;
    coupon_code: string;
    coupon_discount: number;
    total_price: number;
    total_earnings: number;
    payment_mode: string;
    stripe_data: {
        payment_intent?: string;
        refund_id?: string;
    };
    cancelled_by: string;
    cancellation_reason: string;
    cancel_requested: boolean;
    cancel_request_accepted: boolean;
    payment_status: string;
    cancelled_at: string;
} & {
    user_id?: unknown;
    address_id?: unknown;
    card_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Orders;
