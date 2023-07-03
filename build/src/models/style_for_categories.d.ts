/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const StyleForCategories: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    image: string;
    is_deleted: boolean;
    created_at: string;
    language: string;
    updated_at: string;
    category_id: any;
    subcategory_id: any;
    sub_subcategory_id: any;
    brand_id: any;
    is_enable: boolean;
    style_for_id: any;
} & {
    category_id?: unknown;
    subcategory_id?: unknown;
    sub_subcategory_id?: unknown;
    brand_id?: unknown;
    style_for_id?: unknown;
}> & {
    [name: string]: Function;
};
export default StyleForCategories;
