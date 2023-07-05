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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const index_1 = require("../../middlewares/index");
class cart_module {
}
exports.default = cart_module;
_a = cart_module;
cart_module.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id } = req.body, { _id: user_id } = req.user_data;
        let retrive_data = yield _a.check_cart(product_id, user_id);
        if (retrive_data.length) {
            throw yield (0, index_1.handle_custom_error)("ITEM_ALREAY_EXISTS", "ENGLISH");
        }
        else {
            let product_data = yield _a.check_quantity(product_id);
            let { quantity } = product_data;
            if (quantity < 1) {
                throw yield (0, index_1.handle_custom_error)("INSUFFICIENT_QUANTITY", "ENGLISH");
            }
            else {
                let data_to_save = {
                    user_id: user_id,
                    product_id: product_id,
                    quantity: 1,
                    updated_at: +new Date(),
                    created_at: +new Date()
                };
                let response = yield DAO.save_data(Models.Cart, data_to_save);
                return response;
            }
        }
    }
    catch (err) {
        throw err;
    }
});
cart_module.check_cart = (product_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_id: product_id, user_id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Cart, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
cart_module.check_quantity = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Products, query, projection, options);
        if (response.length) {
            return response[0];
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
cart_module.edit = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, quantity } = req.body, { _id: user_id } = req.user_data;
        let query = { _id: _id, user_id: user_id };
        let update = { updated_at: +new Date() };
        if (!!quantity) {
            update.quantity = quantity;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Cart, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
cart_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { pagination, limit } = req.query, { _id: user_id } = req.user_data;
        let query = { user_id: user_id };
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let populate = [
            {
                path: 'product_id',
                select: 'name images price discount_percantage discount discount_price added_by quantity is_deleted',
                populate: [{ path: 'added_by', select: 'name' },]
            }
        ];
        let retrive_data = yield DAO.populate_data(Models.Cart, query, projection, options, populate);
        let total_count = yield DAO.count_data(Models.Cart, query);
        if (retrive_data.length) {
            for (let i = 0; i < retrive_data.length; i++) {
                let { product_id: { _id } } = retrive_data[i];
                let query = { product_id: _id, user_id: user_id };
                let projection = { __v: 0 };
                let options = { lean: true };
                let get_products = yield DAO.get_data(Models.Products, { _id: _id }, { quantity: 1 }, options);
                console.log('qty', get_products[0].quantity);
                retrive_data[i].available_quantity = get_products[0].quantity;
                let get_highlights = yield DAO.get_data(Models.ProductHighlights, { product_id: _id }, { content: 1, _id: 0 }, options);
                retrive_data[i].product_highlights = get_highlights;
                let get_services = yield DAO.get_data(Models.ProductServices, { product_id: _id }, { content: 1, _id: 0 }, options);
                retrive_data[i].product_services = get_services;
                let response = yield DAO.get_data(Models.Wishlist, query, projection, options);
                let wishlisted = response.length > 0 ? true : false;
                retrive_data[i].wishlist = wishlisted;
            }
        }
        return {
            total_count: total_count,
            data: retrive_data
        };
    }
    catch (err) {
        throw err;
    }
});
cart_module.delete = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params, { _id: user_id } = req.user_data;
        let query = { _id: _id, user_id: user_id };
        let remove_data = yield DAO.remove_data(Models.Cart, query);
        if (remove_data.deletedCount > 0) {
            let data = { message: `Cart Item Removed Successfully` };
            return data;
        }
    }
    catch (err) {
        throw err;
    }
});
cart_module.price_details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: user_id } = req.user_data;
        let query = { user_id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let populate = [
            {
                path: "product_id",
                select: "-__v"
            }
        ];
        let response = yield DAO.populate_data(Models.Cart, query, projection, options, populate);
        let cal_price = 0, cal_discount = 0, total_price = 0;
        if (response.length) {
            for (let i = 0; i < response.length; i++) {
                let { quantity, product_id: { price, discount, discount_price } } = response[i];
                // let step_1 = Number(discount_price) * Number(quantity);
                cal_price += Number(price) * Number(quantity);
                cal_discount += Number(discount) * Number(quantity);
            }
        }
        if (cal_price > 0) {
            total_price = Number(cal_price) - Number(cal_discount);
        }
        return {
            price: cal_price,
            discount: cal_discount,
            total_price: total_price
        };
    }
    catch (err) {
        throw err;
    }
});
