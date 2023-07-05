declare class stripe_payments {
    static create_pi: (req: any, total_price: number) => Promise<{
        payment_intent: string;
    }>;
    static retrive_card_details: (card_id: string, user_id: string) => Promise<unknown>;
}
export default class order_module extends stripe_payments {
    static create: (req: any) => Promise<unknown>;
    static calculate_total_price: (req: any) => Promise<{
        product_price: number;
        coupon_discount: number;
    }>;
    static cal_product_price: (req: any, discount_price: number, quantity: number) => Promise<{
        product_price: number;
        coupon_discount: number;
    }>;
    static calculate_coupon_discount: (user_id: string, coupon_code: string, price: number) => Promise<number>;
}
export {};
