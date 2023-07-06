declare class admin_shop_with_us {
    static add: (req: any) => Promise<unknown>;
    static update: (req: any) => Promise<unknown>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static enable_disable: (req: any) => Promise<string>;
    static detail_shop_with_us: (req: any) => Promise<any>;
    static delete: (req: any) => Promise<string>;
}
declare class user_shop_with_us {
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static retrive_sections_data: () => Promise<unknown>;
    static retrive_data: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
}
export { admin_shop_with_us, user_shop_with_us };
