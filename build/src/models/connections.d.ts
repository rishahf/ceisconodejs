/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Connectiona: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    updated_at: string;
    sent_by: any;
    sent_to: any;
    last_message: string;
    local_identifier: string;
    token: string;
} & {
    sent_by?: unknown;
    sent_to?: unknown;
}> & {
    [name: string]: Function;
};
export default Connectiona;
