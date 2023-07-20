/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Size: import("mongoose").Model<import("mongoose").Document<any> & {
    size: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    is_deleted: boolean;
    created_at: string;
    updated_at: string;
    category_id: any;
} & {
    category_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Size;
