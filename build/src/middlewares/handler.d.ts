declare const handle_success: (reply: any, response: any) => void;
declare const handle_return: (reply: any, response: any) => void;
declare const handle_catch: (reply: any, error: any) => Promise<void>;
declare const handle_custom_error: (type: string, language: string) => Promise<{
    type: any;
    status_code: any;
    error_message: string;
}>;
declare const handle_joi_error: (error: any) => Promise<never>;
export { handle_catch, handle_success, handle_return, handle_custom_error, handle_joi_error, };
