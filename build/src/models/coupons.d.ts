/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Coupons: import("mongoose").Model<import("mongoose").Document<any> & {
    code: string;
    name: string;
    type: string;
    description: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    is_deleted: boolean;
    created_at: string;
    language: string;
    seller_id: any;
    updated_at: string;
    added_by: string;
    price: number;
    for_homepage: boolean;
    sub_type: string;
    start_date: string;
    end_date: string;
    percentage: number;
    max_discount: number;
    is_available: boolean;
    applicable_for: string;
    product_ids: any[];
} & {
    seller_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Coupons;
