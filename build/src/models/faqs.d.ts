/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Faq: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    is_deleted: boolean;
    created_at: string;
    language: string;
    question: string;
    answer: string;
} & {}> & {
    [name: string]: Function;
};
export default Faq;
