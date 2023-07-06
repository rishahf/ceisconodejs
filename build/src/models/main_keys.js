"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const type = ["WEBSITE", "SELLER"];
const MainKeySchema = (0, ts_mongoose_1.createSchema)({
    name: ts_mongoose_1.Type.string({ default: null }),
    type: ts_mongoose_1.Type.string({ default: null }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
});
const MainKeys = (0, ts_mongoose_1.typedModel)('main_keys', MainKeySchema);
exports.default = MainKeys;
