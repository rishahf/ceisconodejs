/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Products: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    description: string;
    size: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    is_blocked: boolean;
    is_deleted: boolean;
    created_at: string;
    language: string;
    updated_at: string;
    category_id: any;
    subcategory_id: any;
    prodct_id: string;
    added_by: any;
    parcel_id: any;
    sub_subcategory_id: any;
    brand_id: any;
    images: string[];
    quantity: number;
    tax_percentage: number;
    price: number;
    discount_percantage: number;
    discount: number;
    discount_price: number;
    total_reviews: number;
    total_ratings: number;
    average_rating: number;
    one_star_ratings: number;
    two_star_ratings: number;
    three_star_ratings: number;
    four_star_ratings: number;
    five_star_ratings: number;
    sold: boolean;
    is_visible: boolean;
    is_delivery_available: boolean;
} & {
    category_id?: unknown;
    subcategory_id?: unknown;
    added_by?: unknown;
    parcel_id?: unknown;
    sub_subcategory_id?: unknown;
    brand_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Products;
