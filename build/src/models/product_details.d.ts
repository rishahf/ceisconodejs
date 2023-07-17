/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const ProductDetails: import("mongoose").Model<import("mongoose").Document<any> & {
    key: string;
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    value: string;
    updated_at: string;
    product_id: any;
    unique_number: number;
} & {
    product_id?: unknown;
}> & {
    [name: string]: Function;
};
export default ProductDetails;
