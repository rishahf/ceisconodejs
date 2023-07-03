"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const LanguageKeysSchema = (0, ts_mongoose_1.createSchema)({
    key: ts_mongoose_1.Type.string({ default: null }),
    english: ts_mongoose_1.Type.string({ default: null }),
    arabic: ts_mongoose_1.Type.string({ default: null }),
    is_blocked: ts_mongoose_1.Type.boolean({ default: false }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const LanguageKeys = (0, ts_mongoose_1.typedModel)('languages_keys', LanguageKeysSchema);
exports.default = LanguageKeys;
