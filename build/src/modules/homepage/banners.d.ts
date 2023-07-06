declare class admin_banner_module {
    static add_a_banner: (req: any) => Promise<unknown>;
    static update_a_banner: (req: any) => Promise<unknown>;
    static list_banners: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static banner_details: (req: any) => Promise<any>;
    static delete_a_banner: (req: any) => Promise<string>;
    static enable_disable_a_banner: (req: any) => Promise<string>;
    static enable_disable_banners: (req: any) => Promise<string>;
}
declare class user_banner_module {
    static user_list_banners: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static retrive_sections_data: () => Promise<unknown>;
    static retrive_banners: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
}
export { admin_banner_module, user_banner_module };
