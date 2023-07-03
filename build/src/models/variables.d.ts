/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Variables: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
} & {}> & {
    [name: string]: Function;
};
export default Variables;
