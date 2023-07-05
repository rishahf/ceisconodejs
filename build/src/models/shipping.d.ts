/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Shipping: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    company: string;
    country: string;
    state: string;
    city: string;
    email: string;
    created_at: string;
    street1: string;
    zip: string;
    phone: number;
} & {}> & {
    [name: string]: Function;
};
export default Shipping;
