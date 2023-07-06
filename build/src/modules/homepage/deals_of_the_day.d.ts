declare class admin_dod_module {
    static add_a_deal: (req: any) => Promise<unknown>;
    static update_a_deal: (req: any) => Promise<unknown>;
    static list_deals: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static detail_deal_of_the_day: (req: any) => Promise<any>;
    static enable_disable_deals_day: (req: any) => Promise<string>;
    static delete_a_deal: (req: any) => Promise<string>;
    static add_timer_of_deals: (req: any) => Promise<any>;
    static update_timer_of_deals: (req: any) => Promise<unknown>;
    static get_all_timer_of_deals: (req: any) => Promise<unknown>;
    static get_timer_of_deals: (req: any) => Promise<any>;
    static get_users_timer_of_deals: (req: any) => Promise<any>;
}
declare class user_dod_module {
    static user_list_deals: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static retrive_sections_data: () => Promise<unknown>;
    static retrive_deals: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
}
export { admin_dod_module, user_dod_module };
