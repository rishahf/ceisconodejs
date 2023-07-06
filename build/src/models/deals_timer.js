"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const DealsTimerSchema = (0, ts_mongoose_1.createSchema)({
    valid_till: ts_mongoose_1.Type.number({ default: 0 }),
    is_active: ts_mongoose_1.Type.boolean({ default: true }),
    updated_at: ts_mongoose_1.Type.string({ default: null }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
});
const Deals_Timer = (0, ts_mongoose_1.typedModel)("deals_timer", DealsTimerSchema);
exports.default = Deals_Timer;
