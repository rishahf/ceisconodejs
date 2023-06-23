declare class admin_style_for_categories {
    static add: (req: any) => Promise<unknown>;
    static update: (req: any) => Promise<unknown>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static delete: (req: any) => Promise<string>;
    static en_dis_sfc: (req: any) => Promise<string>;
}
declare class user_style_for_categories {
    static list: (req: any) => Promise<{
        total_count: any;
        data: unknown;
    }>;
    static retrive_sections_data: () => Promise<unknown>;
    static retrive_data: (req: any) => Promise<{
        total_count: any;
        data: unknown;
    }>;
}
export { admin_style_for_categories, user_style_for_categories };
