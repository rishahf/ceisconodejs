declare const products: ({
    name: string;
    description: string;
    brand_id: string;
    subcategory_id: string;
    sub_subcategory_id: string;
    images: string[];
    product_details: string[];
    quantity: number;
    price: number;
    services: string[];
    highlights: string[];
    added_by: string;
    _id?: undefined;
} | {
    name: string;
    description: string;
    brand_id: string;
    subcategory_id: string;
    images: string[];
    product_details: string[];
    quantity: number;
    price: number;
    services: string[];
    highlights: string[];
    added_by: string;
    sub_subcategory_id?: undefined;
    _id?: undefined;
} | {
    name: string;
    description: string;
    brand_id: string;
    subcategory_id: string;
    images: string[];
    product_details: string[];
    quantity: number;
    price: number;
    added_by: string;
    sub_subcategory_id?: undefined;
    services?: undefined;
    highlights?: undefined;
    _id?: undefined;
} | {
    name: string;
    description: string;
    brand_id: string;
    subcategory_id: string;
    images: string[];
    product_details: string[];
    quantity: number;
    price: number;
    added_by: {
        name: string;
        email: string;
        phone_number: string;
    };
    highlights: string[];
    services: string[];
    sub_subcategory_id?: undefined;
    _id?: undefined;
} | {
    _id: string;
    name: string;
    description: string;
    brand_id: {
        _id: string;
        name: string;
    };
    subcategory_id: {
        _id: string;
        name: string;
    };
    images: string[];
    product_details: string[];
    quantity: number;
    price: number;
    added_by: string;
    sub_subcategory_id?: undefined;
    services?: undefined;
    highlights?: undefined;
})[];
export default products;
