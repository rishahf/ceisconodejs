/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Parcel: import("mongoose").Model<import("mongoose").Document<any> & {
    length: string;
    name: string;
    description: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    width: string;
    height: string;
    distance_unit: string;
    weight: string;
    mass_unit: string;
    shippo_parcel_id: string;
} & {}> & {
    [name: string]: Function;
};
export default Parcel;
