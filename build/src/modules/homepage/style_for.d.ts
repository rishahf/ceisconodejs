declare class admin_style_for_module {
    static add_style_for: (req: any) => Promise<unknown>;
    static update_style_for: (req: any) => Promise<unknown>;
    static list_style_for: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static delete_style_for: (req: any) => Promise<string>;
}
declare class user_style_for_module {
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
}
export { admin_style_for_module, user_style_for_module };
