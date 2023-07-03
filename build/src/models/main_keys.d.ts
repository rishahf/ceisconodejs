/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const MainKeys: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    type: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
} & {}> & {
    [name: string]: Function;
};
export default MainKeys;
