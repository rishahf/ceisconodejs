declare class admin_featured_categories {
    static add: (req: any) => Promise<unknown>;
    static update: (req: any) => Promise<unknown>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static detail_fc: (req: any) => Promise<any>;
    static enable_disable_fc: (req: any) => Promise<string>;
    static delete: (req: any) => Promise<string>;
}
declare class user_featured_categories {
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
export { admin_featured_categories, user_featured_categories };
