import mongoose from "mongoose";
export default class search_module {
    static search: (req: any) => Promise<any[]>;
    static search_products: (req: any) => Promise<any[]>;
    static search_categories: (req: any) => Promise<any[]>;
    static search_sub_categories: (req: any) => Promise<any[]>;
    static search_sub_sub_categories: (req: any) => Promise<any[]>;
    static search_brands: (req: any) => Promise<any[]>;
    static searchLocation: (req: any) => Promise<any>;
    static match_product_id: (product_id: string) => Promise<{
        $match: {
            product_id: mongoose.Types.ObjectId;
        };
    }>;
}
