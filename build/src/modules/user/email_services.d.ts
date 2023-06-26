declare const send_welcome_mail: (data: any) => Promise<void>;
declare const resend_otp_mail: (data: any) => Promise<void>;
declare const phone_verification_success_mail: (data: any) => Promise<void>;
declare const edit_profile_mail: (email: string, otp: any, name: string) => Promise<void>;
declare const forgot_password_mail: (data: any) => Promise<void>;
export { send_welcome_mail, resend_otp_mail, forgot_password_mail, edit_profile_mail, phone_verification_success_mail, };
