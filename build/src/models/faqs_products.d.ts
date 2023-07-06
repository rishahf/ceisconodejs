/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const FaqsProducts: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    language: string;
    seller_id: any;
    updated_at: string;
    question: string;
    answer: string;
    product_id: any;
} & {
    seller_id?: unknown;
    product_id?: unknown;
}> & {
    [name: string]: Function;
};
export default FaqsProducts;
