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
// Total product count
// Out of Stock (Total product that are out of stock)
// Alert of Stock (Product that will soon go out of that ie quantity less then 5)
// Total orders count
// Total rating & reviews count
// Total earning (Addition of all order pricing)
class dashboard_module {
}
exports.default = dashboard_module;
_a = dashboard_module;
dashboard_module.count = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let query = { added_by: seller_id, is_deleted: false };
        let total_products = yield DAO.count_data(Models.Products, query);
        let out_of_stock = yield _a.out_of_stock_count(req);
        let alert_of_stock = yield _a.alert_of_stock_count(req);
        let total_orders = yield DAO.count_data(Models.OrderProducts, { seller_id: seller_id });
        let total_reviews = yield _a.total_reviews(req);
        let total_ratings = yield _a.total_ratings(req);
        let total_earnings = yield _a.total_earnings(req);
        let response = {
            total_products: total_products,
            out_of_stock: out_of_stock,
            alert_of_stock: alert_of_stock,
            total_orders: total_orders,
            total_reviews: total_reviews,
            total_ratings: total_ratings,
            total_earnings: total_earnings
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
dashboard_module.out_of_stock_count = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let query = {
            is_deleted: false,
            sold: true,
            added_by: seller_id
        };
        let count = yield DAO.count_data(Models.Products, query);
        return count;
    }
    catch (err) {
        throw err;
    }
});
dashboard_module.alert_of_stock_count = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let query = {
            is_deleted: false,
            quantity: { $lt: 5 },
            added_by: seller_id
        };
        let count = yield DAO.count_data(Models.Products, query);
        return count;
    }
    catch (err) {
        throw err;
    }
});
dashboard_module.total_orders = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let query = {};
        let count = yield DAO.count_data(Models.Orders, query);
        return count;
    }
    catch (err) {
        throw err;
    }
});
dashboard_module.total_reviews = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let query = { seller_id: seller_id };
        let count = yield DAO.count_data(Models.Reviews, query);
        return count;
    }
    catch (err) {
        throw err;
    }
});
dashboard_module.total_ratings = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let query = { seller_id: seller_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let reviews = yield DAO.get_data(Models.Reviews, query, projection, options);
        let total_ratings = 0;
        if (reviews.length) {
            for (let i = 0; i < reviews.length; i++) {
                total_ratings += reviews[i].ratings;
            }
        }
        return total_ratings;
    }
    catch (err) {
        throw err;
    }
});
dashboard_module.total_earnings = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let query = { seller_id: seller_id, order_status: "DELIVERED" };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(Models.OrderProducts, query, projection, options);
        let total_price = 0;
        if (retrive_data.length) {
            for (let i = 0; i < retrive_data.length; i++) {
                total_price += retrive_data[i].total_earnings;
            }
        }
        return total_price;
    }
    catch (err) {
        throw err;
    }
});
