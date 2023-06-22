import express from "express";
import controller from "./controller";
import * as seller_controller from "./seller_controller";
import authenticator from "../../middlewares/authenticator";
const router = express.Router();

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
router.get("/dashboard", authenticator, controller.dashboard);
router.get("/graph/product", authenticator, controller.product_graph);
router.get("/graph/sales", authenticator, controller.sales_graph);

// shippo parcel
router.get("/shippo/parcel", seller_controller.retrive_parcels);

// product add edit list
router.post("/products", authenticator, controller.add_a_product);
router.put("/products", authenticator, controller.edit_a_product);
router.get("/products", authenticator, controller.list_product);

// 1 product details
router.post("/products/details", authenticator, controller.add_product_details);
router.put("/products/details", authenticator, controller.edit_product_details);
router.get("/products/details", authenticator, controller.list_p_details);
router.delete("/products/details/:_id",authenticator,controller.delete_product_details);

// 2 product services
router.post("/products/services",authenticator,controller.add_product_services);
router.put("/products/services",authenticator,controller.edit_product_services);
router.get("/products/services",authenticator,controller.list_product_services);
router.delete("/products/services/:_id",authenticator,controller.delete_product_services);

// 3 product highlights
router.post("/products/highlights",authenticator,controller.add_product_highlights);
router.put("/products/highlights",authenticator,controller.edit_product_highlights);
router.get("/products/highlights",authenticator,controller.list_product_highlights);
router.delete("/products/highlights/:_id",authenticator,controller.delete_product_highlights);

// 4 product variations
router.post("/products/variations", authenticator, controller.add_pv);
router.put("/products/variations", authenticator, controller.edit_pv);
router.get("/products/variations", authenticator, controller.list_pv);
router.delete("/products/variations/:_id", authenticator, controller.delete_pv);
router.get("/products/to/add",authenticator,controller.list_product_variants_to_add)

// 5 product faq
router.post("/products/faqs", authenticator, controller.add_product_faq);
router.put("/products/faqs", authenticator, controller.edit_product_faq);
router.get("/products/faqs", authenticator, controller.list_product_faq);
router.delete("/products/faqs/:_id",authenticator,controller.delete_product_faq);

// 6 delivery addresses
router.post('/products/delivery/location', authenticator, controller.add_delivery_location)
router.put('/products/delivery/location', authenticator, controller.edit_delivery_location)
router.get('/products/delivery/location', authenticator, controller.list_delivery_location)
router.delete("/products/delivery/location/:_id",authenticator,controller.delete_delivery_location);

// 7 coupons
router.post("/coupon", authenticator, controller.add_a_coupon);
router.put('/coupon', authenticator, controller.edit_a_coupon)
router.get('/coupon', authenticator, controller.list_coupons)
router.get("/coupon/:_id",authenticator,controller.list_coupon_details);
router.delete("/coupon/:_id",authenticator,controller.delete_a_coupon);


//product detail
router.get('/products/:_id', authenticator, controller.list_product_details)

// order module
router.get("/orders", authenticator, controller.list_orders);
router.put("/orders/cancel", authenticator, controller.cancel_order);
router.get("/orders/:_id", authenticator, controller.order_details);
router.put("/orders", authenticator, controller.order_status_change);
router.put("/order/cancel/request", authenticator, controller.approve_cancel_request);

router.get("/orders/invoice/:_id",authenticator,controller.order_invoice_details);

//pending api
router.get("/order/reviews", authenticator, controller.list_orders_reviews);

router.get("/transactions", authenticator, controller.list_orders_transactions);

router.get("/notifications", authenticator, controller.list_notifications);
router.put("/notifications", authenticator, controller.mark_read_notifications);
router.put("/notifications/clear", authenticator, controller.clear_notifications);
router.put("/notification/read/:_id", authenticator, controller.read_notification);

export default router;

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
