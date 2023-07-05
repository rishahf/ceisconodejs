"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_mongoose_1 = require("ts-mongoose");
const Models = __importStar(require("./index"));
const TemplatesSchema = (0, ts_mongoose_1.createSchema)({
    title: ts_mongoose_1.Type.string({ default: null }),
    type: ts_mongoose_1.Type.string({ default: null }),
    subject: ts_mongoose_1.Type.string({ default: null }),
    html: ts_mongoose_1.Type.string({ default: null }),
    variables: ts_mongoose_1.Type.array().of(ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('variables', Models.Variables)),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Templates = (0, ts_mongoose_1.typedModel)('templates', TemplatesSchema);
exports.default = Templates;
