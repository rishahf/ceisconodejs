/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const AdminFees: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    updated_at: string;
    fee_percent: number;
} & {}> & {
    [name: string]: Function;
};
export default AdminFees;
