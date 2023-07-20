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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.list_review_module = exports.edit_review_module = exports.add_review_module = void 0;
const DAO = __importStar(require("../../DAO"));
const Models = __importStar(require("../../models"));
const index_1 = require("../../middlewares/index");
const mongoose_1 = __importDefault(require("mongoose"));
const common_1 = require("../../middlewares/common");
const index_2 = require("../../middlewares/index");
class add_review_module {
}
exports.add_review_module = add_review_module;
_a = add_review_module;
add_review_module.can_add_review = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id } = req.query, { _id: user_id } = req.user_data;
        let query = {
            product_id: mongoose_1.default.Types.ObjectId(product_id),
            user_id: mongoose_1.default.Types.ObjectId(user_id),
            order_status: "DELIVERED",
        };
        console.log('query can add review ', query);
        let projection = { __v: 0 };
        let options = { lean: true };
        let response = yield DAO.get_data(Models.OrderProducts, query, projection, options);
        console.log('can add ', response);
        if (response.length) {
            let retrive_data = yield _a.check_review_added(product_id, user_id);
            let can_review = retrive_data.length > 0 ? false : true;
            return {
                can_review: can_review
            };
        }
        else {
            let can_review = false;
            return {
                can_review: can_review
            };
        }
    }
    catch (err) {
        throw err;
    }
});
add_review_module.add_review = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { product_id, title, description, ratings, images, order_product_id, order_id, language } = req.body;
        let { _id: user_id } = req.user_data;
        let product_info = yield _a.retrive_all_product_info(product_id);
        let { parent_id } = product_info[0];
        if (!!parent_id) {
            product_info = yield _a.retrive_all_product_info(parent_id);
        }
        if (product_info.length) {
            let { added_by } = product_info[0];
            let purchased_product;
            for (let value of product_info) {
                let { _id: updated_product_id } = value;
                purchased_product = yield _a.check_product_purchased(updated_product_id, user_id);
                let retrive_data = yield _a.check_review_added(updated_product_id, user_id);
                if (retrive_data.length) {
                    throw yield (0, index_1.handle_custom_error)("REVIEW_ALREADY_ADDED", "ENGLISH");
                }
            }
            if (purchased_product == null && undefined) {
                console.log("is purchased_product ", purchased_product);
                throw 'You cannot add review';
                // throw await handle_custom_error("YOU_CANNOT_ADD_REVIEW","ENGLISH")
            }
            let data_to_save = {
                user_id: user_id,
                //   product_id: product_id,
                seller_id: added_by,
                // order_product_id:order_product_id,
                title: title,
                description: description,
                ratings: ratings,
                images: images,
                language: language,
                updated_at: +new Date(),
                created_at: +new Date(),
            };
            if (order_product_id) {
                data_to_save.order_product_id = order_product_id;
            }
            if (order_id) {
                data_to_save.order_id = order_id;
            }
            if (!!parent_id) {
                data_to_save.product_id = parent_id;
            }
            else {
                data_to_save.product_id = product_id;
            }
            let response = yield DAO.save_data(Models.Reviews, data_to_save);
            for (let value of product_info) {
                let { _id: updated_product_id } = value;
                yield _a.update_count_in_product(updated_product_id, ratings);
            }
            let projection = { __v: 0 };
            let options = { lean: true };
            //email to seller 
            let seller_detail = yield DAO.get_data(Models.Sellers, { _id: added_by }, projection, options);
            //notification to seller
            let seller_fcm_ids = yield common_1.common_module.seller_fcms(added_by);
            if (seller_fcm_ids && seller_fcm_ids.length) {
                let notification_to_seller = {
                    type: "NEW_REVIEW",
                    title: "New Review",
                    message: "A new Review has been added on product.",
                    seller_id: added_by,
                    //   orderProduct_id: _id,
                    product_id: product_id,
                    created_at: +new Date(),
                };
                yield DAO.save_data(Models.Notifications, notification_to_seller);
                yield (0, index_2.send_notification_to_all)(notification_to_seller, seller_fcm_ids);
            }
            return response;
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLSIH");
        }
    }
    catch (err) {
        throw err;
    }
});
add_review_module.retrive_product_info = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_product = yield DAO.get_data(Models.Products, query, projection, options);
        return retrive_product;
    }
    catch (err) {
        throw err;
    }
});
add_review_module.retrive_all_product_info = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = {};
        query.$or = [{ _id: product_id }, { parent_id: product_id }];
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_product = yield DAO.get_data(Models.Products, query, projection, options);
        return retrive_product;
    }
    catch (err) {
        throw err;
    }
});
add_review_module.check_review_added = (product_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { user_id: user_id, product_id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_product = yield DAO.get_data(Models.Reviews, query, projection, options);
        return retrive_product;
    }
    catch (err) {
        throw err;
    }
});
add_review_module.check_product_purchased = (product_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { user_id: user_id, product_id: product_id, order_status: 'DELIVERED' };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_product = yield DAO.get_data(Models.OrderProducts, query, projection, options);
        return retrive_product;
    }
    catch (err) {
        throw err;
    }
});
add_review_module.update_count_in_product = (product_id, ratings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product_info = yield _a.retrive_product_info(product_id);
        if (product_info.length > 0) {
            let { total_reviews, total_ratings } = product_info[0];
            let cal_reviews = Number(total_reviews) + 1;
            let cal_ratings = Number(total_ratings) + Number(ratings);
            let average_ratings = Number(cal_ratings) / Number(cal_reviews);
            let fixed_ratings = Number(cal_ratings.toFixed(1));
            let fixed_avg_ratings = Number(average_ratings.toFixed(1));
            let query = { _id: product_id };
            let update = {
                total_reviews: cal_reviews,
                total_ratings: fixed_ratings,
                average_rating: fixed_avg_ratings
            };
            if (ratings == 1 || ratings > 1 && ratings < 2) {
                update.$inc = {
                    one_star_ratings: 1
                };
            }
            else if (ratings == 2 || ratings > 2 && ratings < 3) {
                update.$inc = {
                    two_star_ratings: 1
                };
            }
            else if (ratings == 3 || ratings > 3 && ratings < 4) {
                update.$inc = {
                    three_star_ratings: 1
                };
            }
            else if (ratings == 4 || ratings > 4 && ratings < 5) {
                update.$inc = {
                    four_star_ratings: 1
                };
            }
            else if (ratings == 5) {
                update.$inc = {
                    five_star_ratings: 1
                };
            }
            let options = { new: true };
            yield DAO.find_and_update(Models.Products, query, update, options);
        }
    }
    catch (err) {
        throw err;
    }
});
class edit_review_module {
}
exports.edit_review_module = edit_review_module;
_b = edit_review_module;
edit_review_module.edit_review = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, title, description, ratings, images } = req.body;
        let { _id: user_id } = req.user_data;
        let retrive_ratings = yield _b.retrive_old_ratings(_id);
        if (retrive_ratings.length > 0) {
            let { ratings: old_ratings } = retrive_ratings[0];
            let query = { _id: _id, user_id: user_id };
            let update = { updated_at: +new Date() };
            if (!!title) {
                update.title = title;
            }
            if (!!description) {
                update.description = description;
            }
            if (!!ratings) {
                update.ratings = ratings;
            }
            if (!!images) {
                update.images = images;
            }
            let options = { new: true };
            let response = yield DAO.find_and_update(Models.Reviews, query, update, options);
            let { product_id } = response;
            yield _b.update_ratings_in_product(product_id, ratings);
            yield _b.update_old_ratings_in_product(product_id, old_ratings);
            return response;
        }
    }
    catch (err) {
        throw err;
    }
});
edit_review_module.retrive_old_ratings = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: _id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let review = yield DAO.get_data(Models.Reviews, query, projection, options);
        return review;
    }
    catch (err) {
        throw err;
    }
});
edit_review_module.retrive_product_info = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let retrive_product = yield DAO.get_data(Models.Products, query, projection, options);
        return retrive_product;
    }
    catch (err) {
        throw err;
    }
});
edit_review_module.cal_total_ratings = (product_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { product_id: product_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let reviews = yield DAO.get_data(Models.Reviews, query, projection, options);
        let total_ratings = 0;
        if (reviews.length) {
            for (let i = 0; i < reviews.length; i++) {
                total_ratings += reviews[i].ratings;
            }
        }
        return total_ratings;
    }
    catch (err) {
        throw err;
    }
});
edit_review_module.update_ratings_in_product = (product_id, ratings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let product_info = yield _b.retrive_product_info(product_id);
        let total_ratings = yield _b.cal_total_ratings(product_id);
        if (product_info.length > 0) {
            let { total_reviews } = product_info[0];
            let average_ratings = Number(total_ratings) / Number(total_reviews);
            let fixed_ratings = Number(total_ratings.toFixed(1));
            let fixed_avg_ratings = Number(average_ratings.toFixed(1));
            let query = { _id: product_id };
            let update = {
                total_ratings: fixed_ratings,
                average_rating: fixed_avg_ratings
            };
            if (ratings == 1 || ratings > 1 && ratings < 2) {
                update.$inc = {
                    one_star_ratings: 1
                };
            }
            if (ratings == 2 || ratings > 2 && ratings < 3) {
                update.$inc = {
                    two_star_ratings: 1
                };
            }
            if (ratings == 3 || ratings > 3 && ratings < 4) {
                update.$inc = {
                    three_star_ratings: 1
                };
            }
            if (ratings == 4 || ratings > 4 && ratings < 5) {
                update.$inc = {
                    four_star_ratings: 1
                };
            }
            if (ratings == 5) {
                update.$inc = {
                    five_star_ratings: 1
                };
            }
            let options = { new: true };
            yield DAO.find_and_update(Models.Products, query, update, options);
        }
    }
    catch (err) {
        throw err;
    }
});
edit_review_module.update_old_ratings_in_product = (product_id, old_ratings) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let query = { _id: product_id };
        let update = {};
        if (old_ratings == 1 || old_ratings > 1 && old_ratings < 2) {
            update.$inc = {
                one_star_ratings: -1
            };
        }
        if (old_ratings == 2 || old_ratings > 2 && old_ratings < 3) {
            update.$inc = {
                two_star_ratings: -1
            };
        }
        if (old_ratings == 3 || old_ratings > 3 && old_ratings < 4) {
            update.$inc = {
                three_star_ratings: -1
            };
        }
        if (old_ratings == 4 || old_ratings > 4 && old_ratings < 5) {
            update.$inc = {
                four_star_ratings: -1
            };
        }
        if (old_ratings == 5) {
            update.$inc = {
                five_star_ratings: -1
            };
        }
        let options = { new: true };
        yield DAO.find_and_update(Models.Products, query, update, options);
    }
    catch (err) {
        throw err;
    }
});
class list_review_module {
}
exports.list_review_module = list_review_module;
_c = list_review_module;
list_review_module.list_reviews = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, product_id, pagination, limit } = req.query;
        let query = {};
        if (!!_id) {
            query._id = _id;
        }
        if (!!product_id) {
            let product = yield DAO.get_data(Models.Products, { _id: product_id }, {}, { lean: true });
            let { parent_id } = product[0];
            query.product_id = product_id;
            if (!!parent_id) {
                query.product_id = parent_id;
            }
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let populate = [
            {
                path: 'product_id',
                select: 'name images discount_price average_rating'
            }
        ];
        let reviews = yield DAO.populate_data(Models.Reviews, query, projection, options, populate);
        let total_count = yield DAO.count_data(Models.Reviews, query);
        return {
            total_count: total_count,
            data: reviews
        };
    }
    catch (err) {
        throw err;
    }
});
list_review_module.list_my_reviews = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id, product_id, pagination, limit } = req.query;
        let { _id: user_id } = req.user_data;
        let query = { user_id: user_id };
        if (!!_id) {
            query._id = _id;
        }
        if (!!product_id) {
            query.product_id = product_id;
        }
        let projection = { __v: 0 };
        let options = yield index_1.helpers.set_options(pagination, limit);
        let populate = [
            {
                path: 'product_id',
                select: 'name images discount_price average_rating'
            }
        ];
        let reviews = yield DAO.populate_data(Models.Reviews, query, projection, options, populate);
        let total_count = yield DAO.count_data(Models.Reviews, query);
        return {
            total_count: total_count,
            data: reviews
        };
    }
    catch (err) {
        throw err;
    }
});
list_review_module.my_review_details = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { _id } = req.params;
        let { _id: user_id } = req.user_data;
        let query = { _id: _id, user_id: user_id };
        let projection = { __v: 0 };
        let options = { lean: true };
        let populate = [
            {
                path: 'product_id',
                select: 'name images discount_price average_rating'
            }
        ];
        let reviews = yield DAO.populate_data(Models.Reviews, query, projection, options, populate);
        if (reviews.length) {
            return reviews[0];
        }
        else {
            throw yield (0, index_1.handle_custom_error)("INVALID_OBJECT_ID", "ENGLISH");
        }
    }
    catch (err) {
        throw err;
    }
});
