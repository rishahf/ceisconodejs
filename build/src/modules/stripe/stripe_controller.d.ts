import { Request, Response } from 'express';
declare class controller {
    static gen_token(req: Request, res: Response): Promise<void>;
    static create_a_card(req: Request, res: Response): Promise<void>;
    static list_cards(req: Request, res: Response): Promise<void>;
    static delete_card(req: Request, res: Response): Promise<void>;
}
export default controller;
