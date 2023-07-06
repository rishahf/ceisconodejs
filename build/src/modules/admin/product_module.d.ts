export declare class product_list_module {
    static details: (req: any) => Promise<any>;
    static retrive_product_details: (product_id: string) => Promise<unknown>;
    static retrive_product_services: (product_id: string) => Promise<unknown>;
    static retrive_product_highlights: (product_id: string) => Promise<unknown>;
    static retrive_product_variations: (product_id: string) => Promise<unknown>;
    static retrive_faq_products: (product_id: string) => Promise<unknown>;
    static retrive_product_ratings: (product_id: string) => Promise<unknown>;
    static retrive_product_locations: (product_id: string) => Promise<unknown>;
}
