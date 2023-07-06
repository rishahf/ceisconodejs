export default class product_details_module {
    static retrive_unique_number: (product_id: string) => Promise<number>;
    static add: (req: any) => Promise<unknown>;
    static edit: (req: any) => Promise<unknown>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static delete: (req: any) => Promise<{
        message: string;
    }>;
}
