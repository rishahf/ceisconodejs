export default class product_faq_module {
    static add: (req: any) => Promise<unknown>;
    static edit: (req: any) => Promise<unknown>;
    static faq_list: (req: any) => Promise<{
        total_count: unknown;
        data: unknown;
    }>;
    static delete: (req: any) => Promise<{
        message: string;
    }>;
}
