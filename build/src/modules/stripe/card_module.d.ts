import { Request } from 'express';
import Stripe from 'stripe';
declare class card_module {
    static generate_token: (req: Request) => Promise<Stripe.Response<Stripe.PaymentMethod>>;
    static create_card: (req: any) => Promise<unknown>;
    static check_card_exist: (req: any) => Promise<any>;
    static update_customer: (payment_method: string, customer_id: string) => Promise<void>;
    static save_card_details: (req: any, retrieve_source: any) => Promise<unknown>;
    static retrive_cards: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static deleteCard: (req: any) => Promise<any>;
}
export default card_module;
