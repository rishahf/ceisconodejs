import express from 'express';
import * as user_controller from './user_controller';
import controller from './controller';
import authenticator from '../../middlewares/authenticator';
import { auth } from 'firebase-admin';
const router = express.Router();

// profile module
router.post("/signup", user_controller.signup)
router.post("/login", user_controller.login)
router.post("/email_verification", authenticator, user_controller.email_verification)
router.post("/resend_otp", user_controller.resend_otp)
router.post("/verify/phone_no", authenticator, user_controller.phone_no_verification)
router.post("/resend/phone_no/otp", user_controller.resend_phone_otp)
router.post("/social_login", user_controller.social_login)
router.post("/verify_otp", user_controller.verify_otp)

router.post("/forgot_password", controller.forgot_password)
router.post("/forgot_password/resend_otp", controller.resend_fp_otp)
router.post("/forgot_password/verify_otp", controller.verify_fp_otp)
router.post("/forgot_password/set_password", controller.set_new_password)

router.get("/view_my_profile", authenticator, user_controller.view_my_profile)
router.put("/edit_profile", authenticator, user_controller.edit_profile)
router.put("/change_password", authenticator, user_controller.change_password)
router.put("/logout", authenticator, user_controller.logout)
router.put("/deactivate_account", authenticator, user_controller.deactivate_account)
router.post("/contact_us", user_controller.contact_us)
router.get("/list_content", user_controller.list_content)

router.post("/address", authenticator, user_controller.add_edit_address)
router.put("/address", authenticator, user_controller.set_default_address)
router.get("/address", authenticator, user_controller.list_address)
router.delete("/address/delete/:_id", authenticator, user_controller.delete_address)

router.get("/review/can_add", authenticator, user_controller.can_add_review)
router.post("/review", authenticator, user_controller.add_review)
router.put("/review", authenticator, user_controller.edit_review)
router.get("/review", user_controller.list_reviews)
router.get("/review/my", authenticator, user_controller.list_my_reviews)
router.get("/review/my/:_id", authenticator, user_controller.my_review_details)
router.delete("/review/delete/:_id", authenticator, user_controller.delete_review);

router.post("/wishlist", authenticator, user_controller.add_wishlist),
router.get("/wishlist", authenticator, user_controller.get_wishlist),
router.delete("/wishlists/delete/:_id", authenticator, user_controller.delete_wishlist)

router.get("/coupons", authenticator, user_controller.list_coupons)
router.get("/coupons/used", authenticator, user_controller.list_used_coupons)
router.get("/coupons/expired", authenticator, user_controller.expired_coupons)
router.get("/coupons/:_id", authenticator, user_controller.coupon_details)

router.post("/shipment", authenticator, user_controller.shipment_create)

// search and listing module
router.get("/search", controller.search)
router.get("/categories", controller.categories)
router.get("/categories/:_id", controller.categories_details)
router.get("/sub_categories", controller.sub_categories)
router.get("/sub_categories/:_id", controller.sub_categories_details)
router.get("/sub_subcategories", controller.sub_subcategories)
router.get("/sub_subcategories/:_id", controller.sub_subcategories_details)
router.get("/brands", controller.brands)
router.get("/brands/:_id", controller.brands_details)

router.get("/nested", controller.nested)

router.post("/cart", authenticator, controller.add_to_cart)
router.put("/cart", authenticator, controller.edit_cart)
router.get("/cart", authenticator, controller.list_cart)
router.delete("/cart/:_id", authenticator, controller.remove_from_cart)
router.get("/cart/price_details", authenticator, controller.price_details)

// faq module
router.get("/product/faqs", controller.list_faqs)
router.post("/product/faqs/like-dislike", authenticator, controller.faq_like_dislike)
// router.post("/product/faqs/dislike", authenticator, controller.faq_dislike)

router.get("/notifications", authenticator, user_controller.list_notifications);
router.put("/notifications", authenticator, user_controller.read_notifications);
router.put("/notifications/clear", authenticator, user_controller.clear_notifications);

router.get("/main-keys", user_controller.getKeys);
router.get("/main-keys/:_id", user_controller.getKeyDetail);

export default router;


// router.put("/forgot_password", user_controller.forgot_password)
// router.post("/verify_password_otp", user_controller.verify_password_otp)
// router.post("/set_new_password", user_controller.set_new_password)

// router.get("/used_coupons", authenticator, user_controller.list_used_coupons)
// router.get("/expired_coupons", authenticator, user_controller.expired_coupons)

// router.post("/order", authenticator, user_controller.place_order)
// router.get("/order", authenticator, user_controller.get_all_orders)
// router.get("/order/details", authenticator, user_controller.get_single_order_detail)
// router.put("/order", authenticator, user_controller.cancel_order)


// router.post("/card",authenticator,user_controller.save_card)
// router.post("/card", authenticator, user_controller.add_card)
// router.post("/detach/payment", authenticator, user_controller.detach_payment)
// router.put("/card", authenticator, user_controller.set_default_card)
// router.get("/cards", authenticator, user_controller.list_cards)
// router.get("/card", authenticator, user_controller.card_detail)