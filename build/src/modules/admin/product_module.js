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
exports.product_list_module = void 0;
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const index_1 = require("../../middlewares/index");
const order_details = __importStar(require("./order_details"));
class product_list_module {
}
exports.product_list_module = product_list_module;
_a = product_list_module;
product_list_module.details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { _id: _id, };
        let projection = { __v: 0 };
        let options = { lean: true };
        let populate = [
            {
                path: 'added_by',
                select: 'name'
            },
            {
                path: 'category_id',
                select: 'name'
            },
            {
                path: 'subcategory_id',
                select: 'name'
            },
            {
                path: 'sub_subcategory_id',
                select: 'name'
            },
            {
                path: 'brand_id',
                select: 'name'
            }
        ];
        let retrive_data = yield DAO.populate_data(Models.Products, query, projection, options, populate);
        if (retrive_data.length) {
            let { _id: product_id } = retrive_data[0];
            let product_details = yield _a.retrive_product_details(product_id);
            let product_services = yield _a.retrive_product_services(product_id);
            let product_highlights = yield _a.retrive_product_highlights(product_id);
            let product_variations = yield _a.retrive_product_variations(product_id);
            let product_faqs = yield _a.retrive_faq_products(product_id);
            let ratings = yield _a.retrive_product_ratings(product_id);
            let delivery_locations = yield _a.retrive_product_locations(product_id);
            retrive_data[0].productdetails = product_details;
            retrive_data[0].product_services = product_services;
            retrive_data[0].product_highlights = product_highlights;
            retrive_data[0].product_variations = product_variations;
            retrive_data[0].faqs_products = product_faqs;
            retrive_data[0].ratings = ratings;
            retrive_data[0].delivery_locations = delivery_locations;
            return retrive_data[0];
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
product_list_module.retrive_product_details = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.ProductDetails, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_list_module.retrive_product_services = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.ProductServices, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_list_module.retrive_product_highlights = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.ProductHighlights, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_list_module.retrive_product_variations = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // let query = { product_id_1: product_id }
        let projection = { __v: 0 };
        let options = { lean: true };
        let query = [
            yield order_details.match_variant_product_id(product_id),
            yield order_details.lookup_variants(),
            yield order_details.unwind_variants(),
            yield order_details.group_variants_data(),
        ];
        let response = yield DAO.aggregate_data(Models.Product_Variations, query, options);
        // let response = await DAO.get_data(Models.Product_Variations, query, projection, options)
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_list_module.retrive_faq_products = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.FaqsProducts, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_list_module.retrive_product_ratings = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true, sort: { updated_at: -1 } };
        let populate = [
            {
                path: "user_id",
                select: "profile_pic name"
            }
        ];
        let response = yield DAO.populate_data(Models.Reviews, query, projection, options, populate);
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_list_module.retrive_product_locations = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Delivery_Locations, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
