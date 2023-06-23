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
exports.user_style_for_module = exports.admin_style_for_module = void 0;
const DAO = __importStar(require("../../DAO"));
const models_1 = require("../../models");
const index_1 = require("../../middlewares/index");
class admin_style_for_module {
}
exports.admin_style_for_module = admin_style_for_module;
_a = admin_style_for_module;
admin_style_for_module.add_style_for = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { name, language } = req.body;
        // check total style for added
        let query = { is_deleted: false };
        let total_count = yield DAO.count_data(models_1.StyleFor, query);
        if (total_count < 3) {
            let data_to_save = {
                name: name,
                updated_at: +new Date(),
                created_at: +new Date()
            };
            if (!!language) {
                data_to_save.language = language;
            }
            let response = yield DAO.save_data(models_1.StyleFor, data_to_save);
            return response;
        }
        else {
            throw yield (0, index_1.handle_custom_error)("STYLE_FOR_ERROR", language);
        }
    }
    catch (err) {
        throw err;
    }
});
admin_style_for_module.update_style_for = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, name, language } = req.body;
        let query = { _id: _id };
        let update = { updated_at: +new Date() };
        if (!!name) {
            update.name = name;
        }
        if (!!language) {
            update.language = language;
        }
        let options = { new: true };
        let response = yield DAO.find_and_update(models_1.StyleFor, query, update, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
admin_style_for_module.list_style_for = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit, language } = req.query;
        let query = { is_deleted: false, language: language };
        if (!!_id) {
            query._id = _id;
        }
        let projection = { __v: 0, is_deleted: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let banners = yield DAO.get_data(models_1.StyleFor, query, projection, options);
        let total_count = yield DAO.count_data(models_1.StyleFor, query);
        return {
            total_count: total_count,
            data: banners
        };
    }
    catch (err) {
        throw err;
    }
});
admin_style_for_module.delete_style_for = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let query = { _id: _id };
        let update = { is_deleted: true };
        let options = { new: true };
        let response = yield DAO.find_and_update(models_1.StyleFor, query, update, options);
        if (response.is_deleted == true) {
            let message = `Style For Deleted Successfully`;
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
class user_style_for_module {
}
exports.user_style_for_module = user_style_for_module;
_b = user_style_for_module;
user_style_for_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, pagination, limit, language } = req.query;
        let query = { is_deleted: false, language: language };
        if (!!_id) {
            query._id = _id;
        }
        let projection = { __v: 0, is_deleted: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let retrive_data = yield DAO.get_data(models_1.StyleFor, query, projection, options);
        let total_count = yield DAO.count_data(models_1.StyleFor, query);
        return {
            total_count: total_count,
            data: retrive_data
        };
    }
    catch (err) {
        throw err;
    }
});
