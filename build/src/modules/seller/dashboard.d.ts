export default class dashboard_module {
    static count: (req: any) => Promise<{
        total_products: unknown;
        out_of_stock: unknown;
        alert_of_stock: unknown;
        total_orders: unknown;
        total_reviews: unknown;
        total_ratings: number;
        total_earnings: number;
    }>;
    static out_of_stock_count: (req: any) => Promise<unknown>;
    static alert_of_stock_count: (req: any) => Promise<unknown>;
    static total_orders: (req: any) => Promise<unknown>;
    static total_reviews: (req: any) => Promise<unknown>;
    static total_ratings: (req: any) => Promise<number>;
    static total_earnings: (req: any) => Promise<number>;
}
