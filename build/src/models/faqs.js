"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const language = ["ENGLISH", "ARABIC"];
const FaqSchema = (0, ts_mongoose_1.createSchema)({
    question: ts_mongoose_1.Type.string({ default: null }),
    answer: ts_mongoose_1.Type.string({ default: null }),
    is_deleted: ts_mongoose_1.Type.boolean({ default: false }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
});
const Faq = (0, ts_mongoose_1.typedModel)('faqs', FaqSchema);
exports.default = Faq;
