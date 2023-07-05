/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const LanguageKeys: import("mongoose").Model<import("mongoose").Document<any> & {
    key: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    is_blocked: boolean;
    is_deleted: boolean;
    created_at: string;
    english: string;
    arabic: string;
} & {}> & {
    [name: string]: Function;
};
export default LanguageKeys;
