declare const create_order_mail_to_customer: (user_data: any, order_detail: any) => Promise<void>;
declare const create_order_mail_to_seller: (user_data: any, order_detail: any) => Promise<void>;
declare const cancel_requested_to_customer: (user_data: any, order_detail: any, product_detail: any, html_template: any) => Promise<void>;
declare const cancel_requested_to_seller: (seller_data: any, order_detail: any, customer_detail: any, product_detail: any) => Promise<void>;
export { create_order_mail_to_customer, create_order_mail_to_seller, cancel_requested_to_customer, cancel_requested_to_seller };
