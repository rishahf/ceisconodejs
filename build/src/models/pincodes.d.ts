/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const PinCodes: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    deliverable_location_id: any;
    pincode: string;
} & {
    deliverable_location_id?: unknown;
}> & {
    [name: string]: Function;
};
export default PinCodes;
