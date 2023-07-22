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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.product_list_module = exports.product_edit_module = exports.product_add_module = void 0;
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const search_products = __importStar(require("./search_products"));
const index_1 = require("../../middlewares/index");
class product_add_module {
}
exports.product_add_module = product_add_module;
_a = product_add_module;
product_add_module.add_a_product = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { parent_id, name, description, size, colour, product_type, parcel_id, brand_id, category_id, subcategory_id, sub_subcategory_id, images, product_details, quantity, price, tax_percentage, discount_percantage, services, highlights, clone_product_id, language } = req.body;
        let { _id: seller_id } = req.user_data;
        let discount = 0, discount_price = 0;
        if (discount_percantage > 0) {
            discount = (Number(discount_percantage) / 100) * Number(price);
            discount_price = Number(price) - discount;
        }
        else if (discount_percantage == 0 || discount_percantage == undefined) {
            discount_price = price;
        }
        let random_product_id = yield index_1.helpers.genrate_product_id();
        let data_to_save = {
            name: name,
            prodct_id: random_product_id,
            description: description,
            size: size,
            colour: colour,
            product_type: product_type,
            added_by: seller_id,
            parcel_id: parcel_id,
            brand_id: brand_id,
            category_id: category_id,
            subcategory_id: subcategory_id,
            sub_subcategory_id: sub_subcategory_id,
            images: images,
            quantity: quantity,
            price: price,
            tax_percentage: tax_percentage,
            discount_percantage: discount_percantage,
            discount: discount,
            discount_price: discount_price,
            language: language,
            updated_at: +new Date(),
            created_at: +new Date(),
        };
        if (!!parent_id) {
            yield _a.check_product_varient(parent_id);
            data_to_save.parent_id = parent_id;
        }
        let response = yield DAO.save_data(Models.Products, data_to_save);
        let { _id: product_id } = response;
        yield _a.save_product_details(product_details, product_id);
        yield _a.save_product_services(services, product_id);
        yield _a.save_product_highlights(highlights, product_id);
        if (!!clone_product_id) {
            yield _a.save_locations(clone_product_id, product_id);
        }
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_add_module.save_locations = (clone_product_id, product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let options = {};
        let projections = { __v: 0 };
        let query = { product_id: clone_product_id };
        let get_locations = yield DAO.get_data(Models.Delivery_Locations, query, projections, options);
        if (get_locations && get_locations.length) {
            for (let i = 0; i < get_locations.length; i++) {
                let { address, radius, units, delivery_time, location } = get_locations[i];
                // console.log('locatyion ',location)
                let save_data = {
                    product_id: product_id,
                    address: address,
                    radius: radius,
                    units: units,
                    delivery_time: delivery_time,
                    // location: {}
                    location: { type: "Point", coordinates: [location.coordinates[0], location.coordinates[1]] },
                    created_at: +new Date()
                };
                yield DAO.save_data(Models.Delivery_Locations, save_data);
            }
        }
        return get_locations;
    }
    catch (err) {
        throw err;
    }
});
product_add_module.save_product_details = (product_details, product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (product_details.length) {
            for (let i = 0; i < product_details.length; i++) {
                let { key, value } = product_details[i];
                let unique_number = yield _a.retrive_unique_number(product_id);
                let data_to_save = {
                    product_id: product_id,
                    key: key,
                    value: value,
                    unique_number: unique_number,
                    created_at: +new Date(),
                };
                yield DAO.save_data(Models.ProductDetails, data_to_save);
            }
        }
    }
    catch (err) {
        throw err;
    }
});
product_add_module.retrive_unique_number = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_id: product_id };
        let total_count = yield DAO.count_data(Models.ProductDetails, query);
        let unique_number = Number(total_count) + 1;
        return unique_number;
    }
    catch (err) {
        throw err;
    }
});
product_add_module.save_product_services = (services, product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (services.length) {
            for (let i = 0; i < services.length; i++) {
                let data_to_save = {
                    product_id: product_id,
                    content: services[i],
                };
                yield DAO.save_data(Models.ProductServices, data_to_save);
            }
        }
    }
    catch (err) {
        throw err;
    }
});
product_add_module.save_product_highlights = (highlights, product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (highlights.length) {
            for (let i = 0; i < highlights.length; i++) {
                let data_to_save = {
                    product_id: product_id,
                    content: highlights[i],
                };
                yield DAO.save_data(Models.ProductHighlights, data_to_save);
            }
        }
    }
    catch (err) {
        throw err;
    }
});
product_add_module.check_product_varient = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {
            _id: product_id
        };
        let product = yield DAO.get_data(Models.Products, query, {}, { lean: true });
        let { parent_id } = product[0];
        if (!!parent_id) {
            let err = { type: "CAN'T ADD PRODUCT", status_code: 400, error_message: "YOU CAN'T ADD PRODUCT VARIENT VARIENT" };
            throw err;
        }
    }
    catch (err) {
        throw err;
    }
});
class product_edit_module {
}
exports.product_edit_module = product_edit_module;
_b = product_edit_module;
product_edit_module.edit_a_product = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: product_id, name, colour, description, size, product_type, parcel_id, brand_id, category_id, subcategory_id, sub_subcategory_id, images, quantity, price, discount_percantage, tax_percentage, product_details, services, highlights, sold, is_blocked, is_deleted, is_delivery_available } = req.body;
        // console.log("edit_a_product...",req.body)
        let { _id: seller_id } = req.user_data;
        let query = { _id: product_id, added_by: seller_id };
        let set_data = { updated_at: +new Date() };
        let discount = 0, discount_price = 0;
        if (discount_percantage == "" || discount_percantage == 0) {
            // discount = (Number(discount_percantage) / 100) * Number(price);
            discount_price = price;
            set_data.discount_percantage = discount_percantage;
            set_data.discount = 0;
            set_data.discount_price = discount_price;
        }
        if (!!discount_percantage && discount_percantage > 0) {
            discount = (Number(discount_percantage) / 100) * Number(price);
            discount_price = Number(price) - discount;
            set_data.discount_percantage = discount_percantage;
            set_data.discount = discount;
            set_data.discount_price = discount_price;
        }
        if (!!name) {
            set_data.name = name;
        }
        if (!!description) {
            set_data.description = description;
        }
        if (!!product_type) {
            set_data.product_type = product_type;
        }
        if (!!size) {
            set_data.size = size;
        }
        if (!!parcel_id) {
            set_data.parcel_id = parcel_id;
        }
        if (!!brand_id) {
            set_data.brand_id = brand_id;
        }
        if (!!category_id) {
            set_data.category_id = category_id;
        }
        if (!!subcategory_id) {
            set_data.subcategory_id = subcategory_id;
        }
        if (!!sub_subcategory_id) {
            set_data.sub_subcategory_id = sub_subcategory_id;
        }
        if (!!images) {
            set_data.images = images;
        }
        if (!!colour) {
            set_data.colour = colour;
        }
        if (!!quantity) {
            set_data.quantity = quantity;
            set_data.sold = quantity > 0 ? false : true;
        }
        if (!!price) {
            set_data.price = price;
        }
        if (is_delivery_available == true) {
            set_data.is_delivery_available = is_delivery_available;
            set_data.is_visible = is_delivery_available;
        }
        if (is_delivery_available == false) {
            set_data.is_delivery_available = false;
            set_data.is_visible = false;
        }
        if (!!tax_percentage) {
            set_data.tax_percentage = tax_percentage;
        }
        if (typeof sold !== undefined && sold !== null && sold !== undefined) {
            set_data.sold = sold;
        }
        if (typeof is_blocked !== undefined && is_blocked !== null && is_blocked !== undefined) {
            set_data.is_blocked = is_blocked;
        }
        if (typeof is_deleted !== undefined && is_deleted !== null && is_deleted !== undefined) {
            set_data.is_deleted = is_deleted;
            let query_to_remo = {};
            query_to_remo.$or = [
                { product_id_1: { $in: [product_id] } },
                { product_id_2: { $in: [product_id] } },
            ];
            console.log("P_Var query ---- ", query_to_remo);
            let get_data = yield DAO.get_data(Models.Product_Variations, query_to_remo, { __v: 0 }, { lean: true });
            console.log("P_Varget data ----- ", get_data);
            if (get_data && get_data.length) {
                get_data.forEach((value) => __awaiter(void 0, void 0, void 0, function* () {
                    yield DAO.remove_data(Models.Product_Variations, { _id: value._id });
                }));
            }
        }
        // if (!!product_details) { await this.save_product_details(product_details, product_id) }
        // if (!!services) { await this.save_product_services(product_details, product_id) }
        // if (!!highlights) { await this.save_product_highlights(product_details, product_id) }
        let options = { new: true };
        let response = yield DAO.find_and_update(Models.Products, query, set_data, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
class product_list_module {
}
exports.product_list_module = product_list_module;
_c = product_list_module;
product_list_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id: seller_id } = req.user_data;
        let query = [
            yield search_products.match_data(seller_id),
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
            yield search_products.sort_data1(req.query),
            yield search_products.skip_data(req.query),
            yield search_products.limit_data(req.query)
        ];
        let options = { lean: true };
        let Products = yield DAO.aggregate_data(Models.Products, query, options);
        let query_count = [
            yield search_products.match_data(seller_id),
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
            yield search_products.sort_data1(req.query)
        ];
        let CountProducts = yield DAO.aggregate_data(Models.Products, query_count, options);
        let response = {
            total_count: CountProducts.length,
            data: Products
        };
        return response;
    }
    catch (err) {
        throw err;
    }
});
product_list_module.details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params, { _id: user_id } = req.user_data;
        let query = { _id: _id, added_by: user_id };
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
            let product_details = yield _c.retrive_product_details(product_id);
            let product_services = yield _c.retrive_product_services(product_id);
            let product_highlights = yield _c.retrive_product_highlights(product_id);
            let product_variations = yield _c.retrive_product_variations(product_id);
            let product_faqs = yield _c.retrive_faq_products(product_id);
            let ratings = yield _c.retrive_product_ratings(product_id);
            retrive_data[0].productdetails = product_details;
            retrive_data[0].product_services = product_services;
            retrive_data[0].product_highlights = product_highlights;
            retrive_data[0].product_variations = product_variations;
            retrive_data[0].faqs_products = product_faqs;
            retrive_data[0].ratings = ratings;
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
        let query = { product_id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.Product_Variations, query, projection, options);
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
