export default class search_module {
    static verify_user_info: (query: any) => Promise<unknown>;
    static forogot_password: (req: any) => Promise<{
        message: string;
        unique_code: string;
    }>;
    static resend_fp_otp: (req: any) => Promise<{
        message: string;
        unique_code: any;
    }>;
    static verify_fp_otp: (req: any) => Promise<{
        message: string;
        unique_code: any;
    }>;
    static set_new_password: (req: any) => Promise<string>;
}
