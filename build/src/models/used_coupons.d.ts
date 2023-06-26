/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Used_Coupons: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    is_deleted: boolean;
    created_at: string;
    user_id: any;
    coupon_id: any;
} & {
    user_id?: unknown;
    coupon_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Used_Coupons;
