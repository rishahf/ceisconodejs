/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Content: import("mongoose").Model<import("mongoose").Document<any> & {
    type: string;
    description: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    language: string;
    image_url: string;
} & {}> & {
    [name: string]: Function;
};
export default Content;
