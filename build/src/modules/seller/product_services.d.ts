export default class product_services_module {
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
