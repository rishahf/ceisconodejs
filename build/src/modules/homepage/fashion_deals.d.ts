declare class admin_fashion_deals_module {
    static add_fashion_deals: (req: any) => Promise<unknown>;
    static update_fashion_deals: (req: any) => Promise<unknown>;
    static list_fashion_deals: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static en_dis_fashion_deals: (req: any) => Promise<string>;
    static detail_fashion_deals: (req: any) => Promise<any>;
    static delete_fashion_deals: (req: any) => Promise<string>;
}
declare class user_fashion_deals_module {
    static user_list_fashion_deals: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static retrive_sections_data: () => Promise<unknown>;
    static retrive_fashion_deals: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
}
export { admin_fashion_deals_module, user_fashion_deals_module };
