export declare class common_module {
    static send_notification_to_admin: (notification_admin: any) => Promise<any>;
    static get_user_detail: (user_id: string) => Promise<any>;
    static get_seller_detail: (seller_id: string) => Promise<any>;
    static customer_fcms_arr: (user_id: string) => Promise<any>;
    static seller_fcms_arr: (seller_id: string) => Promise<any>;
    static seller_fcms: (seller_id: string) => Promise<any>;
    static customer_fcms: (user_id: string) => Promise<any>;
}
