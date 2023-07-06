/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Notifications: import("mongoose").Model<import("mongoose").Document<any> & {
    message: string;
    type: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    language: string;
    admin_id: any;
    user_id: any;
    seller_id: any;
    images: string[];
    product_id: any;
    title: string;
    order_id: any;
    orderProduct_id: any;
    read_by_user: boolean;
    read_by_seller: boolean;
    read_by_admin: boolean;
    clear_for_user: boolean;
    clear_for_seller: boolean;
    clear_for_admin: boolean;
} & {
    admin_id?: unknown;
    user_id?: unknown;
    seller_id?: unknown;
    product_id?: unknown;
    order_id?: unknown;
    orderProduct_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Notifications;
