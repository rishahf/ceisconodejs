/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const SubCategory: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    is_deleted: boolean;
    created_at: string;
    language: string;
    updated_at: string;
    category_id: any;
} & {
    category_id?: unknown;
}> & {
    [name: string]: Function;
};
export default SubCategory;
