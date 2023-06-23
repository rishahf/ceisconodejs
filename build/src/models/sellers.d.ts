/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Sellers: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    company: string;
    country: string;
    state: string;
    city: string;
    full_address: string;
    image: string;
    email: string;
    password: string;
    country_code: string;
    phone_number: number;
    is_blocked: boolean;
    is_deleted: boolean;
    created_at: string;
    unique_code: string;
    fp_otp: number;
    fp_otp_verified: boolean;
    email_verified: boolean;
    account_status: string;
    deactivation_reason: string;
    language: string;
    email_otp: number;
    pin_code: string;
    apartment_number: string;
    shippo_address_id: string;
} & {}> & {
    [name: string]: Function;
};
export default Sellers;
