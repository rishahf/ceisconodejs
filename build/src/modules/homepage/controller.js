"use strict";
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
const index_1 = require("../../middlewares/index");
const homepage_sections_1 = require("./homepage_sections");
const banners_1 = require("./banners");
const deals_of_the_day_1 = require("./deals_of_the_day");
const top_deals_1 = require("./top_deals");
const fashion_deals_1 = require("./fashion_deals");
const style_for_1 = require("./style_for");
const style_for_categories_1 = require("./style_for_categories");
const featured_categories_1 = require("./featured_categories");
const shop_with_us_1 = require("./shop_with_us");
const best_on_ecom_1 = require("./best_on_ecom");
class controller {
}
exports.default = controller;
_a = controller;
// manage home page sections
controller.manage_sections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield homepage_sections_1.section_module.update(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// banner module
controller.add_a_banner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield banners_1.admin_banner_module.add_a_banner(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.update_a_banner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield banners_1.admin_banner_module.update_a_banner(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.list_banners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield banners_1.admin_banner_module.list_banners(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            // total_count: response.total_count,
            // data: response.data
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.banner_details = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield banners_1.admin_banner_module.banner_details(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.delete_a_banner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield banners_1.admin_banner_module.delete_a_banner(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.enable_disable_a_banner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield banners_1.admin_banner_module.enable_disable_a_banner(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.enable_disable_banners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield banners_1.admin_banner_module.enable_disable_banners(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.user_list_banners = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield banners_1.user_banner_module.user_list_banners(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            // total_count: response.total_count,
            // data: response.data
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
//timer-api
controller.add_deals_timer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield deals_of_the_day_1.admin_dod_module.add_timer_of_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.update_deals_timer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield deals_of_the_day_1.admin_dod_module.update_timer_of_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.get_deals_timer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield deals_of_the_day_1.admin_dod_module.get_timer_of_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.get_users_deals_timer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield deals_of_the_day_1.admin_dod_module.get_users_timer_of_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// deal of the day module
controller.add_deal_of_the_day = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield deals_of_the_day_1.admin_dod_module.add_a_deal(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.update_deal_of_the_day = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield deals_of_the_day_1.admin_dod_module.update_a_deal(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.list_deal_of_the_day = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield deals_of_the_day_1.admin_dod_module.list_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.detail_deal_of_the_day = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield deals_of_the_day_1.admin_dod_module.detail_deal_of_the_day(req);
        // let message = "Success";
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.enable_disable_deal_of_the_day = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield deals_of_the_day_1.admin_dod_module.enable_disable_deals_day(req);
        // let message = "Success";
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.delete_a_deal_of_the_day = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield deals_of_the_day_1.admin_dod_module.delete_a_deal(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.user_list_deal_of_the_day = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("user-- list");
        let response = yield deals_of_the_day_1.user_dod_module.user_list_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// top_deals_module
controller.add_top_deal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield top_deals_1.admin_top_deals_module.add_top_deal(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.update_top_deal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield top_deals_1.admin_top_deals_module.update_top_deal(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.list_top_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield top_deals_1.admin_top_deals_module.list_top_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.enable_disable_top_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield top_deals_1.admin_top_deals_module.enable_disable_top_deals(req);
        res.send({
            success: true,
            message: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.delete_top_deal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield top_deals_1.admin_top_deals_module.delete_top_deal(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.detail_top_deal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield top_deals_1.admin_top_deals_module.detail_top_deals(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.user_list_top_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield top_deals_1.user_top_deals_module.user_list_top_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// fashion deals module
controller.add_fashion_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fashion_deals_1.admin_fashion_deals_module.add_fashion_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.update_fashion_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fashion_deals_1.admin_fashion_deals_module.update_fashion_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.list_fashion_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fashion_deals_1.admin_fashion_deals_module.list_fashion_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.enable_disable_fashion_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fashion_deals_1.admin_fashion_deals_module.en_dis_fashion_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.detail_fashion_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fashion_deals_1.admin_fashion_deals_module.detail_fashion_deals(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.delete_fashion_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fashion_deals_1.admin_fashion_deals_module.delete_fashion_deals(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.user_list_fashion_deals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield fashion_deals_1.user_fashion_deals_module.user_list_fashion_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// style_for_module
controller.add_style_for = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield style_for_1.admin_style_for_module.add_style_for(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.update_style_for = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield style_for_1.admin_style_for_module.update_style_for(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.list_style_for = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield style_for_1.admin_style_for_module.list_style_for(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.delete_style_for = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield style_for_1.admin_style_for_module.delete_style_for(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.user_list_style_for = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield style_for_1.user_style_for_module.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// style_for_categories
controller.add_sfc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield style_for_categories_1.admin_style_for_categories.add(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.update_sfc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield style_for_categories_1.admin_style_for_categories.update(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.list_sfc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield style_for_categories_1.admin_style_for_categories.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.enable_disable_sfc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield style_for_categories_1.admin_style_for_categories.en_dis_sfc(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.delete_sfc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield style_for_categories_1.admin_style_for_categories.delete(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.user_list_sfc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield style_for_categories_1.user_style_for_categories.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// featured categories
controller.add_fc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield featured_categories_1.admin_featured_categories.add(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.update_fc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield featured_categories_1.admin_featured_categories.update(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.list_fc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield featured_categories_1.admin_featured_categories.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.detail_fc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield featured_categories_1.admin_featured_categories.detail_fc(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.enable_disable_fc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield featured_categories_1.admin_featured_categories.enable_disable_fc(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.delete_fc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield featured_categories_1.admin_featured_categories.delete(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.user_list_fc = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield featured_categories_1.user_featured_categories.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// shop with us
controller.add_shop_with_us = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield shop_with_us_1.admin_shop_with_us.add(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.update_shop_with_us = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield shop_with_us_1.admin_shop_with_us.update(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.list_shop_with_us = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield shop_with_us_1.admin_shop_with_us.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.enable_disable_shop_with_us = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield shop_with_us_1.admin_shop_with_us.enable_disable(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.delete_shop_with_us = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield shop_with_us_1.admin_shop_with_us.delete(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.detail_shop_with_us = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield shop_with_us_1.admin_shop_with_us.detail_shop_with_us(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.user_list_shop_with_us = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield shop_with_us_1.user_shop_with_us.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
// best on ecom
controller.add_best_on_ecom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield best_on_ecom_1.admin_best_on_ecom.add(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.update_best_on_ecom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield best_on_ecom_1.admin_best_on_ecom.update(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.enable_dis_best_on_ecom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield best_on_ecom_1.admin_best_on_ecom.enable_disable(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.list_best_on_ecom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield best_on_ecom_1.admin_best_on_ecom.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
            // total_count: response.total_count,
            // data: response.data
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.detail_best_on_ecom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield best_on_ecom_1.admin_best_on_ecom.detail(req);
        let message = "Success";
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.delete_best_on_ecom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield best_on_ecom_1.admin_best_on_ecom.delete(req);
        res.send({
            success: true,
            message: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.user_list_best_on_ecom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield best_on_ecom_1.user_best_on_ecom.list(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            // total_count: response.total_count,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.get_all_deals_timer = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield deals_of_the_day_1.admin_dod_module.get_all_timer_of_deals(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
controller.get_homepage_coupon = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let response = yield best_on_ecom_1.user_best_on_ecom.homepageCoupon(req);
        let message = "Success";
        res.send({
            success: true,
            message: message,
            // total_count: response.total_count,
            data: response,
        });
    }
    catch (err) {
        (0, index_1.handle_catch)(res, err);
    }
});
