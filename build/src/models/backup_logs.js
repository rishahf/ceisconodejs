"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const BackupLogsSchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ default: null }),
    unique_key: ts_mongoose_1.Type.number({ default: 0 }),
    date: ts_mongoose_1.Type.string({ default: null }),
    file_url: ts_mongoose_1.Type.string({ default: null }),
    created_at: ts_mongoose_1.Type.string({ default: null }),
});
const BackupLogs = (0, ts_mongoose_1.typedModel)('backup_logs', BackupLogsSchema);
exports.default = BackupLogs;
