/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Delivery_Locations: import("mongoose").Model<import("mongoose").Document<any> & {
    location: {
        type: import("ts-mongoose").Optional<string>;
        coordinates: import("ts-mongoose").Optional<number[]>;
    };
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    country: string;
    created_at: string;
    product_id: any;
    address: string;
    radius: number;
    units: string;
    delivery_time: string;
} & {
    product_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Delivery_Locations;
