"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const shippo = require('shippo')(process.env.SHIPPO_TOKEN);
class shipment_module {
}
exports.default = shipment_module;
_a = shipment_module;
shipment_module.create = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { products, address_id, card_id, coupon_code, payment_mode, delivery_price, shipment_id, transaction_id } = req.body;
    }
    catch (err) {
        throw err;
    }
});
