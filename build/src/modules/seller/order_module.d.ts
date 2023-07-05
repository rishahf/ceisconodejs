export declare class order_module {
    static list: (req: any) => Promise<{
        total_count: any;
        data: unknown;
    }>;
    static details: (req: any) => Promise<any>;
    static order_status: (req: any) => Promise<any>;
    static invoice_details: (req: any) => Promise<any>;
    static list_transactions: (req: any) => Promise<{
        total_count: any;
        data: unknown;
    }>;
    static list_order_reviews: (req: any) => Promise<{
        total_count: any;
        data: unknown;
    }>;
    static listNotifications: (req: any) => Promise<{
        unread_count: any;
        read_notifications: unknown;
        unread_notifications: any;
    }>;
    static markReadNotifications: (req: any) => Promise<{
        message: string;
    }>;
    static clearNotifications: (req: any) => Promise<{
        message: string;
    }>;
    static ReadNotification: (req: any) => Promise<{
        message: string;
    }>;
    static ordersDelivery: () => Promise<{
        message: string;
    }>;
}
export declare class cancel_order_module {
    static cancel: (req: any) => Promise<{
        message: string;
    }>;
    static cancel1: (req: any) => Promise<{
        message: string;
    }>;
    static approve_cancellation_request: (req: any) => Promise<{
        message: string;
    }>;
    static cancellation_request1: (req: any) => Promise<{
        message: string;
    }>;
    static create_refund: (payment_intent: string, amount: any) => Promise<string>;
    static update_order_products: (order_id: string) => Promise<void>;
    static inc_product_quantity: (product_id: string, quantity: number) => Promise<void>;
}
