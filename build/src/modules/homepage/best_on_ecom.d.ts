declare class admin_best_on_ecom {
    static add: (req: any) => Promise<unknown>;
    static update: (req: any) => Promise<unknown>;
    static enable_disable: (req: any) => Promise<string>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static detail: (req: any) => Promise<any>;
    static delete: (req: any) => Promise<string>;
}
declare class user_best_on_ecom {
    static homepageCoupon: (req: any) => Promise<any>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static retrive_sections_data: () => Promise<unknown>;
    static retrive_boe: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
}
export { admin_best_on_ecom, user_best_on_ecom };
