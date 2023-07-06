/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const KeyValues: import("mongoose").Model<import("mongoose").Document<any> & {
    key: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    language: string;
    value: string;
    main_key_id: any;
} & {
    main_key_id?: unknown;
}> & {
    [name: string]: Function;
};
export default KeyValues;
