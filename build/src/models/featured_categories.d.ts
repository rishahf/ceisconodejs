/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const FeaturedCategories: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    image: string;
    is_deleted: boolean;
    created_at: string;
    language: string;
    updated_at: string;
    category_id: any;
    subcategory_id: any;
    price: number;
    title: string;
    is_enable: boolean;
} & {
    category_id?: unknown;
    subcategory_id?: unknown;
}> & {
    [name: string]: Function;
};
export default FeaturedCategories;
