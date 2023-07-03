/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Product_Highlights: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    updated_at: string;
    content: string;
    product_id: any;
} & {
    product_id?: unknown;
}> & {
    [name: string]: Function;
};
export default Product_Highlights;
