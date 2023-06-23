/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Deals_Timer: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    updated_at: string;
    valid_till: number;
    is_active: boolean;
} & {}> & {
    [name: string]: Function;
};
export default Deals_Timer;
