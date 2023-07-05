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
exports.user_dod_module = exports.admin_dod_module = void 0;
const DAO = __importStar(require("../../DAO"));
const models_1 = require("../../models");
const index_1 = require("../../middlewares/index");
// admin_deals_of_the_day_module
class admin_dod_module {
}
exports.admin_dod_module = admin_dod_module;
_a = admin_dod_module;
admin_dod_module.add_a_deal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { image, title, price, category_id, subcategory_id, sub_subcategory_id, brand_id, discount, valid_till, language } = req.body;
        let data_to_save = {
            image: image,
            title: title,
            price: price,
            is_enable: true,
            updated_at: +new Date(),
            created_at: +new Date(),
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
        if (!!valid_till) {
            data_to_save.valid_till = valid_till;
        }
        if (!!language) {
            data_to_save.language = language;
        }
        let response = yield DAO.save_data(models_1.Deals_of_the_day, data_to_save);
        return response;
    }
    catch (err) {
        throw err;
    }
});
admin_dod_module.update_a_deal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, image, title, price, category_id, subcategory_id, sub_subcategory_id, brand_id, discount, valid_till, is_enable, language } = req.body;
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
        if (!!valid_till) {
            update.valid_till = valid_till;
        }
        if (!!language) {
            update.language = language;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(models_1.Deals_of_the_day, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
admin_dod_module.list_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
        let response = yield DAO.populate_data(models_1.Deals_of_the_day, query, projection, options, populate);
        let total_count = yield DAO.count_data(models_1.Deals_of_the_day, query);
        return {
            total_count: total_count,
            data: response
        };
    }
    catch (err) {
        throw err;
    }
});
admin_dod_module.detail_deal_of_the_day = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { is_deleted: false };
        if (!!_id) {
            query._id = _id;
        }
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
        let response = yield DAO.populate_data(models_1.Deals_of_the_day, query, projection, options, populate);
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
admin_dod_module.enable_disable_deals_day = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { is_enable } = req.body;
        let query = { is_deleted: false };
        let option = { lean: true };
        let get_Deals = yield DAO.get_data(models_1.Deals_of_the_day, query, { __v: 0 }, option);
        let response;
        if (get_Deals.length) {
            get_Deals.forEach((deals) => __awaiter(void 0, void 0, void 0, function* () {
                let options = { new: true };
                let update = { is_enable: is_enable };
                let queery = { _id: deals._id };
                response = yield DAO.find_and_update(models_1.Deals_of_the_day, queery, update, options);
            }));
        }
        else {
            throw 'No data found';
        }
        let options = { new: true };
        // let response: any = await DAO.find_and_update(Models.Deals, query, update, options)
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
admin_dod_module.delete_a_deal = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let update = { is_deleted: true };
        let options = { new: true };
        let response = yield DAO.find_and_update(models_1.Deals_of_the_day, query, update, options);
        if (response.is_deleted == true) {
            let message = `Deal Deleted Successfully`;
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
//add detal timer
admin_dod_module.add_timer_of_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { valid_till } = req.body;
        let data_to_save = {
            valid_till: valid_till,
            is_active: true,
            created_at: +new Date(),
        };
        let response = yield DAO.save_data(models_1.Deals_Timer, data_to_save);
        yield DAO.find_and_update(models_1.Deals_Timer, { _id: { $ne: response._id }, is_active: true }, { is_active: false }, { lean: true });
        return response;
    }
    catch (err) {
        throw err;
    }
});
//update deal timer
admin_dod_module.update_timer_of_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, valid_till, is_active } = req.body;
        if (is_active == true) {
            yield DAO.find_and_update(models_1.Deals_Timer, { is_active: true }, { is_active: false }, { lean: true });
        }
        let query = { _id: _id };
        let update = { updated_at: +new Date() };
        if (!!valid_till) {
            update.valid_till = valid_till;
        }
        if (!!is_active) {
            update.is_active = is_active;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(models_1.Deals_Timer, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
admin_dod_module.get_all_timer_of_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit } = req.query;
        let query = {};
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let response = yield DAO.get_data(models_1.Deals_Timer, query, projection, options);
        let total_count = yield DAO.count_data(models_1.Deals_Timer, query);
        // return {
        //     total_count: total_count,
        //     data: response
        // }
        return response;
    }
    catch (err) {
        throw err;
    }
});
//get deal timer
admin_dod_module.get_timer_of_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let projection = { __v: 0 };
        let options = { new: true };
        let response = yield DAO.get_data(models_1.Deals_Timer, query, projection, options);
        return response[0];
    }
    catch (err) {
        throw err;
    }
});
admin_dod_module.get_users_timer_of_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { is_active: true };
        let projection = { __v: 0 };
        let options = { new: true };
        let response = yield DAO.get_data(models_1.Deals_Timer, query, projection, options);
        return response[0];
    }
    catch (err) {
        throw err;
    }
});
// user_deals_of_the_day_module
class user_dod_module {
}
exports.user_dod_module = user_dod_module;
_b = user_dod_module;
user_dod_module.user_list_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let retrive_sections = yield _b.retrive_sections_data();
        if (retrive_sections.length) {
            let { deal_of_the_day } = retrive_sections[0];
            if (deal_of_the_day == true) {
                let fetch_data = yield _b.retrive_deals(req);
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
user_dod_module.retrive_sections_data = () => __awaiter(void 0, void 0, void 0, function* () {
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
user_dod_module.retrive_deals = (req) => __awaiter(void 0, void 0, void 0, function* () {
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
        let response = yield DAO.populate_data(models_1.Deals_of_the_day, query, projection, options, populate);
        let total_count = yield DAO.count_data(models_1.Deals_of_the_day, query);
        return {
            total_count: total_count,
            data: response
        };
    }
    catch (err) {
        throw err;
    }
});
