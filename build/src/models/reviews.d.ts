/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Reviews: import("mongoose").Model<import("mongoose").Document<any> & {
    description: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    language: string;
    user_id: any;
    seller_id: any;
    updated_at: string;
    images: string[];
    product_id: any;
    title: string;
    ratings: number;
} & {
    user_id?: unknown;
    seller_id?: unknown;
    product_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Reviews;
