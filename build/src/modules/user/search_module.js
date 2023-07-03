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
const mongoose_1 = __importDefault(require("mongoose"));
class search_module {
}
exports.default = search_module;
_a = search_module;
search_module.search = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let products = yield _a.search_products(req);
        let categories = yield _a.search_categories(req);
        let sc = yield _a.search_sub_categories(req);
        let ssc = yield _a.search_sub_sub_categories(req);
        // let brands = await this.search_brands(req)
        // let merge = [...products, ...categories, ...sc, ...ssc, ...brands]
        let merge = [...products, ...categories, ...sc, ...ssc];
        return merge;
    }
    catch (err) {
        throw err;
    }
});
search_module.search_products = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search } = req.query;
        let query = {
            is_deleted: false,
            is_visible: true,
            name: {
                $regex: search,
                $options: "i"
            }
        };
        let projection = { name: 1, images: 1 };
        let options = { lean: true, sort: { _id: -1 }, limit: 5 };
        let response = yield DAO.get_data(Models.Products, query, projection, options);
        let products = [];
        if (response.length) {
            for (let i = 0; i < response.length; i++) {
                products.push({
                    _id: response[i]._id,
                    name: response[i].name,
                    image: response[i].images[0],
                    type: "PRODUCTS"
                });
            }
        }
        return products;
    }
    catch (err) {
        throw err;
    }
});
search_module.search_categories = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search } = req.query;
        let query = {
            //   is_deleted: false,
            name: {
                $regex: search,
                $options: "i",
            },
        };
        let projection = { name: 1 };
        let options = { lean: true, sort: { _id: -1 }, limit: 5 };
        let response = yield DAO.get_data(Models.Category, query, projection, options);
        let category = [];
        if (response.length) {
            for (let i = 0; i < response.length; i++) {
                category.push({
                    _id: response[i]._id,
                    name: response[i].name,
                    type: "CATEGORY"
                });
            }
        }
        return category;
    }
    catch (err) {
        throw err;
    }
});
search_module.search_sub_categories = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search } = req.query;
        let query = {
            //   is_deleted: false,
            name: {
                $regex: search,
                $options: "i",
            },
        };
        let projection = { name: 1, category_id: 1 };
        let options = { lean: true, sort: { _id: -1 }, limit: 5 };
        // let populate = [
        //     {
        //         path : 'category_id',
        //         select : 'name'
        //     }
        // ]
        let response = yield DAO.get_data(Models.SubCategory, query, projection, options);
        let subcategory = [];
        if (response.length) {
            for (let i = 0; i < response.length; i++) {
                subcategory.push({
                    _id: response[i]._id,
                    category_id: response[i].category_id,
                    name: response[i].name,
                    type: "SUB_CATEGORY"
                });
            }
        }
        return subcategory;
    }
    catch (err) {
        throw err;
    }
});
search_module.search_sub_sub_categories = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search } = req.query;
        let query = {
            //   is_deleted: false,
            name: {
                $regex: search,
                $options: "i",
            },
        };
        let projection = { __v: 0 };
        let options = { lean: true, sort: { _id: -1 }, limit: 5 };
        let response = yield DAO.get_data(Models.Sub_subcategories, query, projection, options);
        let sub_subcategories = [];
        if (response.length) {
            for (let i = 0; i < response.length; i++) {
                let get_cat_id = yield DAO.get_data(Models.SubCategory, { _id: response[i].subcategory_id }, { __v: 0 }, { lean: true });
                console.log('cat_id - ', get_cat_id);
                sub_subcategories.push({
                    _id: response[i]._id,
                    name: response[i].name,
                    category_id: get_cat_id[0].category_id,
                    sub_category_id: response[i].subcategory_id,
                    type: "SUB_SUB_CATEGORIES",
                });
            }
        }
        return sub_subcategories;
    }
    catch (err) {
        throw err;
    }
});
search_module.search_brands = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search } = req.query;
        let query = {
            //   is_deleted: false,
            name: {
                $regex: search,
                $options: "i",
            },
        };
        console.log('Brand name -- ', req.query);
        let projection = { name: 1 };
        let options = { lean: true, sort: { _id: -1 }, limit: 5 };
        let response = yield DAO.get_data(Models.Brands, query, projection, options);
        console.log('brand response --  ', response);
        let brands = [];
        if (response.length) {
            for (let i = 0; i < response.length; i++) {
                brands.push({
                    _id: response[i]._id,
                    name: response[i].name,
                    type: "BRANDS"
                });
            }
        }
        return brands;
    }
    catch (err) {
        throw err;
    }
});
search_module.searchLocation = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id, lat, lng } = req;
        let query = [
            yield _a.match_product_id(product_id)
        ];
        let response = yield DAO.aggregate_data(Models.Delivery_Locations, query, { lean: true });
        if (response.length) {
            return response[0];
        }
        else {
            return 'Delivery not available';
        }
    }
    catch (err) {
        throw err;
    }
});
search_module.match_product_id = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    return {
        $match: {
            product_id: mongoose_1.default.Types.ObjectId(product_id)
        }
    };
});
