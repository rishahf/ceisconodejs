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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchDeliveryLocation = exports.retrive_filter_products = exports.listing_fashion_deals_products = exports.listing_hot_deals_products = exports.list_fashion_deals = exports.list_hot_deals = exports.listing_deals_of_the_day_products = exports.list_deals_of_the_day = exports.list_product_variants = exports.list_banners = exports.list_brands = exports.list_sub_subcategories = exports.list_sub_categories = exports.list_categories = exports.list_product_faqs = exports.list_faqs = exports.list_reviews = exports.product_details = exports.list_related_products = exports.list_products = void 0;
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const product_services = __importStar(require("./product_services"));
const search_products = __importStar(require("./search_products"));
const filter_products = __importStar(require("./filter_products"));
const product_module_1 = __importDefault(require("./product_module"));
const index_1 = require("../../middlewares/index");
const list_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = [
            yield search_products.remove_deleted(),
            yield search_products.lookup_brands(),
            yield search_products.unwind_brands(),
            yield search_products.lookup_categories(),
            yield search_products.unwind_categories(),
            yield search_products.lookup_subcategories(),
            yield search_products.unwind_subcategories(),
            yield search_products.lookup_sub_subcategories(),
            yield search_products.unwind_sub_subcategories(),
            yield search_products.lookup_seller(),
            yield search_products.unwind_seller(),
            yield search_products.filter_data(req.query),
            yield search_products.group_data(),
            yield search_products.sort_data(),
            yield search_products.skip_data(req.query),
            yield search_products.limit_data(req.query)
        ];
        let options = { lean: true };
        let Products = yield DAO.aggregate_data(Models.Products, query, options);
        let count_query = [
            yield search_products.remove_deleted(),
            yield search_products.lookup_brands(),
            yield search_products.unwind_brands(),
            yield search_products.lookup_categories(),
            yield search_products.unwind_categories(),
            yield search_products.lookup_subcategories(),
            yield search_products.unwind_subcategories(),
            yield search_products.lookup_sub_subcategories(),
            yield search_products.unwind_sub_subcategories(),
            yield search_products.lookup_seller(),
            yield search_products.unwind_seller(),
            yield search_products.filter_data(req.query),
            yield search_products.group_data(),
            yield search_products.sort_data()
        ];
        let Count_Products = yield DAO.aggregate_data(Models.Products, count_query, options);
        let response = {
            total_count: Count_Products.length,
            data: Products
        };
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_products = list_products;
const list_related_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id } = req.query;
        let product_data = yield retrive_product_data(product_id);
        let { subcategory_id } = product_data;
        let query = [
            yield search_products.match(product_id, subcategory_id),
            yield search_products.lookup_brands(),
            yield search_products.unwind_brands(),
            yield search_products.lookup_categories(),
            yield search_products.unwind_categories(),
            yield search_products.lookup_subcategories(),
            yield search_products.unwind_subcategories(),
            yield search_products.lookup_sub_subcategories(),
            yield search_products.unwind_sub_subcategories(),
            yield search_products.lookup_seller(),
            yield search_products.unwind_seller(),
            // await search_products.filter_data(req.query),
            yield search_products.group_data(),
            yield search_products.sort_data(),
            yield search_products.skip_data(req.query),
            yield search_products.limit_data(req.query)
        ];
        let options = { lean: true };
        let Products = yield DAO.aggregate_data(Models.Products, query, options);
        let count_query = [
            yield search_products.match(product_id, subcategory_id),
            yield search_products.lookup_brands(),
            yield search_products.unwind_brands(),
            yield search_products.lookup_categories(),
            yield search_products.unwind_categories(),
            yield search_products.lookup_subcategories(),
            yield search_products.unwind_subcategories(),
            yield search_products.lookup_sub_subcategories(),
            yield search_products.unwind_sub_subcategories(),
            yield search_products.lookup_seller(),
            yield search_products.unwind_seller(),
            // await search_products.filter_data(req.query),
            yield search_products.group_data(),
            yield search_products.sort_data()
        ];
        let Count_Products = yield DAO.aggregate_data(Models.Products, count_query, options);
        let response = {
            total_count: Count_Products.length,
            data: Products
        };
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_related_products = list_related_products;
const retrive_product_data = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
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
const product_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield product_module_1.default.details(req);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.product_details = product_details;
const list_reviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: product_id, pagination, limit } = req.query;
        let product = DAO.get_data(Models.Products, { _id: product_id }, {}, { lean: true });
        let { parent_id } = product[0];
        let query = { product_id: product_id };
        if (!!parent_id) {
            query.$or = [{ product_id: product_id }, { product_id: parent_id }];
        }
        let populate = [
            { path: "user_id", select: "name profile_pic" }
        ];
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.populate_data(Models.Reviews, query, projection, options, populate);
        let fetch_product = yield DAO.get_data(Models.Products, { _id: product_id }, projection, options);
        let { total_reviews, total_ratings, average_rating, one_star_ratings, two_star_ratings, three_star_ratings, four_star_ratings, five_star_ratings } = fetch_product[0];
        // fetch total count
        let total_count = yield product_services.fetch_total_count(Models.Reviews, query);
        let response = {
            total_count: total_count,
            total_reviews: total_reviews,
            total_ratings: total_ratings,
            average_rating: average_rating,
            one_star_ratings: one_star_ratings,
            two_star_ratings: two_star_ratings,
            three_star_ratings: three_star_ratings,
            four_star_ratings: four_star_ratings,
            five_star_ratings: five_star_ratings,
            data: fetch_data,
        };
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_reviews = list_reviews;
const list_faqs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, pagination, limit } = req.query;
        let query = { is_deleted: false };
        if (search != undefined) {
            query.$or = [
                { question: { $regex: search, $options: 'i' } },
                { answer: { $regex: search, $options: 'i' } }
            ];
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield DAO.get_data(Models.Faqs, query, projection, options);
        // fetch total orders
        let total_count = fetch_data.length;
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_faqs = list_faqs;
const list_product_faqs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: product_id, pagination, limit } = req.query;
        let product = DAO.get_data(Models.Products, { _id: product_id }, {}, { lean: true });
        let { parent_id } = product[0];
        let query = { product_id: product_id };
        if (!!parent_id) {
            query.$or = [{ product_id: product_id }, { product_id: parent_id }];
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let populate = [
            { path: "seller_id", select: "name" }
        ];
        let fetch_data = yield DAO.populate_data(Models.FaqsProducts, query, projection, options, populate);
        // fetch total count
        let total_count = fetch_data.length;
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_product_faqs = list_product_faqs;
const list_categories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query;
        let query = { is_deleted: false };
        if (!!_id) {
            query._id = _id;
        }
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield product_services.make_category_response(query, options);
        let total_count = yield product_services.fetch_total_count(Models.Category, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_categories = list_categories;
const list_sub_categories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, category_id, search, pagination, limit } = req.query;
        let query = { is_deleted: false };
        if (!!_id) {
            query._id = _id;
        }
        if (!!category_id) {
            query.category_id = category_id;
        }
        if (!!search) {
            query.name = { $regex: search, $options: "i" };
        }
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield product_services.make_subcategory_response(query, options);
        let total_count = yield product_services.fetch_total_count(Models.SubCategory, query);
        let response = {
            total_count: total_count,
            data: fetch_data
        };
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_sub_categories = list_sub_categories;
const list_sub_subcategories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, subcategory_id, search, pagination, limit } = req.query;
        let query = { is_deleted: false };
        if (!!_id) {
            query._id = _id;
        }
        if (!!subcategory_id) {
            query.subcategory_id = subcategory_id;
        }
        if (!!search) {
            query.name = { $regex: search, $options: "i" };
        }
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield product_services.make_Sub_subcategories(query, options);
        let total_count = yield product_services.fetch_total_count(Models.Sub_subcategories, query);
        let response = {
            total_count: total_count,
            data: fetch_data
        };
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_sub_subcategories = list_sub_subcategories;
const list_brands = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { search, pagination, limit } = req.query;
        let query = { is_deleted: false };
        // if (_id != undefined) { query._id = _id }
        if (search != undefined) {
            query.name = { $regex: search, $options: "i" };
        }
        // if (_id != undefined) { query._id = _id }
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield product_services.make_brand_response(query, options);
        options.sort = { name: 1 };
        // fetch total count
        let total_count = yield product_services.fetch_total_count(Models.Brands, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // //console.log(response);
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_brands = list_brands;
const list_banners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query;
        let query = {};
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield product_services.make_banners_response(query, options);
        // fetch total count
        let total_count = yield product_services.fetch_total_count(Models.Banners, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // //console.log(response);
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_banners = list_banners;
const list_product_variants = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { product_id: _id };
        let options = { lean: true };
        let response = yield product_services.get_variants_detail(query, options);
        // //console.log(response);
        // return response
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_product_variants = list_product_variants;
const list_deals_of_the_day = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query;
        let query = {};
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield product_services.make_deals_response(query, options);
        // fetch total count
        let total_count = yield product_services.fetch_total_count(Models.Deals_of_the_day, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // //console.log(response);
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_deals_of_the_day = list_deals_of_the_day;
const listing_deals_of_the_day_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response = yield product_services.get_deals_detail(query, options);
        let subCategories_id = response[0].subcategory_id._id;
        // console.log("-------check SUB-------", subCategories_id);
        let query_data = { subcategory_id: subCategories_id };
        let fetch_product_data = yield DAO.get_data(Models.Products, query_data, projection, options);
        (0, index_1.handle_success)(res, fetch_product_data);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.listing_deals_of_the_day_products = listing_deals_of_the_day_products;
const list_hot_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query;
        let query = {};
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield product_services.make_hot_deals_response(query, options);
        // fetch total count
        let total_count = yield product_services.fetch_total_count(Models.Hot_deals, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        // //console.log(response);
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_hot_deals = list_hot_deals;
const listing_hot_deals_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response = yield product_services.get_hotdeals_detail(query, options);
        let subCategories_id = response[0].subcategory_id._id;
        // console.log("-------check SUB-------", subCategories_id);
        let query_data = { subcategory_id: subCategories_id };
        let fetch_product_data = yield DAO.get_data(Models.Products, query_data, projection, options);
        (0, index_1.handle_success)(res, fetch_product_data);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.listing_hot_deals_products = listing_hot_deals_products;
const list_fashion_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query;
        let query = {};
        let options = yield index_1.helpers.set_options(pagination, limit);
        let fetch_data = yield product_services.make_fashion_deals_response(query, options);
        // fetch total count
        let total_count = yield product_services.fetch_total_count(Models.FashionDeals, query);
        let response = {
            total_count: total_count,
            data: fetch_data,
        };
        //console.log(response);
        // return data
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.list_fashion_deals = list_fashion_deals;
const listing_fashion_deals_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.query;
        let query = { _id: _id };
        let options = { lean: true };
        let projection = { __v: 0 };
        let response = yield product_services.get_fashiondeals_detail(query, options);
        let brand_id = response[0].brand_id._id;
        // console.log("-------check SUB-------", brand_id);
        let query_data = { brand_id: brand_id };
        let fetch_product_data = yield DAO.get_data(Models.Products, query_data, projection, options);
        (0, index_1.handle_success)(res, fetch_product_data);
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
exports.listing_fashion_deals_products = listing_fashion_deals_products;
// const list_products_filter = async (req: any, res: express.Response) => {
//     try {
//         let { subcategory_id, sub_subcategory_id, brand_id, min_price, max_price, discount_available, ratings, pagination, limit, } = req.query;
//         let fetch_data: any, total_count: any;
//         // console.log('**** req.query **** ',req.query)
//         let query: any = [
//             await product_helper.redact_filter_data(req.query),
//             // await product_helper.redact_filter_data(sub_subcategory_id,"$sub_subcategory_id"),
//             // await product_helper.redact_filter_data(brand_id, "$brand_id"),
//             await product_helper.redact_match_price(min_price, max_price),
//             await product_helper.redact_match_data(discount_available, "$discount_percantage"),
//             await product_helper.redact_match_data(ratings, "$average_rating"),
//             await product_helper.lookup_data("subcategories", "$subcategory_id"),
//             await product_helper.unwind_data("$subcategory_id"),
//             await product_helper.lookup_data("sub_subcategories", "$sub_subcategory_id"),
//             await product_helper.unwind_data("$sub_subcategory_id"),
//             await product_helper.lookup_data("brands", "$brand_id"),
//             await product_helper.unwind_data("$brand_id"),
//             await product_helper.lookup_data("sellers", "$added_by"),
//             await product_helper.unwind_data("$added_by"),
//             await product_helper.sort_by_price(),
//             await product_helper.sort_data(),
//             await product_helper.skip_data(pagination, limit),
//             await product_helper.limit_data(limit)
//         ];
//         let options = { lean: true };
//         fetch_data = await DAO.aggregate_data(Models.Products, query, options);
//         total_count = await fetch_data.length;
//         // console.log(fetch_data);
//         let response = { total_count: total_count, data: fetch_data, };
//         // return data
//         handle_success(res, response);
//     } catch (err) {
//         handle_catch(res, err);
//     }
// };
const retrive_filter_products = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let { token } = req.headers;
        let user_id = token != undefined ? yield product_module_1.default.fetch_token_data(token) : null;
        console.log('filters req-query ', req.query);
        let query = [
            yield filter_products.match_data(),
            yield filter_products.filter_data(req.query),
            yield filter_products.lookup_brands(),
            yield filter_products.unwind_brands(),
            yield filter_products.lookup_categories(),
            yield filter_products.unwind_categories(),
            yield filter_products.lookup_subcategories(),
            yield filter_products.unwind_subcategories(),
            yield filter_products.lookup_sub_subcategories(),
            yield filter_products.unwind_sub_subcategories(),
            yield filter_products.lookup_seller(),
            yield filter_products.unwind_seller(),
            yield filter_products.product_highlights(),
            yield filter_products.wishlists(user_id),
            yield filter_products.set_data(),
            yield filter_products.group_data(),
            yield filter_products.sort_data(req.query),
            yield filter_products.skip_data(req.query),
            yield filter_products.limit_data(req.query)
        ];
        let options = { lean: true };
        let retrive_data = yield DAO.aggregate_data(Models.Products, query, options);
        query.push(yield filter_products.sort_highest_price());
        let retrive_highest_price_data = yield DAO.aggregate_data(Models.Products, query, options);
        console.log("retrive_price_data --- ", retrive_highest_price_data[0]);
        let count_query = [
            yield filter_products.match_data(),
            yield filter_products.filter_data(req.query),
            yield filter_products.lookup_brands(),
            yield filter_products.unwind_brands(),
            yield filter_products.lookup_categories(),
            yield filter_products.unwind_categories(),
            yield filter_products.lookup_subcategories(),
            yield filter_products.unwind_subcategories(),
            yield filter_products.lookup_sub_subcategories(),
            yield filter_products.unwind_sub_subcategories(),
            yield filter_products.lookup_seller(),
            yield filter_products.unwind_seller(),
            yield filter_products.product_highlights(),
            yield filter_products.wishlists(user_id),
            yield filter_products.set_data(),
            yield filter_products.group_data()
        ];
        let count_data = yield DAO.aggregate_data(Models.Products, count_query, options);
        let response = {
            total_count: count_data.length,
            max_price: retrive_highest_price_data != undefined ? Math.ceil((_a = retrive_highest_price_data[0]) === null || _a === void 0 ? void 0 : _a.discount_price) : 0,
            data: retrive_data
        };
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        throw err;
    }
});
exports.retrive_filter_products = retrive_filter_products;
const searchDeliveryLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { token } = req.headers;
        let response;
        let user_id = token != undefined ? yield product_module_1.default.fetch_token_data(token) : null;
        response = yield product_module_1.default.searchLocation(req.query);
        (0, index_1.handle_success)(res, response);
    }
    catch (err) {
        throw err;
    }
});
exports.searchDeliveryLocation = searchDeliveryLocation;
