/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Hot_deals: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    image: string;
    created_at: string;
    subcategory_id: any;
    title: string;
    is_removed: boolean;
    sub_title: string;
    price_description: string;
} & {
    subcategory_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Hot_deals;
