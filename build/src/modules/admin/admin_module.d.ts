declare class category {
    static add: (req: any) => Promise<unknown>;
    static edit: (req: any) => Promise<{
        message: string;
    }>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static category: (req: any) => Promise<any>;
}
declare class sub_category {
    static add: (req: any) => Promise<unknown>;
    static edit: (req: any) => Promise<{
        message: string;
    }>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static subcategory: (req: any) => Promise<any>;
}
declare class sub_sub_category {
    static add: (req: any) => Promise<unknown>;
    static edit: (req: any) => Promise<unknown>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static sub_subcategory: (req: any) => Promise<any>;
}
declare class brand {
    static add: (req: any) => Promise<unknown>;
    static edit: (req: any) => Promise<unknown>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static brands: (req: any) => Promise<any>;
}
declare class fees_module {
    static add: (req: any) => Promise<any>;
    static edit: (req: any) => Promise<unknown>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
}
export { category, sub_category, sub_sub_category, brand, fees_module };
