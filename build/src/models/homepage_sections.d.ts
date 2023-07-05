/// <reference types="mongoose" />
/// <reference types="ts-mongoose/plugin" />
declare const HomePageSections: import("mongoose").Model<import("mongoose").Document<any> & {
    _id: import("mongoose").Types.ObjectId;
    __v: number;
    created_at: string;
    language: string;
    updated_at: string;
    top_banners: boolean;
    middle_banners: boolean;
    bottom_banners: boolean;
    deal_of_the_day: boolean;
    top_deals: boolean;
    fashion_deals: boolean;
    style_for_categories: boolean;
    featured_categories: boolean;
    shop_with_us: boolean;
    best_on_ecom: boolean;
} & {}> & {
    [name: string]: Function;
};
export default HomePageSections;
