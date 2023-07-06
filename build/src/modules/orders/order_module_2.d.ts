import mongoose from "mongoose";
import Stripe from 'stripe';
declare class stripe_payments {
    static create_pi: (req: any, price_data: any, order_id: string) => Promise<{
        payment_intent: string;
    }>;
    static retrive_card_details: (card_id: string, user_id: string) => Promise<any>;
    static delete_order_if_error: (order_id: string) => Promise<void>;
}
declare class order_module extends stripe_payments {
    static createInvoice: () => Promise<string>;
    static create: (req: any) => Promise<unknown>;
    static send_order_mail1: (user_detail: any, order_id: any, products_to_order: any) => Promise<void>;
    static send_order_mail: (user_detail: any, order_id: any, products_to_order: any) => Promise<void>;
    static check_coupon_code: (coupon_code: string, user_id: string) => Promise<any>;
    static save_order_products: (order_id: string, req: any, coupon_data: any) => Promise<{
        total_price: number;
        total_cd: number;
        total_earnings: number;
        images_array: any;
    }>;
    static get_address_detail: (address_id: string) => Promise<any>;
    static save_invoice: (order_id: any) => Promise<void>;
    static admin_fees: () => Promise<number>;
    static dec_product_quantity: (product_id: string, quantity: number) => Promise<void>;
    static update_total_price: (req: any, order_data: any, price_data: any) => Promise<unknown>;
    static cal_coupon_discount: (coupon_data: any, tt_price: number, user_id: any) => Promise<number>;
    static check_product_in_coupon: (product_id: any, coupon_data: any) => Promise<void>;
    static order_response: (order_id: string) => Promise<unknown>;
    static check_coupon1(req: any): Promise<any>;
    static check_coupon(req: any): Promise<{
        coupon_discount: number;
        response: any;
    }>;
    static check_delivery(req: any): Promise<boolean>;
    static match_product_id: (product_id: string) => Promise<{
        $match: {
            product_id: mongoose.Types.ObjectId;
        };
    }>;
    static find_nearest(long_from: any, lat_from: any): Promise<{
        $match: {
            "location.coordinates": {
                $geoWithin: {
                    $centerSphere: any[];
                };
            };
        };
    }>;
    static find_geo_near(long: number, lat: number, get_kms: any, product_id: string): Promise<{
        $geoNear: {
            near: {
                type: string;
                coordinates: number[];
            };
            key: string;
            distanceField: string;
            maxDistance: number;
            spherical: boolean;
            query: {
                product_id: mongoose.Types.ObjectId;
            };
        };
    }>;
}
declare class order_listing_module {
    static list: (req: any) => Promise<{
        total_count: any;
        data: any;
    }>;
    static retrive_product_ratings: (product_id: string) => Promise<unknown>;
    static details: (req: any) => Promise<any>;
    static order_products_details: (req: any) => Promise<any>;
    static order_products_invoice_details: (req: any) => Promise<any>;
    static payment_status: (req: any) => Promise<Stripe.Response<Stripe.PaymentIntent>>;
}
declare class cancel_order_module {
    static cancel1: (req: any) => Promise<{
        message: string;
    }>;
    static cancel: (req: any) => Promise<{
        message: string;
    }>;
    static seller_fcms: (seller_id: string) => Promise<any>;
    static customer_fcms: (user_id: string) => Promise<any>;
    static create_refund: (payment_intent: string) => Promise<string>;
    static cancelRequest: (req: any) => Promise<{
        message: string;
    }>;
    static cancelRequest1: (req: any) => Promise<{
        message: string;
    }>;
    static update_order_products: (order_id: string) => Promise<void>;
    static update_order_product_cancellation_request: (order_id: string) => Promise<void>;
    static dec_product_quantity: (product_id: string, quantity: number) => Promise<void>;
    static inc_product_quantity: (product_id: string, quantity: number) => Promise<void>;
}
export { order_module, order_listing_module, cancel_order_module };
