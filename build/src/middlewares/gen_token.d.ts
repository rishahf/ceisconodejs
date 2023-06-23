declare const generate_token: (token_data: any) => Promise<unknown>;
declare const decode_token: (token: string, type: string, language: string) => Promise<unknown>;
declare const verify_token: (token: string, type: string, language: string) => Promise<any>;
export { generate_token, decode_token, verify_token };
