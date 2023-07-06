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
const type = [null, 'USER', 'ADMIN', 'SELLER'];
const device_type = [null, 'iOS', 'Android'];
const SessionsSchema = (0, ts_mongoose_1.createSchema)({
    type: ts_mongoose_1.Type.string({ default: null, type }),
    admin_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('admins', Models.Admin),
    user_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('users', Models.Users),
    seller_id: ts_mongoose_1.Type.ref(ts_mongoose_1.Type.objectId({ default: null })).to('sellers', Models.Sellers),
    access_token: ts_mongoose_1.Type.string({ default: null }),
    // device_type: Type.string({ default: null, device_type }),
    device_type: ts_mongoose_1.Type.string({ default: null }),
    fcm_token: ts_mongoose_1.Type.string({ default: null }),
    token_gen_at: ts_mongoose_1.Type.string({ default: null }),
    created_at: ts_mongoose_1.Type.string({ default: +new Date() })
});
const Sessions = (0, ts_mongoose_1.typedModel)('sessions', SessionsSchema);
exports.default = Sessions;
