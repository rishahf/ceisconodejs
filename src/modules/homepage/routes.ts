import express from 'express'
import controller from './controller'
import authenticator from '../../middlewares/authenticator'
const router = express.Router()

// manage home page sections
router.put('/admin/sections', authenticator, controller.manage_sections)

// banner module
router.post('/admin/banner', authenticator, controller.add_a_banner)
router.put('/admin/banner', authenticator, controller.update_a_banner)
router.get('/admin/banner', authenticator, controller.list_banners)
router.get('/admin/banner/:_id', authenticator, controller.banner_details)
router.put('/admin/banner/enable-disable',authenticator,controller.enable_disable_a_banner)
router.put('/admin/banners/enable-disable',authenticator,controller.enable_disable_banners)
router.delete('/admin/banner/:_id', authenticator, controller.delete_a_banner)
router.get('/user/banner', controller.user_list_banners)

// deal of the day module
router.post('/admin/deal_of_the_day',authenticator,controller.add_deal_of_the_day)
router.put('/admin/deal_of_the_day',authenticator,controller.update_deal_of_the_day)
router.get('/admin/deal_of_the_day', controller.list_deal_of_the_day)
router.get('/admin/deal_of_the_day/:_id',authenticator,controller.detail_deal_of_the_day)
router.put('/admin/deals_of_the_day/enable-disable',authenticator,controller.enable_disable_deal_of_the_day)
router.delete('/admin/deal_of_the_day/:_id',authenticator,controller.delete_a_deal_of_the_day)
router.get('/user/deal_of_the_day', controller.user_list_deal_of_the_day)

//timer-api
router.post("/admin/deals_day/timer",authenticator, controller.add_deals_timer);
router.put("/admin/deals_day/timer", authenticator, controller.update_deals_timer);
router.get("/admin/deals_day/timer/:_id", controller.get_deals_timer);
router.get("/admin/deals_day/timer", authenticator,controller.get_all_deals_timer);
router.get("/user/deals_day/timer", controller.get_users_deals_timer);

// top deals module
router.post('/admin/top_deals', authenticator, controller.add_top_deal)
router.put('/admin/top_deals', authenticator, controller.update_top_deal)
router.get('/admin/top_deals', authenticator, controller.list_top_deals)
router.get('/admin/top_deals/:_id', authenticator, controller.detail_top_deal)
router.put('/admin/top_deals/enable-disable',authenticator,controller.enable_disable_top_deals)
router.delete('/admin/top_deals/:_id',authenticator,controller.delete_top_deal)
router.get('/user/top_deals', controller.user_list_top_deals)

// fashion deals module
router.post('/admin/fashion_deals', authenticator, controller.add_fashion_deals)
router.put('/admin/fashion_deals',authenticator,controller.update_fashion_deals)
router.get('/admin/fashion_deals', authenticator, controller.list_fashion_deals)
router.put('/admin/fashion_deals/enable-disable',authenticator,controller.enable_disable_fashion_deals)
router.get('/admin/fashion_deals/:_id',authenticator,controller.detail_fashion_deals)
router.delete('/admin/fashion_deals/:_id',authenticator,controller.delete_fashion_deals)
router.get('/user/fashion_deals', controller.user_list_fashion_deals)

// style for module
router.post('/admin/style_for', authenticator, controller.add_style_for)
router.put('/admin/style_for', authenticator, controller.update_style_for)
router.get('/admin/style_for', authenticator, controller.list_style_for)
router.delete('/admin/style_for/:_id',authenticator,controller.delete_style_for)
router.get('/user/style_for', controller.user_list_style_for)

// style_for_categories
router.post('/admin/style_for_categories', authenticator, controller.add_sfc)
router.put('/admin/style_for_categories', authenticator, controller.update_sfc)
router.get('/admin/style_for_categories', authenticator, controller.list_sfc)
router.put("/admin/style_for_categories/enable-disable", authenticator, controller.enable_disable_sfc);
router.delete('/admin/style_for_categories/:_id',authenticator,controller.delete_sfc)
router.get('/user/style_for_categories', controller.user_list_sfc)

// featured categories
router.post('/admin/featured_categories', authenticator, controller.add_fc)
router.put('/admin/featured_categories', authenticator, controller.update_fc)
router.get('/admin/featured_categories', authenticator, controller.list_fc)
router.get('/admin/featured_categories/:_id',authenticator,controller.detail_fc)
router.put('/admin/featured_categories/enable-disable',authenticator,controller.enable_disable_fc)
router.delete('/admin/featured_categories/:_id',authenticator,controller.delete_fc)
router.get('/user/featured_categories', controller.user_list_fc)

// shop with us
router.post('/admin/shop_with_us', authenticator, controller.add_shop_with_us)
router.put('/admin/shop_with_us', authenticator, controller.update_shop_with_us)
router.get('/admin/shop_with_us', authenticator, controller.list_shop_with_us)
router.put('/admin/shop_with_us/enable-disable', authenticator, controller.enable_disable_shop_with_us)
router.get('/admin/shop_with_us/:_id',authenticator,controller.detail_shop_with_us)
router.delete('/admin/shop_with_us/:_id',authenticator,controller.delete_shop_with_us)
router.get('/user/shop_with_us', controller.user_list_shop_with_us)

// best on ecom
router.post('/admin/best_on_ecom', authenticator, controller.add_best_on_ecom)
router.put('/admin/best_on_ecom', authenticator, controller.update_best_on_ecom)
router.put('/admin/best_on_ecom/enable-disable', authenticator, controller.enable_dis_best_on_ecom)
router.get('/admin/best_on_ecom', authenticator, controller.list_best_on_ecom)
router.get('/admin/best_on_ecom/:_id', authenticator, controller.detail_best_on_ecom)
router.delete('/admin/best_on_ecom/:_id',authenticator,controller.delete_best_on_ecom)
router.get('/user/best_on_ecom', controller.user_list_best_on_ecom)

router.get("/coupon", controller.get_homepage_coupon);

export default router
