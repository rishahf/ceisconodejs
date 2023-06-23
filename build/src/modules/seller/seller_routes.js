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
const seller_controller = __importStar(require("./seller_controller"));
const authenticator_1 = __importDefault(require("../../middlewares/authenticator"));
const router = express_1.default.Router();
// signup profile
// router.post("/signup", seller_controller.seller_signup);
// router.post("/login", seller_controller.login);
// router.post("/email/verification", authenticator, seller_controller.email_verification)
// router.post("/resend_otp", seller_controller.resend_email_otp);
// router.get("/profile", authenticator, seller_controller.view_my_profile);
// router.put("/edit_profile", authenticator, seller_controller.edit_profile);
// router.put("/logout", authenticator, seller_controller.logout);
// router.put("/change_password",authenticator,seller_controller.change_password);
// router.post("/forgot_password", seller_controller.forgot_password);
// router.post("/forgot_password/resend_otp", seller_controller.resend_fp_otp);
// router.post("/forgot_password/verify_otp", seller_controller.verify_fp_otp);
// router.post("/forgot_password/set_password",seller_controller.set_new_password);
// dashboard graph
router.get("/dashboard", authenticator_1.default, controller_1.default.dashboard);
router.get("/graph/product", authenticator_1.default, controller_1.default.product_graph);
router.get("/graph/sales", authenticator_1.default, controller_1.default.sales_graph);
// shippo parcel
router.get("/shippo/parcel", seller_controller.retrive_parcels);
// product add edit list
router.post("/products", authenticator_1.default, controller_1.default.add_a_product);
router.put("/products", authenticator_1.default, controller_1.default.edit_a_product);
router.get("/products", authenticator_1.default, controller_1.default.list_product);
// 1 product details
router.post("/products/details", authenticator_1.default, controller_1.default.add_product_details);
router.put("/products/details", authenticator_1.default, controller_1.default.edit_product_details);
router.get("/products/details", authenticator_1.default, controller_1.default.list_p_details);
router.delete("/products/details/:_id", authenticator_1.default, controller_1.default.delete_product_details);
// 2 product services
router.post("/products/services", authenticator_1.default, controller_1.default.add_product_services);
router.put("/products/services", authenticator_1.default, controller_1.default.edit_product_services);
router.get("/products/services", authenticator_1.default, controller_1.default.list_product_services);
router.delete("/products/services/:_id", authenticator_1.default, controller_1.default.delete_product_services);
// 3 product highlights
router.post("/products/highlights", authenticator_1.default, controller_1.default.add_product_highlights);
router.put("/products/highlights", authenticator_1.default, controller_1.default.edit_product_highlights);
router.get("/products/highlights", authenticator_1.default, controller_1.default.list_product_highlights);
router.delete("/products/highlights/:_id", authenticator_1.default, controller_1.default.delete_product_highlights);
// 4 product variations
router.post("/products/variations", authenticator_1.default, controller_1.default.add_pv);
router.put("/products/variations", authenticator_1.default, controller_1.default.edit_pv);
router.get("/products/variations", authenticator_1.default, controller_1.default.list_pv);
router.delete("/products/variations/:_id", authenticator_1.default, controller_1.default.delete_pv);
router.get("/products/to/add", authenticator_1.default, controller_1.default.list_product_variants_to_add);
// 5 product faq
router.post("/products/faqs", authenticator_1.default, controller_1.default.add_product_faq);
router.put("/products/faqs", authenticator_1.default, controller_1.default.edit_product_faq);
router.get("/products/faqs", authenticator_1.default, controller_1.default.list_product_faq);
router.delete("/products/faqs/:_id", authenticator_1.default, controller_1.default.delete_product_faq);
// 6 delivery addresses
router.post('/products/delivery/location', authenticator_1.default, controller_1.default.add_delivery_location);
router.put('/products/delivery/location', authenticator_1.default, controller_1.default.edit_delivery_location);
router.get('/products/delivery/location', authenticator_1.default, controller_1.default.list_delivery_location);
router.delete("/products/delivery/location/:_id", authenticator_1.default, controller_1.default.delete_delivery_location);
// 7 coupons
router.post("/coupon", authenticator_1.default, controller_1.default.add_a_coupon);
router.put('/coupon', authenticator_1.default, controller_1.default.edit_a_coupon);
router.get('/coupon', authenticator_1.default, controller_1.default.list_coupons);
router.get("/coupon/:_id", authenticator_1.default, controller_1.default.list_coupon_details);
router.delete("/coupon/:_id", authenticator_1.default, controller_1.default.delete_a_coupon);
//product detail
router.get('/products/:_id', authenticator_1.default, controller_1.default.list_product_details);
// order module
router.get("/orders", authenticator_1.default, controller_1.default.list_orders);
router.put("/orders/cancel", authenticator_1.default, controller_1.default.cancel_order);
router.get("/orders/:_id", authenticator_1.default, controller_1.default.order_details);
router.put("/orders", authenticator_1.default, controller_1.default.order_status_change);
router.put("/order/cancel/request", authenticator_1.default, controller_1.default.approve_cancel_request);
router.get("/orders/invoice/:_id", authenticator_1.default, controller_1.default.order_invoice_details);
//pending api
router.get("/order/reviews", authenticator_1.default, controller_1.default.list_orders_reviews);
router.get("/transactions", authenticator_1.default, controller_1.default.list_orders_transactions);
router.get("/notifications", authenticator_1.default, controller_1.default.list_notifications);
router.put("/notifications", authenticator_1.default, controller_1.default.mark_read_notifications);
router.put("/notifications/clear", authenticator_1.default, controller_1.default.clear_notifications);
router.put("/notification/read/:_id", authenticator_1.default, controller_1.default.read_notification);
exports.default = router;
// router.get("/shippo/parcel", seller_controller.retrive_parcels)
// router.put("/products/manage", authenticator, seller_controller.manage_products)
// router.get("/shippo_address_validate", authenticator, seller_controller.shippo_address)
// router.get("/orders", authenticator, seller_controller.list_user_orders)
// router.get("/orders/detail", authenticator, seller_controller.list_user_order_detail)
// router.put("/orders", authenticator, seller_controller.cancel_order)
// router.put("/order/confirm", authenticator, seller_controller.confirm_order)
// router.put("/add_edit_product_services", authenticator, seller_controller.add_edit_product_services)
// router.get("/add_edit_product_services", authenticator, seller_controller.get_Services)
// router.put("/add_edit_product_highlights", authenticator, seller_controller.add_edit_product_highlights)
// router.get("/add_edit_product_highlights", authenticator, seller_controller.get_highlights)
// router.put("/add_edit_productdetails", authenticator, seller_controller.add_edit_productDetail)
