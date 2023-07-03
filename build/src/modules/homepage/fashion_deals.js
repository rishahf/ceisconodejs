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
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.user_fashion_deals_module = exports.admin_fashion_deals_module = void 0;
const DAO = __importStar(require("../../DAO"));
const models_1 = require("../../models");
const index_1 = require("../../middlewares/index");
class admin_fashion_deals_module {
}
exports.admin_fashion_deals_module = admin_fashion_deals_module;
_a = admin_fashion_deals_module;
admin_fashion_deals_module.add_fashion_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { image, title, price, category_id, subcategory_id, sub_subcategory_id, brand_id, discount, language } = req.body;
        let data_to_save = {
            image: image,
            title: title,
            price: price,
            is_enable: true,
            updated_at: +new Date(),
            created_at: +new Date()
        };
        if (!!category_id) {
            data_to_save.category_id = category_id;
        }
        if (!!subcategory_id) {
            data_to_save.subcategory_id = subcategory_id;
        }
        if (!!sub_subcategory_id) {
            data_to_save.sub_subcategory_id = sub_subcategory_id;
        }
        if (!!brand_id) {
            data_to_save.brand_id = brand_id;
        }
        if (!!discount) {
            data_to_save.discount = discount;
        }
        if (!!language) {
            data_to_save.language = language;
        }
        let response = yield DAO.save_data(models_1.FashionDeals, data_to_save);
        return response;
    }
    catch (err) {
        throw err;
    }
});
admin_fashion_deals_module.update_fashion_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, image, title, price, category_id, subcategory_id, sub_subcategory_id, brand_id, discount, is_enable, language } = req.body;
        let query = { _id: _id };
        let update = { updated_at: +new Date() };
        if (!!image) {
            update.image = image;
        }
        if (!!title) {
            update.title = title;
        }
        if (!!price) {
            update.price = price;
        }
        if (is_enable != undefined || null) {
            update.is_enable = is_enable;
        }
        if (!!category_id) {
            update.category_id = category_id;
        }
        if (!!subcategory_id) {
            update.subcategory_id = subcategory_id;
        }
        if (!!sub_subcategory_id) {
            update.sub_subcategory_id = sub_subcategory_id;
        }
        if (!!brand_id) {
            update.brand_id = brand_id;
        }
        if (!!discount) {
            update.discount = discount;
        }
        if (!!discount) {
            update.language = language;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(models_1.FashionDeals, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
admin_fashion_deals_module.list_fashion_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit, language } = req.query;
        let query = { is_deleted: false, language: language };
        if (!!_id) {
            query._id = _id;
        }
        let projection = { __v: 0, is_deleted: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let populate = [
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
            },
        ];
        let banners = yield DAO.populate_data(models_1.FashionDeals, query, projection, options, populate);
        let total_count = yield DAO.count_data(models_1.FashionDeals, query);
        return {
            total_count: total_count,
            data: banners
        };
    }
    catch (err) {
        throw err;
    }
});
admin_fashion_deals_module.en_dis_fashion_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { is_enable } = req.body;
        let query = { is_deleted: false };
        let option = { lean: true };
        let get_Deals = yield DAO.get_data(models_1.FashionDeals, query, { __v: 0 }, option);
        let response;
        if (get_Deals.length) {
            get_Deals.forEach((deals) => __awaiter(void 0, void 0, void 0, function* () {
                let options = { new: true };
                let update = { is_enable: is_enable };
                let queery = { _id: deals._id };
                response = yield DAO.find_and_update(models_1.FashionDeals, queery, update, options);
            }));
        }
        else {
            throw 'No data found';
        }
        if (is_enable == true) {
            let message = `Deals Enabled Successfully`;
            return message;
        }
        else if (is_enable == false) {
            let message = `Deals Disabled Successfully`;
            return message;
        }
        else {
            throw yield (0, index_1.handle_custom_error)("SOMETHING_WENT_WRONG", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
admin_fashion_deals_module.detail_fashion_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id, is_deleted: false };
        let projection = { __v: 0, is_deleted: 0 };
        let options = { lean: true };
        let populate = [
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
            },
        ];
        let fashion_deals = yield DAO.populate_data(models_1.FashionDeals, query, projection, options, populate);
        return fashion_deals[0];
    }
    catch (err) {
        throw err;
    }
});
admin_fashion_deals_module.delete_fashion_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let update = { is_deleted: true };
        let options = { new: true };
        let response = yield DAO.find_and_update(models_1.FashionDeals, query, update, options);
        if (response.is_deleted == true) {
            let message = `Fashion Deal Deleted Successfully`;
            return message;
        }
        else {
            throw yield (0, index_1.handle_custom_error)("SOMETHING_WENT_WRONG", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
class user_fashion_deals_module {
}
exports.user_fashion_deals_module = user_fashion_deals_module;
_b = user_fashion_deals_module;
user_fashion_deals_module.user_list_fashion_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let retrive_sections = yield _b.retrive_sections_data();
        if (retrive_sections.length) {
            let { fashion_deals } = retrive_sections[0];
            if (fashion_deals == true) {
                let fetch_data = yield _b.retrive_fashion_deals(req);
                return fetch_data;
            }
            else {
                return {
                    total_count: 0,
                    data: []
                };
            }
        }
    }
    catch (err) {
        throw err;
    }
});
user_fashion_deals_module.retrive_sections_data = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(models_1.HomePageSections, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
user_fashion_deals_module.retrive_fashion_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit, language } = req.query;
        let query = { is_deleted: false, is_enable: true, language: language };
        if (!!_id) {
            query._id = _id;
        }
        let projection = { __v: 0, is_deleted: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let populate = [
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
            },
        ];
        let banners = yield DAO.populate_data(models_1.FashionDeals, query, projection, options, populate);
        let total_count = yield DAO.count_data(models_1.FashionDeals, query);
        return {
            total_count: total_count,
            data: banners
        };
    }
    catch (err) {
        throw err;
    }
});
