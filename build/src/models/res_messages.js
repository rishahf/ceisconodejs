"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const type = ['SUCCESS', 'ERROR'];
const ResMessagesSchema = (0, ts_mongoose_1.createSchema)({
    type: ts_mongoose_1.Type.string({ enum: type }),
    message_type: ts_mongoose_1.Type.string({ default: null }),
    status_code: ts_mongoose_1.Type.number({ default: 0 }),
    msg_in_english: ts_mongoose_1.Type.string({ default: null }),
    msg_in_arabic: ts_mongoose_1.Type.string({ default: null }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
});
const ResMessages = (0, ts_mongoose_1.typedModel)('res_messages', ResMessagesSchema);
exports.default = ResMessages;
