/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const ResMessages: import("mongoose").Model<import("mongoose").Document<any> & {
    type: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    message_type: string;
    status_code: number;
    msg_in_english: string;
    msg_in_arabic: string;
} & {}> & {
    [name: string]: Function;
};
export default ResMessages;
