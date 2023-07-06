export default class product_variation_module {
    static add: (req: any) => Promise<any>;
    static add_other_variants: (product_id: any, variants_ids: any) => Promise<void>;
    static list: (req: any) => Promise<{
        data: unknown;
    }>;
    static delete: (req: any) => Promise<{
        message: string;
    }>;
    static edit: (req: any) => Promise<unknown>;
    static add1: (req: any) => Promise<any>;
    static list1: (req: any) => Promise<any>;
    static delete1: (req: any) => Promise<{
        message: string;
    }>;
    static list_variants_to_add: (req: any) => Promise<{
        total_count: any;
        data: unknown;
    }>;
}
