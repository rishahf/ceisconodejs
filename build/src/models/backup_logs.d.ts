/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const BackupLogs: import("mongoose").Model<import("mongoose").Document<any> & {
    name: string;
    date: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    unique_key: number;
    file_url: string;
} & {}> & {
    [name: string]: Function;
};
export default BackupLogs;
