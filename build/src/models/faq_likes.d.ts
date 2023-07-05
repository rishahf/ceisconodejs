/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const FaqLikes: import("mongoose").Model<import("mongoose").Document<any> & {
    type: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    user_id: any;
    updated_at: string;
    faq_id: any;
} & {
    user_id?: unknown;
    faq_id?: unknown;
}> & {
    [name: string]: Function;
};
export default FaqLikes;
