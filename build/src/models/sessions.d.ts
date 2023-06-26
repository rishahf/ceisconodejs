/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Sessions: import("mongoose").Model<import("mongoose").Document<any> & {
    type: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    admin_id: any;
    user_id: any;
    seller_id: any;
    access_token: string;
    device_type: string;
    fcm_token: string;
    token_gen_at: string;
} & {
    admin_id?: unknown;
    user_id?: unknown;
    seller_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Sessions;
