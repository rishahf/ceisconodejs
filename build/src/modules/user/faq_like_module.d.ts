export default class faqlike_module {
    static like_dislike: (req: any) => Promise<unknown>;
    static check_likes: (faq_id: string, user_id: string) => Promise<unknown>;
    static fetch_token_data: (token: string) => Promise<any>;
    static list: (req: any) => Promise<{
        total_count: unknown;
        data: any;
    }>;
    static get_total_likes: (faq_id: string, type: string) => Promise<unknown>;
    static like_dislike_status: (faq_id: string, user_id: string, type: string) => Promise<boolean>;
}
