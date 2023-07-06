/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Cards: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    is_deleted: boolean;
    created_at: string;
    user_id: any;
    is_default: boolean;
    payment_method: string;
    brand: string;
    exp_month: number;
    exp_year: number;
    last4: number;
    fingerprint: string;
    is_saved: boolean;
} & {
    user_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Cards;
