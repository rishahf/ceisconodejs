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
exports.user_shop_with_us = exports.admin_shop_with_us = void 0;
const DAO = __importStar(require("../../DAO"));
const models_1 = require("../../models");
const index_1 = require("../../middlewares/index");
class admin_shop_with_us {
}
exports.admin_shop_with_us = admin_shop_with_us;
_a = admin_shop_with_us;
admin_shop_with_us.add = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { image, title, price, category_id, language } = req.body;
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
        if (!!language) {
            data_to_save.language = language;
        }
        let response = yield DAO.save_data(models_1.ShopWithUs, data_to_save);
        return response;
    }
    catch (err) {
        throw err;
    }
});
admin_shop_with_us.update = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, image, title, price, category_id, is_enable, language } = req.body;
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
        if (!!language) {
            update.language = language;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(models_1.ShopWithUs, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
admin_shop_with_us.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
            }
        ];
        let response = yield DAO.populate_data(models_1.ShopWithUs, query, projection, options, populate);
        let total_count = yield DAO.count_data(models_1.ShopWithUs, query);
        return {
            total_count: total_count,
            data: response
        };
    }
    catch (err) {
        throw err;
    }
});
admin_shop_with_us.enable_disable = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { is_enable } = req.body;
        let query = { is_deleted: false };
        let option = { lean: true };
        let get_Deals = yield DAO.get_data(models_1.ShopWithUs, query, { __v: 0 }, option);
        let response;
        if (get_Deals.length) {
            get_Deals.forEach((deals) => __awaiter(void 0, void 0, void 0, function* () {
                let options = { new: true };
                let update = { is_enable: is_enable };
                let queery = { _id: deals._id };
                response = yield DAO.find_and_update(models_1.ShopWithUs, queery, update, options);
            }));
        }
        else {
            throw "No data found";
        }
        if (is_enable == true) {
            let message = `Enabled Successfully`;
            return message;
        }
        else if (is_enable == false) {
            let message = `Disabled Successfully`;
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
admin_shop_with_us.detail_shop_with_us = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id, is_deleted: false };
        let projection = { __v: 0, is_deleted: 0 };
        let options = { lean: true };
        let populate = [
            {
                path: 'category_id',
                select: 'name'
            }
        ];
        let response = yield DAO.populate_data(models_1.ShopWithUs, query, projection, options, populate);
        return response[0];
    }
    catch (err) {
        throw err;
    }
});
admin_shop_with_us.delete = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let update = { is_deleted: true };
        let options = { new: true };
        let response = yield DAO.find_and_update(models_1.ShopWithUs, query, update, options);
        if (response.is_deleted == true) {
            let message = `Shop With Us Deleted Successfully`;
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
class user_shop_with_us {
}
exports.user_shop_with_us = user_shop_with_us;
_b = user_shop_with_us;
user_shop_with_us.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let retrive_sections = yield _b.retrive_sections_data();
        if (retrive_sections.length) {
            let { shop_with_us } = retrive_sections[0];
            if (shop_with_us == true) {
                let fetch_data = yield _b.retrive_data(req);
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
user_shop_with_us.retrive_sections_data = () => __awaiter(void 0, void 0, void 0, function* () {
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
user_shop_with_us.retrive_data = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
            }
        ];
        let response = yield DAO.populate_data(models_1.ShopWithUs, query, projection, options, populate);
        let total_count = yield DAO.count_data(models_1.ShopWithUs, query);
        return {
            total_count: total_count,
            data: response
        };
    }
    catch (err) {
        throw err;
    }
});
