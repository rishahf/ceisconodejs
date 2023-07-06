"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const authenticator_1 = __importDefault(require("../../middlewares/authenticator"));
const router = express_1.default.Router();
// manage home page sections
router.put('/admin/sections', authenticator_1.default, controller_1.default.manage_sections);
// banner module
router.post('/admin/banner', authenticator_1.default, controller_1.default.add_a_banner);
router.put('/admin/banner', authenticator_1.default, controller_1.default.update_a_banner);
router.get('/admin/banner', authenticator_1.default, controller_1.default.list_banners);
router.get('/admin/banner/:_id', authenticator_1.default, controller_1.default.banner_details);
router.put('/admin/banner/enable-disable', authenticator_1.default, controller_1.default.enable_disable_a_banner);
router.put('/admin/banners/enable-disable', authenticator_1.default, controller_1.default.enable_disable_banners);
router.delete('/admin/banner/:_id', authenticator_1.default, controller_1.default.delete_a_banner);
router.get('/user/banner', controller_1.default.user_list_banners);
// deal of the day module
router.post('/admin/deal_of_the_day', authenticator_1.default, controller_1.default.add_deal_of_the_day);
router.put('/admin/deal_of_the_day', authenticator_1.default, controller_1.default.update_deal_of_the_day);
router.get('/admin/deal_of_the_day', controller_1.default.list_deal_of_the_day);
router.get('/admin/deal_of_the_day/:_id', authenticator_1.default, controller_1.default.detail_deal_of_the_day);
router.put('/admin/deals_of_the_day/enable-disable', authenticator_1.default, controller_1.default.enable_disable_deal_of_the_day);
router.delete('/admin/deal_of_the_day/:_id', authenticator_1.default, controller_1.default.delete_a_deal_of_the_day);
router.get('/user/deal_of_the_day', controller_1.default.user_list_deal_of_the_day);
//timer-api
router.post("/admin/deals_day/timer", authenticator_1.default, controller_1.default.add_deals_timer);
router.put("/admin/deals_day/timer", authenticator_1.default, controller_1.default.update_deals_timer);
router.get("/admin/deals_day/timer/:_id", controller_1.default.get_deals_timer);
router.get("/admin/deals_day/timer", authenticator_1.default, controller_1.default.get_all_deals_timer);
router.get("/user/deals_day/timer", controller_1.default.get_users_deals_timer);
// top deals module
router.post('/admin/top_deals', authenticator_1.default, controller_1.default.add_top_deal);
router.put('/admin/top_deals', authenticator_1.default, controller_1.default.update_top_deal);
router.get('/admin/top_deals', authenticator_1.default, controller_1.default.list_top_deals);
router.get('/admin/top_deals/:_id', authenticator_1.default, controller_1.default.detail_top_deal);
router.put('/admin/top_deals/enable-disable', authenticator_1.default, controller_1.default.enable_disable_top_deals);
router.delete('/admin/top_deals/:_id', authenticator_1.default, controller_1.default.delete_top_deal);
router.get('/user/top_deals', controller_1.default.user_list_top_deals);
// fashion deals module
router.post('/admin/fashion_deals', authenticator_1.default, controller_1.default.add_fashion_deals);
router.put('/admin/fashion_deals', authenticator_1.default, controller_1.default.update_fashion_deals);
router.get('/admin/fashion_deals', authenticator_1.default, controller_1.default.list_fashion_deals);
router.put('/admin/fashion_deals/enable-disable', authenticator_1.default, controller_1.default.enable_disable_fashion_deals);
router.get('/admin/fashion_deals/:_id', authenticator_1.default, controller_1.default.detail_fashion_deals);
router.delete('/admin/fashion_deals/:_id', authenticator_1.default, controller_1.default.delete_fashion_deals);
router.get('/user/fashion_deals', controller_1.default.user_list_fashion_deals);
// style for module
router.post('/admin/style_for', authenticator_1.default, controller_1.default.add_style_for);
router.put('/admin/style_for', authenticator_1.default, controller_1.default.update_style_for);
router.get('/admin/style_for', authenticator_1.default, controller_1.default.list_style_for);
router.delete('/admin/style_for/:_id', authenticator_1.default, controller_1.default.delete_style_for);
router.get('/user/style_for', controller_1.default.user_list_style_for);
// style_for_categories
router.post('/admin/style_for_categories', authenticator_1.default, controller_1.default.add_sfc);
router.put('/admin/style_for_categories', authenticator_1.default, controller_1.default.update_sfc);
router.get('/admin/style_for_categories', authenticator_1.default, controller_1.default.list_sfc);
router.put("/admin/style_for_categories/enable-disable", authenticator_1.default, controller_1.default.enable_disable_sfc);
router.delete('/admin/style_for_categories/:_id', authenticator_1.default, controller_1.default.delete_sfc);
router.get('/user/style_for_categories', controller_1.default.user_list_sfc);
// featured categories
router.post('/admin/featured_categories', authenticator_1.default, controller_1.default.add_fc);
router.put('/admin/featured_categories', authenticator_1.default, controller_1.default.update_fc);
router.get('/admin/featured_categories', authenticator_1.default, controller_1.default.list_fc);
router.get('/admin/featured_categories/:_id', authenticator_1.default, controller_1.default.detail_fc);
router.put('/admin/featured_categories/enable-disable', authenticator_1.default, controller_1.default.enable_disable_fc);
router.delete('/admin/featured_categories/:_id', authenticator_1.default, controller_1.default.delete_fc);
router.get('/user/featured_categories', controller_1.default.user_list_fc);
// shop with us
router.post('/admin/shop_with_us', authenticator_1.default, controller_1.default.add_shop_with_us);
router.put('/admin/shop_with_us', authenticator_1.default, controller_1.default.update_shop_with_us);
router.get('/admin/shop_with_us', authenticator_1.default, controller_1.default.list_shop_with_us);
router.put('/admin/shop_with_us/enable-disable', authenticator_1.default, controller_1.default.enable_disable_shop_with_us);
router.get('/admin/shop_with_us/:_id', authenticator_1.default, controller_1.default.detail_shop_with_us);
router.delete('/admin/shop_with_us/:_id', authenticator_1.default, controller_1.default.delete_shop_with_us);
router.get('/user/shop_with_us', controller_1.default.user_list_shop_with_us);
// best on ecom
router.post('/admin/best_on_ecom', authenticator_1.default, controller_1.default.add_best_on_ecom);
router.put('/admin/best_on_ecom', authenticator_1.default, controller_1.default.update_best_on_ecom);
router.put('/admin/best_on_ecom/enable-disable', authenticator_1.default, controller_1.default.enable_dis_best_on_ecom);
router.get('/admin/best_on_ecom', authenticator_1.default, controller_1.default.list_best_on_ecom);
router.get('/admin/best_on_ecom/:_id', authenticator_1.default, controller_1.default.detail_best_on_ecom);
router.delete('/admin/best_on_ecom/:_id', authenticator_1.default, controller_1.default.delete_best_on_ecom);
router.get('/user/best_on_ecom', controller_1.default.user_list_best_on_ecom);
router.get("/coupon", controller_1.default.get_homepage_coupon);
exports.default = router;
