export default class cart_module {
    static add: (req: any) => Promise<unknown>;
    static check_cart: (product_id: string, user_id: string) => Promise<unknown>;
    static check_quantity: (product_id: string) => Promise<any>;
    static edit: (req: any) => Promise<unknown>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static delete: (req: any) => Promise<{
        message: string;
    }>;
    static price_details: (req: any) => Promise<{
        price: number;
        discount: number;
        total_price: number;
    }>;
}
