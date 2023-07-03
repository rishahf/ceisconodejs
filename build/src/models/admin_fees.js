"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const AdminFeesSchema = (0, ts_mongoose_1.createSchema)({
    fee_percent: ts_mongoose_1.Type.number({ default: 0 }),
    updated_at: ts_mongoose_1.Type.string({ default: +new Date() }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const AdminFees = (0, ts_mongoose_1.typedModel)('admin_fees', AdminFeesSchema);
exports.default = AdminFees;
