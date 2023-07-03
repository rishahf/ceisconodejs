export declare class order_module {
    static list: (req: any) => Promise<{
        total_count: any;
        data: unknown;
    }>;
    static details: (req: any) => Promise<any>;
    static user_orders: (req: any) => Promise<{
        total_count: any;
        data: unknown;
    }>;
    static list_orderReviews: (req: any) => Promise<{
        total_count: any;
        data: unknown;
    }>;
    static invoiceData: (req: any) => Promise<any>;
    static order_products_details: (req: any) => Promise<any>;
}
export declare class cancel_order_module {
    static cancel: (req: any) => Promise<{
        message: string;
    }>;
    static create_refund: (payment_intent: string) => Promise<string>;
    static update_order_products: (order_id: string) => Promise<void>;
    static inc_product_quantity: (product_id: string, quantity: number) => Promise<void>;
}
