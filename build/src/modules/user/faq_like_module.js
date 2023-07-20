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
// FaqLikes
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const index_1 = require("../../config/index");
const user_scope = index_1.app_constant.scope.user;
const index_2 = require("../../middlewares/index");
class faqlike_module {
}
exports.default = faqlike_module;
_a = faqlike_module;
// static like = async (req: any) => {
//     try {
//         let { faq_id, language } = req.body;
//         let { _id: user_id } = req.user_data;
//         let retrive_data: any = await this.check_likes(faq_id, user_id)
//         if (retrive_data.length) {
//             let { type } = retrive_data[0];
//             if (type == "LIKE") {
//                 throw await handle_custom_error("FAQ_ALREADY_LIKED", language)
//             }
//         }
//         else {
//             let data_to_save = {
//                 faq_id: faq_id,
//                 user_id: user_id,
//                 type: "LIKE",
//                 updated_at: +new Date(),
//                 created_at: +new Date()
//             }
//             let response = await DAO.save_data(Models.FaqLikes, data_to_save)
//             return response
//         }
//     }
//     catch (err) {
//         throw err;
//     }
// }
// static dislike = async (req: any) => {
//     try {
//         let { faq_id, language } = req.body;
//         let { _id: user_id } = req.user_data;
//         let retrive_data: any = await this.check_likes(faq_id, user_id)
//         if (retrive_data.length) {
//             let { type } = retrive_data[0];
//             if (type == "DISLIKE") {
//                 throw await handle_custom_error("FAQ_ALREADY_DISLIKED", language)
//             }
//         }
//         else {
//             let data_to_save = {
//                 faq_id: faq_id,
//                 user_id: user_id,
//                 type: "DISLIKE",
//                 updated_at: +new Date(),
//                 created_at: +new Date()
//             }
//             let response = await DAO.save_data(Models.FaqLikes, data_to_save)
//             return response
//         }
//     }
//     catch (err) {
//         throw err;
//     }
// }
faqlike_module.like_dislike = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { faq_id, type: input_type, language } = req.body;
        let { _id: user_id } = req.user_data;
        let retrive_data = yield _a.check_likes(faq_id, user_id);
        if (retrive_data.length) {
            let { _id, type } = retrive_data[0];
            if (input_type == type) {
                if (input_type == "LIKE") {
                    throw yield (0, index_2.handle_custom_error)("FAQ_ALREADY_LIKED", language);
                }
                if (input_type == "DISLIKE") {
                    throw yield (0, index_2.handle_custom_error)("FAQ_ALREADY_DISLIKED", language);
                }
            }
            else {
                let query = { _id: _id };
                let update = { type: input_type, updated_at: +new Date() };
                let options = { new: true };
                let response = yield DAO.find_and_update(Models.FaqLikes, query, update, options);
                return response;
            }
        }
        else {
            let data_to_save = {
                faq_id: faq_id,
                user_id: user_id,
                type: input_type,
                updated_at: +new Date(),
                created_at: +new Date()
            };
            let response = yield DAO.save_data(Models.FaqLikes, data_to_save);
            return response;
        }
    }
    catch (err) {
        throw err;
    }
});
faqlike_module.check_likes = (faq_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { faq_id: faq_id, user_id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.FaqLikes, query, projection, options);
        return response;
    }
    catch (err) {
        throw err;
    }
});
faqlike_module.fetch_token_data = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let language = "ENGLISH";
        let token_data = yield (0, index_2.verify_token)(token, user_scope, language);
        if (token_data) {
            let { user_id } = token_data;
            return user_id;
        }
        else {
            throw yield (0, index_2.handle_custom_error)('UNAUTHORIZED', language);
        }
    }
    catch (err) {
        throw err;
    }
});
faqlike_module.list = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { token } = req.headers;
        let { product_id, pagination, limit, language } = req.query;
        let user_id = token != undefined ? yield _a.fetch_token_data(token) : null;
        let product = yield DAO.get_data(Models.Products, { _id: product_id }, {}, { lean: true });
        let { parent_id } = product[0];
        let query = { product_id: product_id, language: language };
        if (!!parent_id) {
            query = { product_id: parent_id, language: language };
        }
        // let query = { product_id: product_id, language: language };
        let projection = { __v: 0 };
        let options = yield index_2.helpers.set_options(pagination, limit);
        let populate = [{ path: "seller_id", select: "name" }];
        let product_faqs = yield DAO.populate_data(Models.FaqsProducts, query, projection, options, populate);
        let total_count = yield DAO.count_data(Models.FaqsProducts, query);
        if (product_faqs.length) {
            for (let i = 0; i < product_faqs.length; i++) {
                let { _id } = product_faqs[i];
                let total_likes = yield _a.get_total_likes(_id, "LIKE");
                let total_dislikes = yield _a.get_total_likes(_id, "DISLIKE");
                let like_status = yield _a.like_dislike_status(_id, user_id, "LIKE");
                let dislike_status = yield _a.like_dislike_status(_id, user_id, "DISLIKE");
                product_faqs[i].total_likes = total_likes;
                product_faqs[i].total_dislikes = total_dislikes;
                product_faqs[i].is_liked = like_status;
                product_faqs[i].is_disliked = dislike_status;
            }
        }
        return {
            total_count: total_count,
            data: product_faqs
        };
    }
    catch (err) {
        throw err;
    }
});
faqlike_module.get_total_likes = (faq_id, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { faq_id: faq_id, type: type };
        let total_count = yield DAO.count_data(Models.FaqLikes, query);
        return total_count;
    }
    catch (err) {
        throw err;
    }
});
faqlike_module.like_dislike_status = (faq_id, user_id, type) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { faq_id: faq_id, user_id: user_id, type: type };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_data = yield DAO.get_data(Models.FaqLikes, query, projection, options);
        let is_liked = retrive_data.length > 0 ? true : false;
        return is_liked;
    }
    catch (err) {
        throw err;
    }
});
