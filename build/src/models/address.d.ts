/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Address: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    location: {
        type: import("ts-mongoose").Optional<string>;
        coordinates: import("ts-mongoose").Optional<number[]>;
    };
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    company: string;
    country: string;
    state: string;
    city: string;
    full_address: string;
    country_code: string;
    is_deleted: boolean;
    created_at: string;
    phone_no: number;
    language: string;
    user_id: any;
    pin_code: string;
    apartment_number: string;
    shippo_user_address_id: string;
    address_type: string;
    lat: string;
    lng: string;
    is_default: boolean;
} & {
    user_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Address;
