/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const ContactUs: import("mongoose").Model<import("mongoose").Document<any> & {
    message: string;
    name: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    email: string;
    country_code: string;
    is_deleted: boolean;
    created_at: string;
    phone_no: number;
    user_id: any;
    resolved: boolean;
} & {
    user_id?: unknown;
}> & {
    [name: string]: Function;
};
export default ContactUs;
