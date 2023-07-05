"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.salt_rounds = exports.default_limit = exports.scope = exports.seckret_keys = void 0;
const seckret_keys = {
    admin_seckret_key: "admin_seckret_key",
    user_seckret_key: "user_seckret_key",
    seller_seckret_key: "seller_seckret_key"
};
exports.seckret_keys = seckret_keys;
const scope = {
    admin: "admin",
    user: "user",
    seller: "seller"
};
exports.scope = scope;
const default_limit = 10;
exports.default_limit = default_limit;
const salt_rounds = 10;
exports.salt_rounds = salt_rounds;
