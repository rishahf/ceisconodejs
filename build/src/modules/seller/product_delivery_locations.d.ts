export default class product_delivery_location_module {
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
