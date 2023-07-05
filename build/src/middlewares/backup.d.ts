declare const delete_backup: (key: string) => Promise<unknown>;
declare const backup_using_cron: (language: string) => Promise<any>;
export { backup_using_cron, delete_backup };
