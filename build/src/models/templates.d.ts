/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Templates: import("mongoose").Model<import("mongoose").Document<any> & {
    type: string;
    subject: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    title: string;
    html: string;
    variables: any[];
} & {}> & {
    [name: string]: Function;
};
export default Templates;
