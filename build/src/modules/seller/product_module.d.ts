declare class product_add_module {
    static add_a_product: (req: any) => Promise<any>;
    static save_locations: (clone_product_id: string, product_id: any) => Promise<any>;
    static save_product_details: (product_details: any, product_id: string) => Promise<void>;
    static retrive_unique_number: (product_id: string) => Promise<number>;
    static save_product_services: (services: any, product_id: string) => Promise<void>;
    static save_product_highlights: (highlights: any, product_id: string) => Promise<void>;
}
declare class product_edit_module {
    static edit_a_product: (req: any) => Promise<unknown>;
}
declare class product_list_module {
    static list: (req: any) => Promise<{
        total_count: any;
        data: unknown;
    }>;
    static details: (req: any) => Promise<any>;
    static retrive_product_details: (product_id: string) => Promise<unknown>;
    static retrive_product_services: (product_id: string) => Promise<unknown>;
    static retrive_product_highlights: (product_id: string) => Promise<unknown>;
    static retrive_product_variations: (product_id: string) => Promise<unknown>;
    static retrive_faq_products: (product_id: string) => Promise<unknown>;
    static retrive_product_ratings: (product_id: string) => Promise<unknown>;
}
export { product_add_module, product_edit_module, product_list_module };
