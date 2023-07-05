/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Admin: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    roles: string[];
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
    super_admin: boolean;
    is_blocked: boolean;
    is_deleted: boolean;
    created_at: string;
} & {}> & {
    [name: string]: Function;
};
export default Admin;
