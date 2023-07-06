export default class listing_module {
    static categories: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static categories_details: (req: any) => Promise<any>;
    static sub_categories: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static sub_categories_details: (req: any) => Promise<any>;
    static sub_subcategories: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static sub_subcategories_details: (req: any) => Promise<any>;
    static brands: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static brands_details: (req: any) => Promise<any>;
    static nested_data: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static retrive_sub_categories: (categories: any) => Promise<void>;
    static retrive_sub_sub_categories: (sub_categories: any) => Promise<void>;
}
