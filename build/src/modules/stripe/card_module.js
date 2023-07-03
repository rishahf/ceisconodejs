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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const stripe_1 = __importDefault(require("stripe"));
const STRIPE_KEY = process.env.STRIPE_KEY;
const stripe_options = { apiVersion: '2020-08-27' };
const stripe = new stripe_1.default(STRIPE_KEY, stripe_options);
const index_1 = require("../../middlewares/index");
class card_module {
}
_a = card_module;
card_module.generate_token = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentMethod = yield stripe.paymentMethods.create({
            type: 'card',
            card: {
                number: '4242424242424242',
                exp_month: 7,
                exp_year: 2023,
                cvc: '314',
            },
        });
        return paymentMethod;
    }
    catch (err) {
        throw err;
    }
});
card_module.create_card = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { payment_method } = req.body;
        let { customer_id } = req.user_data;
        let attach_pm = yield stripe.paymentMethods.attach(payment_method, { customer: customer_id });
        console.log("attach_pm...", attach_pm);
        yield _a.update_customer(payment_method, customer_id);
        return yield _a.save_card_details(req, attach_pm);
    }
    catch (err) {
        throw err;
    }
});
card_module.check_card_exist = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.user_data;
        let query = { user_id: _id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Cards, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
// static create_customer = async (req: any) => {
//     try {
//         let { name, email } = req.user_data;
//         let customer_data = {
//             description: email,
//             email: email,
//             name: name,
//             // source: token,
//         }
//         let create_a_customer = await stripe.customers.create(customer_data);
//         return create_a_customer
//     }
//     catch (err) {
//         throw err;
//     }
// }
card_module.update_customer = (payment_method, customer_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield stripe.customers.update(customer_id, {
            invoice_settings: {
                default_payment_method: payment_method
            }
        });
    }
    catch (err) {
        throw err;
    }
});
card_module.save_card_details = (req, retrieve_source) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { payment_method, card_number, card_holder_name, is_saved } = req.body;
        let { _id } = req.user_data;
        let { card: { brand, exp_month, exp_year, last4, fingerprint } } = retrieve_source;
        let card_details = {
            user_id: _id,
            payment_method: payment_method,
            brand: brand,
            exp_month: exp_month,
            exp_year: exp_year,
            last4: last4,
            fingerprint: fingerprint,
            is_default: true,
            is_saved: is_saved,
            created_at: +new Date()
        };
        let create_a_card = yield DAO.save_data(Models.Cards, card_details);
        return create_a_card;
    }
    catch (err) {
        throw err;
    }
});
// static update_card_details = async (req: Request, card_details: any) => {
//     try {
//         let { payment_method } = req.body, { _id } = card_details;
//         let query = { _id: _id }
//         let update = { payment_method: payment_method }
//         let options = { new: true }
//         let update_card = await DAO.find_and_update(Models.Cards, query, update, options)
//         return update_card
//     }
//     catch (err) {
//         throw err;
//     }
// }
card_module.retrive_cards = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.user_data, { pagination, limit } = req.query;
        let query = { user_id: _id, is_saved: true };
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let cards = yield DAO.get_data(Models.Cards, query, projection, options);
        let total_count = yield DAO.count_data(Models.Cards, query);
        return {
            total_count: total_count,
            data: cards
        };
    }
    catch (err) {
        throw err;
    }
});
card_module.deleteCard = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: user_id } = req.user_data, { _id } = req.params;
        console.log(req.params);
        // const deleted = await stripe.customers.deleteSource(
        //     'cus_9BoKyB2Km2T7TE', //custmor_id
        //     'card_1M6Vta2eZvKYlo2CBV1QJK3b' //cardid
        // );
        let query = { _id: _id, user_id: user_id }, data;
        console.log('query ', query);
        let response = yield DAO.remove_many(Models.Cards, query);
        if (response.deletedCount > 0) {
            data = `Card deleted successfully...`;
        }
        return data;
    }
    catch (err) {
        throw err;
    }
});
exports.default = card_module;
