/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Users: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    description: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    email: string;
    password: string;
    country_code: string;
    is_blocked: boolean;
    is_deleted: boolean;
    created_at: string;
    social_type: string;
    social_token: string;
    profile_pic: string;
    phone_no: number;
    otp: number;
    phone_otp: number;
    unique_code: string;
    fp_otp: number;
    fp_otp_verified: boolean;
    wrong_pwd_count: number;
    locked_till: string;
    customer_id: string;
    payment_id: string;
    admin_verified: boolean;
    email_verified: boolean;
    phone_verified: boolean;
    about: string;
    account_status: string;
    deactivation_reason: string;
    language: string;
} & {}> & {
    [name: string]: Function;
};
export default Users;
