import { createSchema, Type, typedModel } from 'ts-mongoose';

const BackupLogsSchema = createSchema({
    name: Type.string({ default: null }),
    unique_key: Type.number({ default: 0 }),
    date: Type.string({ default: null }),
    file_url: Type.string({ default: null }),
    created_at: Type.string({ default: null }),
})

const BackupLogs = typedModel('backup_logs', BackupLogsSchema);
export default BackupLogs