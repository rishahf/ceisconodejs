/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const Product_Variations: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    updated_at: string;
    product_id_1: any;
    product_id_2: any;
} & {
    product_id_1?: unknown;
    product_id_2?: unknown;
}> & {
    [name: string]: Function;
};
export default Product_Variations;
