declare const generate_admin_token: (_id: string, req_data: any) => Promise<unknown>;
declare const fetch_admin_token: (token_data: any, req_data: any) => Promise<unknown>;
declare const save_session_data: (access_token: string, token_data: any, fcm_token: any) => Promise<unknown>;
declare const update_language: (_id: string, language: string) => Promise<void>;
declare const make_admin_response: (data: any, language: string) => Promise<any>;
declare const block_delete_data: (data: any, collection: any) => Promise<{
    message: any;
}>;
declare const verify_unverify: (data: any, collection: any) => Promise<{
    message: any;
}>;
declare const activate_deactivate: (data: any, collection: any) => Promise<{
    message: any;
}>;
declare const fetch_total_count: (collection: any, query: any) => Promise<unknown>;
declare const fetch_recent_users: () => Promise<unknown>;
declare const fetch_recent_products: () => Promise<unknown>;
declare const total_earnings: (req: any) => Promise<number>;
declare const total_reviews: (req: any) => Promise<unknown>;
declare const total_ratings: (req: any) => Promise<number>;
declare const generate_user_token: (_id: string, req_data: any, device_type: any) => Promise<unknown>;
declare const make_user_response: (token_data: any) => Promise<any>;
declare const fetch_user_data: (query: any, options: any) => Promise<unknown>;
declare const check_content: (type: string) => Promise<unknown>;
declare const verify_admin_info: (query: any) => Promise<unknown>;
declare const save_staff_data: (data: any) => Promise<unknown>;
declare const make_products_response: (query: any, options: any) => Promise<any>;
declare const make_products: (query: any, options: any) => Promise<any>;
declare const get_product_detail: (query: any, options: any) => Promise<unknown>;
declare const fetch_Orders_data: (query: any, options: any) => Promise<any>;
declare const fetch_reviews_data: (query: any, options: any) => Promise<any>;
declare const make_category_response: (query: any, options: any) => Promise<unknown>;
declare const make_subcategory_response: (query: any, options: any) => Promise<unknown>;
declare const make_product_type_response: (query: any, options: any) => Promise<unknown>;
declare const make_brand_response: (query: any, options: any) => Promise<unknown>;
declare const make_banners_response: (query: any, options: any) => Promise<unknown>;
declare const save_categories: (data: any) => Promise<unknown>;
declare const save_sub_categories: (data: any) => Promise<unknown>;
declare const add_sub_subcategories: (data: any) => Promise<unknown>;
declare const save_brands: (data: any) => Promise<unknown>;
declare const save_banners: (data: any) => Promise<unknown>;
declare const save_deals: (data: any) => Promise<unknown>;
declare const save_hot_deals: (data: any) => Promise<unknown>;
declare const save_fashion_deals: (data: any) => Promise<unknown>;
declare const fetch_sellers: (query: any) => Promise<any>;
declare const fetch_sellers_emails: (query: any) => Promise<any>;
declare const fetch_seller: (query: any) => Promise<any>;
declare const fetch_users_fcm_token: (user_id: string) => Promise<any>;
declare const fetch_sellers_fcm_token: (user_id: string) => Promise<any>;
declare const send_broadcast_email: (data: any) => Promise<void>;
declare const send_broadcast_push: (data: any) => Promise<void>;
declare const verify_seller_info: (query: any) => Promise<unknown>;
declare const set_seller_data: (data: any) => Promise<any>;
declare const generate_seller_token: (_id: string, req_data: any, device_type: any) => Promise<unknown>;
declare const save_session_data_seller: (access_token: string, token_data: any, req_data: any, device_type: any) => Promise<unknown>;
declare const make_seller_response: (data: any, language: string) => Promise<any>;
declare const fetch_seller_data: (query: any, options: any) => Promise<unknown>;
declare const edit_coupon: (data: any) => Promise<any>;
declare const edit_language: (data: any) => Promise<any>;
declare const edit_faqs: (data: any) => Promise<any>;
declare const get_variants_detail: (query: any, options: any) => Promise<unknown>;
declare const make_deals_response: (query: any, options: any) => Promise<unknown>;
declare const get_deals_detail: (query: any, options: any) => Promise<unknown>;
declare const make_hot_deals_response: (query: any, options: any) => Promise<unknown>;
declare const get_hotdeals_detail: (query: any, options: any) => Promise<unknown>;
declare const get_fashiondeals_detail: (query: any, options: any) => Promise<unknown>;
declare const make_fashion_deals_response: (query: any, options: any) => Promise<unknown>;
declare const save_parcel: (data: any) => Promise<any>;
declare const getNotifications: (admin_id: string, req_data: any) => Promise<any>;
declare const markReadNotifications: (req: any) => Promise<{
    message: string;
}>;
declare const clearNotifications: (req: any) => Promise<{
    message: string;
}>;
declare const ReadNotification: (req: any) => Promise<{
    message: string;
}>;
declare const listing_users_sellers: (req: any) => Promise<{
    data: any[];
}>;
declare const saveMainKey: (req: any) => Promise<{
    message: string;
    data: unknown;
}>;
declare const getMainKeys: (req: any) => Promise<unknown>;
declare const saveKeyValue: (req: any) => Promise<{
    message: string;
    data: unknown;
}>;
declare const editKeyValue: (req: any) => Promise<{
    message: string;
    data: any;
}>;
declare const getAllKeys: (req: any) => Promise<{
    data: any;
}>;
export { generate_admin_token, fetch_admin_token, save_session_data, update_language, make_admin_response, block_delete_data, verify_unverify, activate_deactivate, fetch_total_count, fetch_recent_users, fetch_recent_products, total_earnings, total_reviews, total_ratings, generate_user_token, make_user_response, fetch_user_data, check_content, verify_admin_info, make_products_response, get_product_detail, fetch_Orders_data, fetch_reviews_data, send_broadcast_email, send_broadcast_push, save_categories, make_category_response, make_subcategory_response, make_product_type_response, save_sub_categories, add_sub_subcategories, save_brands, make_brand_response, save_banners, make_banners_response, verify_seller_info, set_seller_data, generate_seller_token, save_session_data_seller, make_seller_response, fetch_seller_data, make_products, save_deals, save_hot_deals, save_fashion_deals, edit_coupon, save_staff_data, edit_faqs, get_variants_detail, edit_language, make_deals_response, get_deals_detail, make_hot_deals_response, get_hotdeals_detail, get_fashiondeals_detail, make_fashion_deals_response, save_parcel, fetch_sellers, fetch_users_fcm_token, fetch_sellers_fcm_token, getNotifications, markReadNotifications, clearNotifications, ReadNotification, listing_users_sellers, fetch_sellers_emails, fetch_seller, saveMainKey, getMainKeys, saveKeyValue, getAllKeys, editKeyValue };
