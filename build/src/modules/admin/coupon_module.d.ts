export default class coupon_module {
    static add: (req: any) => Promise<unknown>;
    static edit: (req: any) => Promise<unknown>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static details: (req: any) => Promise<any>;
    static delete: (req: any) => Promise<{
        message: string;
    }>;
    static homepage_coupon: (req: any) => Promise<any>;
}
