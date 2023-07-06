"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const mongoose_1 = require("mongoose");
const KeyValueSchema = (0, ts_mongoose_1.createSchema)({
    main_key_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('main_keys', mongoose_1.models.Main_keys),
    key: ts_mongoose_1.Type.string({ default: null }),
    value: ts_mongoose_1.Type.string({ default: null }),
    language: ts_mongoose_1.Type.string({ default: null }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const KeyValues = (0, ts_mongoose_1.typedModel)('key_values', KeyValueSchema);
exports.default = KeyValues;
