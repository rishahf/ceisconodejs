import { Request, Response } from 'express';
export default class controller {
    static create_order: (req: Request, res: Response) => Promise<void>;
    static user_list_orders: (req: Request, res: Response) => Promise<void>;
    static order_details: (req: Request, res: Response) => Promise<void>;
    static ordered_products_detail: (req: Request, res: Response) => Promise<void>;
    static ordered_products_invoice: (req: Request, res: Response) => Promise<void>;
    static cancel_order: (req: Request, res: Response) => Promise<void>;
    static cancel_cancellation_request: (req: Request, res: Response) => Promise<void>;
    static order_payment_status: (req: Request, res: Response) => Promise<void>;
    static check_coupon_availability: (req: Request, res: Response) => Promise<void>;
    static check_delivery_availability: (req: Request, res: Response) => Promise<void>;
}
