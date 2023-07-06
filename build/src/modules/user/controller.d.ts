import { Request, Response } from 'express';
export default class controller {
    static forgot_password: (req: Request, res: Response) => Promise<void>;
    static resend_fp_otp: (req: Request, res: Response) => Promise<void>;
    static verify_fp_otp: (req: Request, res: Response) => Promise<void>;
    static set_new_password: (req: Request, res: Response) => Promise<void>;
    static search: (req: Request, res: Response) => Promise<void>;
    static categories: (req: Request, res: Response) => Promise<void>;
    static categories_details: (req: Request, res: Response) => Promise<void>;
    static sub_categories: (req: Request, res: Response) => Promise<void>;
    static sub_categories_details: (req: Request, res: Response) => Promise<void>;
    static sub_subcategories: (req: Request, res: Response) => Promise<void>;
    static sub_subcategories_details: (req: Request, res: Response) => Promise<void>;
    static brands: (req: Request, res: Response) => Promise<void>;
    static brands_details: (req: Request, res: Response) => Promise<void>;
    static nested: (req: Request, res: Response) => Promise<void>;
    static add_to_cart: (req: Request, res: Response) => Promise<void>;
    static edit_cart: (req: Request, res: Response) => Promise<void>;
    static list_cart: (req: Request, res: Response) => Promise<void>;
    static remove_from_cart: (req: Request, res: Response) => Promise<void>;
    static price_details: (req: Request, res: Response) => Promise<void>;
    static faq_like_dislike: (req: Request, res: Response) => Promise<void>;
    static list_faqs: (req: Request, res: Response) => Promise<void>;
    static searchDeliveryLocation: (req: Request, res: Response) => Promise<void>;
}
