import { Request } from 'express';
import moment_days from './moment_days';
declare class seller_graph extends moment_days {
    static retrive_graph(req: Request): Promise<{
        total_count: any;
        data: any;
    }>;
    static daily_graph: () => Promise<any[]>;
    static weekly_graph: () => Promise<any[]>;
    static monthly_graph: () => Promise<any[]>;
    static yearly_graph: () => Promise<any[]>;
}
export default seller_graph;
