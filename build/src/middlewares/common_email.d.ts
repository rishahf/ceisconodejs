declare const send_welcome_mail: (email: any, name: any, otp: any, subject: any, source: any, admin_address: any) => Promise<string>;
declare const send_order_mail: (email: any, subject: any, template: any) => Promise<string>;
export { send_welcome_mail, send_order_mail };
