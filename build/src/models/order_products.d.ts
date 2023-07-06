/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const OrderProducts: import("mongoose").Model<import("mongoose").Document<any> & {
    description: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    language: string;
    user_id: any;
    seller_id: any;
    updated_at: string;
    quantity: number;
    tax_percentage: number;
    price: number;
    discount_percantage: number;
    discount_price: number;
    product_id: any;
    order_id: any;
    coupon_discount: number;
    total_price: number;
    total_earnings: number;
    refund_id: string;
    cancelled_by: string;
    cancellation_reason: string;
    cancel_requested: boolean;
    cancel_request_accepted: boolean;
    payment_status: string;
    cancelled_at: string;
    product_order_id: string;
    tax_no: string;
    delivery_price: number;
    admin_commision: number;
    tax_amount: number;
    shippo_data: {
        parcel_id?: string;
        refund_id?: string;
        shipment_id?: string;
        rate_id?: string;
        transaction_id?: string;
        tracking_no?: string;
        service_level?: string;
        estimated_days?: string;
        label_url?: string;
    };
    order_status: string;
    previous_status: string;
    delivery_date: string;
    shipped_at: string;
    tracking_link: string;
    address_data: {
        name?: string;
        company?: string;
        country?: string;
        state?: string;
        city?: string;
        full_address?: string;
        country_code?: string;
        phone_no?: number;
        pin_code?: string;
        apartment_number?: string;
        address_type?: string;
        lat?: string;
        lng?: string;
    };
} & {
    user_id?: unknown;
    seller_id?: unknown;
    product_id?: unknown;
    order_id?: unknown;
}> & {
    [name: string]: Function;
};
export default OrderProducts;
