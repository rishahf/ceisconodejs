declare const send_notification: (data: any, fcm_token: string) => Promise<void>;
declare const send_notification_to_all: (data: any, fcm_ids: string) => Promise<void>;
export { send_notification, send_notification_to_all };
