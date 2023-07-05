/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const DeliverableLocations: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    is_deleted: boolean;
    created_at: string;
    product_id: any;
    city_name: string;
} & {
    product_id?: unknown;
}> & {
    [name: string]: Function;
};
export default DeliverableLocations;
