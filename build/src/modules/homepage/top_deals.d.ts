declare class admin_top_deals_module {
    static add_top_deal: (req: any) => Promise<unknown>;
    static update_top_deal: (req: any) => Promise<unknown>;
    static list_top_deals: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static enable_disable_top_deals: (req: any) => Promise<string>;
    static detail_top_deals: (req: any) => Promise<any>;
    static delete_top_deal: (req: any) => Promise<string>;
}
declare class user_top_deals_module {
    static user_list_top_deals: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static retrive_sections_data: () => Promise<unknown>;
    static retrive_data: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
}
export { admin_top_deals_module, user_top_deals_module };
