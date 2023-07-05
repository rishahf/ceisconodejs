/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Sub_subcategories: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    is_deleted: boolean;
    created_at: string;
    language: string;
    updated_at: string;
    subcategory_id: any;
} & {
    subcategory_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Sub_subcategories;
