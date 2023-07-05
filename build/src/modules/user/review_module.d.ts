declare class add_review_module {
    static can_add_review: (req: any) => Promise<{
        can_review: boolean;
    }>;
    static add_review: (req: any) => Promise<unknown>;
    static retrive_product_info: (product_id: string) => Promise<any>;
    static check_review_added: (product_id: string, user_id: string) => Promise<any>;
    static check_product_purchased: (product_id: string, user_id: string) => Promise<any>;
    static update_count_in_product: (product_id: string, ratings: number) => Promise<void>;
}
declare class edit_review_module {
    static edit_review: (req: any) => Promise<any>;
    static retrive_old_ratings: (_id: string) => Promise<any>;
    static retrive_product_info: (product_id: string) => Promise<any>;
    static cal_total_ratings: (product_id: string) => Promise<number>;
    static update_ratings_in_product: (product_id: string, ratings: number) => Promise<void>;
    static update_old_ratings_in_product: (product_id: string, old_ratings: number) => Promise<void>;
}
declare class list_review_module {
    static list_reviews: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static list_my_reviews: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static my_review_details: (req: any) => Promise<any>;
}
export { add_review_module, edit_review_module, list_review_module };
