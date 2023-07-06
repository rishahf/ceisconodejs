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
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_fashiondeals_detail = exports.get_hotdeals_detail = exports.get_deals_detail = exports.make_fashion_deals_response = exports.make_hot_deals_response = exports.make_deals_response = exports.make_variants_response = exports.get_variants_detail = exports.get_product_detail = exports.make_banners_response = exports.make_brand_response = exports.make_Sub_subcategories = exports.make_subcategory_response = exports.make_category_response = exports.make_products_response = exports.fetch_total_count = void 0;
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const fetch_total_count = (collection, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield DAO.count_data(collection, query);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.fetch_total_count = fetch_total_count;
const make_products_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield DAO.aggregate_data(Models.Products, query, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
exports.make_products_response = make_products_response;
const get_product_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'brand_id', select: 'name' },
            { path: 'subcategory_id', select: 'name' },
            { path: "sub_subcategory_id", select: "name" },
            { path: 'product_details', select: 'key value' },
            // { path: 'deliverable_cities', select: 'city_name' }
        ];
        let respone = yield DAO.populate_data(Models.Products, query, projection, options, populate);
        // console.log("------RESPONSE-------",respone)
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_product_detail = get_product_detail;
const get_deals_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'subcategory_id', select: 'name' },
        ];
        let respone = yield DAO.populate_data(Models.Deals_of_the_day, query, projection, options, populate);
        // console.log("------RESPONSE-------",respone)
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_deals_detail = get_deals_detail;
const get_hotdeals_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'subcategory_id', select: 'name' },
        ];
        let respone = yield DAO.populate_data(Models.Hot_deals, query, projection, options, populate);
        // console.log("------RESPONSE-------",respone)
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_hotdeals_detail = get_hotdeals_detail;
const get_fashiondeals_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'brand_id', select: 'name' },
        ];
        let respone = yield DAO.populate_data(Models.FashionDeals, query, projection, options, populate);
        // console.log("------RESPONSE-------",respone)
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_fashiondeals_detail = get_fashiondeals_detail;
const get_variants_detail = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: "product_id", select: "" }
        ];
        let respone = yield DAO.populate_data(Models.Product_Variations, query, projection, options, populate);
        // console.log(respone)
        return respone;
    }
    catch (err) {
        throw err;
    }
});
exports.get_variants_detail = get_variants_detail;
const make_category_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Category, query, projection, options);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_category_response = make_category_response;
const make_subcategory_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'category_id', select: 'name' }
        ];
        let response = yield DAO.populate_data(Models.SubCategory, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_subcategory_response = make_subcategory_response;
const make_variants_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'product_id', select: 'name description services highlights' }
        ];
        let response = yield DAO.populate_data(Models.Product_Variations, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_variants_response = make_variants_response;
const make_Sub_subcategories = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'category_id', select: 'name' }
        ];
        let response = yield DAO.populate_data(Models.Sub_subcategories, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_Sub_subcategories = make_Sub_subcategories;
const make_brand_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let populate = [
            { path: 'product_id', select: ' ' }
        ];
        let response = yield DAO.populate_data(Models.Brands, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_brand_response = make_brand_response;
const make_banners_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Banners, query, projection, options);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_banners_response = make_banners_response;
const make_deals_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Deals_of_the_day, query, projection, options);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_deals_response = make_deals_response;
const make_hot_deals_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.Hot_deals, query, projection, options);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_hot_deals_response = make_hot_deals_response;
const make_fashion_deals_response = (query, options) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let projection = { __v: 0 };
        let response = yield DAO.get_data(Models.FashionDeals, query, projection, options);
        return response;
    }
    catch (err) {
        throw (err);
    }
});
exports.make_fashion_deals_response = make_fashion_deals_response;
