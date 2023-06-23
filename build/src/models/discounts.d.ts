/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Discounts: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    brand_id: any;
    product_id: any;
    sub_category_id: any;
    discount_percentage: string;
    is_removed: boolean;
} & {
    brand_id?: unknown;
    product_id?: unknown;
    sub_category_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Discounts;
