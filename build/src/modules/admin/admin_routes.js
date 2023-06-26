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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const admin_controller = __importStar(require("./admin_controller"));
const authenticator_1 = __importDefault(require("../../middlewares/authenticator"));
const router = express_1.default.Router();
// bsics
router.post("/login", admin_controller.login);
router.get("/access_token_login", authenticator_1.default, admin_controller.access_token_login);
router.get("/profile", authenticator_1.default, admin_controller.view_profile);
router.put("/profile", authenticator_1.default, admin_controller.edit_profile);
router.put("/change_password", authenticator_1.default, admin_controller.change_password);
router.put("/logout", authenticator_1.default, admin_controller.logout);
router.get("/dashboard", authenticator_1.default, admin_controller.dashboard);
router.get("/graph/user", authenticator_1.default, admin_controller.user_graph);
router.get("/graph/seller", authenticator_1.default, admin_controller.seller_graph);
router.get("/graph/product", authenticator_1.default, admin_controller.product_graph);
router.get("/graph/sales", authenticator_1.default, admin_controller.sales_graph);
// staff_members
router.post("/staff_members/add", authenticator_1.default, admin_controller.add_staff_members);
router.put("/staff_members/edit", authenticator_1.default, admin_controller.edit_staff_members);
router.get("/staff_members/listing", authenticator_1.default, admin_controller.list_staff_members);
router.get("/staff_members/details", authenticator_1.default, admin_controller.staff_members_details);
router.put("/staff_members/block_delete", authenticator_1.default, admin_controller.mamage_staff_members);
// category 
router.post("/category", authenticator_1.default, controller_1.default.add_a_category);
router.put("/category", authenticator_1.default, controller_1.default.edit_a_category);
router.get("/category", authenticator_1.default, controller_1.default.list_categories);
router.get("/category/:_id", authenticator_1.default, controller_1.default.get_category);
// subcategory
router.post("/subcategory", authenticator_1.default, controller_1.default.add_a_subcategory);
router.put("/subcategory", authenticator_1.default, controller_1.default.edit_a_subcategory);
router.get("/subcategory", authenticator_1.default, controller_1.default.list_subcategory);
router.get("/subcategory/:_id", authenticator_1.default, controller_1.default.get_subcategory);
// sub_subcategories
router.post("/sub_subcategory", authenticator_1.default, controller_1.default.add_a_sub_subcategory);
router.put("/sub_subcategory", authenticator_1.default, controller_1.default.edit_a_sub_subcategory);
router.get("/sub_subcategory", authenticator_1.default, controller_1.default.list_sub_subcategory);
router.get("/sub_subcategory/:_id", authenticator_1.default, controller_1.default.get_sub_subcategory);
// brand
router.post("/brand", authenticator_1.default, controller_1.default.add_a_brand);
router.put("/brand", authenticator_1.default, controller_1.default.edit_a_brand);
router.get("/brand", authenticator_1.default, controller_1.default.list_brands);
router.get("/brand/:_id", authenticator_1.default, controller_1.default.get_brands);
// banners
// router.post("/banners", authenticator, admin_controller.add_banners)
// content
router.post("/content/add_edit", authenticator_1.default, admin_controller.add_edit_content);
router.get("/content/listing", authenticator_1.default, admin_controller.list_content);
router.get("/content/:_id", authenticator_1.default, admin_controller.content_detail);
// faqs
router.post("/faqs", authenticator_1.default, admin_controller.add_edit_faqs);
router.get("/faqs", authenticator_1.default, admin_controller.list_faqs);
router.delete("/faqs/delete/:_id", authenticator_1.default, admin_controller.delete_faqs);
// users
router.get("/users/listing", authenticator_1.default, admin_controller.list_users);
router.get("/users/details", authenticator_1.default, admin_controller.list_user_details);
router.put("/users/manage_users", authenticator_1.default, admin_controller.manage_users);
router.post("/users/login_as_user", authenticator_1.default, admin_controller.login_as_user);
// router.get("/users/export", authenticator, admin_controller.export_csv_users)
router.get("/users/orders", authenticator_1.default, controller_1.default.user_orders);
router.delete("/users/:_id", authenticator_1.default, admin_controller.delete_a_user);
// sellers
router.post("/seller/login_as_seller", authenticator_1.default, admin_controller.login_as_seller);
// shippo
router.post("/shippo/parcel", authenticator_1.default, admin_controller.add_a_parcel);
router.get("/shippo/parcel", authenticator_1.default, admin_controller.retrive_parcels);
router.delete("/shippo/parcel/:_id", authenticator_1.default, admin_controller.delete_a_parcel);
// fee module
router.post("/fees", authenticator_1.default, controller_1.default.add_fees);
router.put("/fees", authenticator_1.default, controller_1.default.edit_fees);
router.get("/fees", authenticator_1.default, controller_1.default.list_fees);
// contact_us
router.get("/contact_us/listing", authenticator_1.default, admin_controller.list_contact_us);
router.put("/contact_us/resolve_delete", authenticator_1.default, admin_controller.manage_contact_us);
// notification backup-database
router.post("/notification/broadcast", authenticator_1.default, admin_controller.send_notification);
router.post("/backup-database", admin_controller.backup_db);
router.get("/notifications", authenticator_1.default, admin_controller.get_notifications);
router.put("/notifications", authenticator_1.default, admin_controller.marked_all_read_notifications);
router.put("/notifications/clear", authenticator_1.default, admin_controller.clear_all_notifications);
router.put("/notifications/read/:_id", authenticator_1.default, admin_controller.read_notification);
router.get("/list_users_sellers", authenticator_1.default, admin_controller.list_users_sellers);
router.post("/main-keys", authenticator_1.default, admin_controller.mainKeys);
router.get("/main-keys", authenticator_1.default, admin_controller.getMainKeys);
router.post("/main-keys", authenticator_1.default, admin_controller.mainKeys);
router.post("/addmainkeys", admin_controller.add_main_keys);
router.post("/key-values", authenticator_1.default, admin_controller.keyValues);
router.patch("/key-values/:_id", authenticator_1.default, admin_controller.editKeyValue);
router.get("/main-keys/:_id", authenticator_1.default, admin_controller.getAllKeys);
router.post("/addkeys", admin_controller.add_keys);
// router.get("/keys",authenticator, admin_controller.getAllKeys)
exports.default = router;
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
//seller
// router.post("/seller/create", authenticator, admin_controller.seller_signup)
// router.get("/sellers", authenticator, admin_controller.seller_listing)
// router.get("/seller_details", authenticator, admin_controller.seller_details)
// router.put("/seller/manage_sellers", authenticator, admin_controller.manage_sellers)
// // router.get("/seller/export", authenticator, admin_controller.export_csv_seller)
// router.delete("/seller/:_id", authenticator, admin_controller.delete_a_seller)
// router.get("/seller/orders", authenticator, admin_controller.delete_a_seller);
// products
// router.get("/products", authenticator, admin_controller.list_products)
// router.get("/product_details", authenticator, controller.product_details)
// router.get("/products/variants", authenticator, admin_controller.list_product_variants)
// router.get("/product_faqs", authenticator, admin_controller.list_product_faqs)
// router.get("/products/export", authenticator, admin_controller.export_csv_products)
// coupons
// router.post("/coupon", authenticator, controller.add_a_coupon)
// router.put("/coupon", authenticator, controller.edit_a_coupon)
// router.get("/coupon", authenticator, controller.list_coupons)
// router.get("/coupon/:_id", authenticator, controller.list_coupon_details)
// router.delete("/coupon/:_id", authenticator, controller.delete_a_coupon)
// router.put("/homepage/coupon/:_id", authenticator, controller.set_homepage_coupon);
// order module
// router.get("/orders", authenticator, controller.list_orders)
// router.put("/orders/cancel", authenticator, controller.cancel_order)
// router.get("/orders/:_id", authenticator, controller.order_details)
// router.get("/order/invoice", authenticator, controller.invoice_data);
// router.get("/order/detail/:_id", authenticator, controller.ordered_products_detail); 
//rating & reviews
// router.get("/order/reviews", authenticator, controller.list_orders_reviews)
