declare const send_welcome_mail: (data: any, seller_password: any) => Promise<void>;
declare const send_pending_shipped_mail: (data: any, order_detail: any) => Promise<void>;
declare const send_shipped_mail: (user_data: any, order_detail: any, product_detail: any, seller_data: any) => Promise<void>;
declare const send_delivery_mail: (user_data: any, order_detail: any, product_detail: any, seller_data: any) => Promise<void>;
declare const send_cancel_mail: (user_data: any, order_detail: any, product_detail: any, seller_data: any) => Promise<void>;
declare const send_refund_mail: (user_data: any, order_detail: any, product_detail: any, seller_data: any) => Promise<void>;
export { send_welcome_mail, send_pending_shipped_mail, send_shipped_mail, send_delivery_mail, send_cancel_mail, send_refund_mail, };
