import Mongoose from "mongoose";
export default class product_module {
    static details: (req: any) => Promise<any>;
    static fetch_token_data: (token: string) => Promise<any>;
    static check_product_in_cart: (product_id: string, user_id: string) => Promise<boolean>;
    static can_add_review: (product_id: string, user_id: string) => Promise<boolean>;
    static check_wishlisted: (product_id: string, user_id: string) => Promise<boolean>;
    static retrive_product_details: (product_id: string) => Promise<unknown>;
    static retrive_product_services: (product_id: string) => Promise<unknown>;
    static retrive_product_highlights: (product_id: string) => Promise<unknown>;
    static retrive_product_variations: (product_id: string) => Promise<unknown>;
    static retrive_faq_products: (product_id: string, user_id: string) => Promise<any>;
    static retrive_order_product: (product_id: string, user_id: string) => Promise<unknown>;
    static retrive_product_ratings: (product_id: string) => Promise<unknown>;
    static searchLocation1: (req: any) => Promise<any>;
    static searchLocation: (req: any) => Promise<any>;
    static match_product_id: (product_id: string) => Promise<{
        $match: {
            product_id: Mongoose.Types.ObjectId;
        };
    }>;
    static match_product_and_Country: (product_id: string, country: string) => Promise<{
        $match: {
            product_id: Mongoose.Types.ObjectId;
            address: string;
        };
    }>;
    static find_nearest(long_from: any, lat_from: any, get_kms: number): Promise<{
        $match: {
            "location.coordinates": {
                $geoWithin: {
                    $centerSphere: any[];
                };
            };
        };
    }>;
    static find_geo_near(long: number, lat: number, get_kms: any, product_id: string): Promise<{
        $geoNear: {
            near: {
                type: string;
                coordinates: number[];
            };
            key: string;
            distanceField: string;
            maxDistance: number;
            spherical: boolean;
            query: {
                product_id: Mongoose.Types.ObjectId;
            };
        };
    }>;
}
