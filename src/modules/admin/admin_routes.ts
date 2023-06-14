import express from 'express';
import controller from './controller';
import * as admin_controller from './admin_controller';
import authenticator from '../../middlewares/authenticator';
const router = express.Router();

// bsics
router.post("/login", admin_controller.login)
router.get("/access_token_login", authenticator, admin_controller.access_token_login)
router.get("/profile", authenticator, admin_controller.view_profile)
router.put("/profile", authenticator, admin_controller.edit_profile)
router.put("/change_password", authenticator, admin_controller.change_password)
router.put("/logout", authenticator, admin_controller.logout)
router.get("/dashboard", authenticator, admin_controller.dashboard)
router.get("/graph/user", authenticator, admin_controller.user_graph)
router.get("/graph/seller", authenticator, admin_controller.seller_graph)
router.get("/graph/product", authenticator, admin_controller.product_graph)
router.get("/graph/sales", authenticator, admin_controller.sales_graph)

// staff_members
router.post("/staff_members/add", authenticator, admin_controller.add_staff_members)
router.put("/staff_members/edit", authenticator, admin_controller.edit_staff_members)
router.get("/staff_members/listing", authenticator, admin_controller.list_staff_members)
router.get("/staff_members/details", authenticator, admin_controller.staff_members_details)
router.put("/staff_members/block_delete", authenticator, admin_controller.mamage_staff_members)

// category 
router.post("/category", authenticator, controller.add_a_category)
router.put("/category", authenticator, controller.edit_a_category)
router.get("/category", authenticator, controller.list_categories)
router.get("/category/:_id", authenticator, controller.get_category);


// subcategory
router.post("/subcategory", authenticator, controller.add_a_subcategory)
router.put("/subcategory", authenticator, controller.edit_a_subcategory)
router.get("/subcategory", authenticator, controller.list_subcategory)
router.get("/subcategory/:_id", authenticator, controller.get_subcategory);

// sub_subcategories
router.post("/sub_subcategory", authenticator, controller.add_a_sub_subcategory)
router.put("/sub_subcategory", authenticator, controller.edit_a_sub_subcategory)
router.get("/sub_subcategory", authenticator, controller.list_sub_subcategory)
router.get("/sub_subcategory/:_id", authenticator, controller.get_sub_subcategory);

// brand
router.post("/brand", authenticator, controller.add_a_brand)
router.put("/brand", authenticator, controller.edit_a_brand)
router.get("/brand", authenticator, controller.list_brands)
router.get("/brand/:_id", authenticator, controller.get_brands);

// banners
// router.post("/banners", authenticator, admin_controller.add_banners)

// content
router.post("/content/add_edit", authenticator, admin_controller.add_edit_content)
router.get("/content/listing", authenticator, admin_controller.list_content)
router.get("/content/:_id", authenticator,admin_controller.content_detail)

// faqs
router.post("/faqs", authenticator, admin_controller.add_edit_faqs)
router.get("/faqs", authenticator, admin_controller.list_faqs)
router.delete("/faqs/delete/:_id", authenticator, admin_controller.delete_faqs)

// users
router.get("/users/listing", authenticator, admin_controller.list_users)
router.get("/users/details", authenticator, admin_controller.list_user_details)
router.put("/users/manage_users", authenticator, admin_controller.manage_users)
router.post("/users/login_as_user", authenticator, admin_controller.login_as_user)
// router.get("/users/export", authenticator, admin_controller.export_csv_users)
router.get("/users/orders", authenticator, controller.user_orders)

router.delete("/users/:_id", authenticator, admin_controller.delete_a_user)

// sellers
router.post("/seller/create", authenticator, admin_controller.seller_signup)
router.get("/sellers", authenticator, admin_controller.seller_listing)
router.get("/seller_details", authenticator, admin_controller.seller_details)
router.put("/seller/manage_sellers", authenticator, admin_controller.manage_sellers)
router.post("/seller/login_as_seller", authenticator, admin_controller.login_as_seller)
// router.get("/seller/export", authenticator, admin_controller.export_csv_seller)
router.delete("/seller/:_id", authenticator, admin_controller.delete_a_seller)

router.get("/seller/orders", authenticator, admin_controller.delete_a_seller);

// products
router.get("/products", authenticator, admin_controller.list_products)
router.get("/product_details", authenticator, controller.product_details)
router.get("/products/variants", authenticator, admin_controller.list_product_variants)
router.get("/product_faqs", authenticator, admin_controller.list_product_faqs)
// router.get("/products/export", authenticator, admin_controller.export_csv_products)

// coupons
router.post("/coupon", authenticator, controller.add_a_coupon)
router.put("/coupon", authenticator, controller.edit_a_coupon)
router.get("/coupon", authenticator, controller.list_coupons)
router.get("/coupon/:_id", authenticator, controller.list_coupon_details)
router.delete("/coupon/:_id", authenticator, controller.delete_a_coupon)
router.put("/homepage/coupon/:_id", authenticator, controller.set_homepage_coupon);

