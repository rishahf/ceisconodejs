"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const type = ['ABOUT_US', 'PRIVACY_POLICY', 'TERMS_AND_CONDITIONS', "CARRERS", "SHIPPING", "PAYMENTS", "PAYMENTS_SECURITY", "RETURN_POLICY"];
const language = ["ENGLISH", "ARABIC"];
const ContentSchema = (0, ts_mongoose_1.createSchema)({
    type: ts_mongoose_1.Type.string({ enum: type }),
    description: ts_mongoose_1.Type.string({ default: null }),
    image_url: ts_mongoose_1.Type.string({ default: null }),
    language: ts_mongoose_1.Type.string({ default: "ENGLISH", enum: language }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() }),
});
const Content = (0, ts_mongoose_1.typedModel)('content', ContentSchema);
exports.default = Content;
