import moment_days from './moment_days';
declare class product_graph extends moment_days {
    static retrive_graph(req: any): Promise<{
        total_count: any;
        data: any;
    }>;
    static daily_graph: (seller_id: string) => Promise<any[]>;
    static weekly_graph: (seller_id: string) => Promise<any[]>;
    static monthly_graph: (seller_id: string) => Promise<any[]>;
    static yearly_graph: (seller_id: string) => Promise<any[]>;
}
export default product_graph;
