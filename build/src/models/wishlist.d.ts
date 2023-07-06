/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Wishlist: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    user_id: any;
    product_id: any;
} & {
    user_id?: unknown;
    product_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Wishlist;
