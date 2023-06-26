/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Category: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    is_deleted: boolean;
    created_at: string;
    language: string;
    design_type: number;
    updated_at: string;
} & {}> & {
    [name: string]: Function;
};
export default Category;