// shippo
router.post("/shippo/parcel", authenticator, admin_controller.add_a_parcel)
router.get("/shippo/parcel", authenticator, admin_controller.retrive_parcels)
router.delete("/shippo/parcel/:_id", authenticator, admin_controller.delete_a_parcel)

// fee module
router.post("/fees", authenticator, controller.add_fees)
router.put("/fees", authenticator, controller.edit_fees)
router.get("/fees", authenticator, controller.list_fees)

// order module
router.get("/orders", authenticator, controller.list_orders)
router.put("/orders/cancel", authenticator, controller.cancel_order)
router.get("/orders/:_id", authenticator, controller.order_details)


//rating & reviews
router.get("/order/reviews", authenticator, controller.list_orders_reviews)
// contact_us
router.get("/contact_us/listing", authenticator, admin_controller.list_contact_us)
router.put("/contact_us/resolve_delete", authenticator, admin_controller.manage_contact_us)

// notification backup-database
router.post("/notification/broadcast", authenticator, admin_controller.send_notification)
router.post("/backup-database", admin_controller.backup_db)

router.get("/order/invoice", authenticator, controller.invoice_data);

router.get("/notifications", authenticator, admin_controller.get_notifications);
router.put("/notifications", authenticator, admin_controller.marked_all_read_notifications);
router.put("/notifications/clear", authenticator, admin_controller.clear_all_notifications);
router.put("/notifications/read/:_id", authenticator, admin_controller.read_notification);

router.get("/order/detail/:_id", authenticator, controller.ordered_products_detail);

router.get("/list_users_sellers", authenticator, admin_controller.list_users_sellers);

router.post("/main-keys", authenticator, admin_controller.mainKeys)
router.get("/main-keys", authenticator, admin_controller.getMainKeys)

router.post("/key-values", authenticator, admin_controller.keyValues)
router.patch("/key-values/:_id", authenticator, admin_controller.editKeyValue)
router.get("/main-keys/:_id", authenticator, admin_controller.getAllKeys)

// router.get("/keys",authenticator, admin_controller.getAllKeys)

export default router;


// router.post("/coupons", authenticator, admin_controller.add_edit_coupons)
// router.get("/coupons", authenticator, admin_controller.get_coupons)
// router.delete("/coupons/delete/:_id", authenticator, admin_controller.delete_coupons)

// router.post("/deals_of_the_day", authenticator, admin_controller.add_deals)
// router.delete("/deals_of_the_day/delete/:_id", authenticator, admin_controller.delete_deals)

// router.post("/hot_deals", authenticator, admin_controller.add_hot_deals)
// router.delete("/hot_deals/delete/:_id", authenticator, admin_controller.delete_hotdeals)

// router.post("/fashion_deals", authenticator, admin_controller.add_fashion_deals)
// router.delete("/fashion_deals/delete/:_id", authenticator, admin_controller.delete_fashiondeals)

// router.get("/listing/deals_of_the_day", authenticator, admin_controller.list_deals_of_the_day)
// router.get("/deals_of_the_day/products", authenticator, admin_controller.listing_deals_of_the_day_products),

// router.get("/listing/hot_deals", authenticator, admin_controller.list_hot_deals)
// router.get("/hot_deals/products", authenticator, admin_controller.listing_hot_deals_products)

// router.get("/listing/fashion_deals", authenticator, admin_controller.list_fashion_deals)
// router.get("/fashion_deals/products", authenticator, admin_controller.listing_fashion_deals_products)


// router.post("/category", authenticator, admin_controller.add_category)
// router.post("/subcategory", authenticator, admin_controller.add_sub_category)
// router.post("/sub_subcategories", authenticator, admin_controller.add_sub_subcategories)
// router.post("/brand", authenticator, admin_controller.add_brands)

// router.post("/add_edit_language", admin_controller.add_edit_languagekeys),
// router.get("/list_language", admin_controller.list_languagekeys)


// res_messages
// router.post("/res_messages/add_edit", authenticator, admin_controller.add_edit_res_msgs)
// router.get("/res_messages/listing", authenticator, admin_controller.list_res_messages)
// router.delete("/res_messages/delete/:_id", authenticator, admin_controller.delete_res_messages)

// variables
// router.post("/variables/add_edit", authenticator, admin_controller.add_edit_variables)
// router.get("/variables/listing", authenticator, admin_controller.list_variables)

// email_templates
// router.post("/email_templates/add_edit", authenticator, admin_controller.add_edit_templates)
// router.get("/email_templates/listing", authenticator, admin_controller.list_templates)

// router.get("/orders", authenticator, admin_controller.list_orders)