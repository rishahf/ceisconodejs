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
const user_controller = __importStar(require("./user_controller"));
const controller_1 = __importDefault(require("./controller"));
const authenticator_1 = __importDefault(require("../../middlewares/authenticator"));
const router = express_1.default.Router();
// profile module
router.post("/signup", user_controller.signup);
router.post("/login", user_controller.login);
router.post("/email_verification", authenticator_1.default, user_controller.email_verification);
router.post("/resend_otp", user_controller.resend_otp);
router.post("/verify/phone_no", authenticator_1.default, user_controller.phone_no_verification);
router.post("/resend/phone_no/otp", user_controller.resend_phone_otp);
router.post("/social_login", user_controller.social_login);
router.post("/verify_otp", user_controller.verify_otp);
router.post("/forgot_password", controller_1.default.forgot_password);
router.post("/forgot_password/resend_otp", controller_1.default.resend_fp_otp);
router.post("/forgot_password/verify_otp", controller_1.default.verify_fp_otp);
router.post("/forgot_password/set_password", controller_1.default.set_new_password);
router.get("/view_my_profile", authenticator_1.default, user_controller.view_my_profile);
router.put("/edit_profile", authenticator_1.default, user_controller.edit_profile);
router.put("/change_password", authenticator_1.default, user_controller.change_password);
router.put("/logout", authenticator_1.default, user_controller.logout);
router.put("/deactivate_account", authenticator_1.default, user_controller.deactivate_account);
router.post("/contact_us", user_controller.contact_us);
router.get("/list_content", user_controller.list_content);
router.post("/address", authenticator_1.default, user_controller.add_edit_address);
router.put("/address", authenticator_1.default, user_controller.set_default_address);
router.get("/address", authenticator_1.default, user_controller.list_address);
router.delete("/address/delete/:_id", authenticator_1.default, user_controller.delete_address);
router.get("/review/can_add", authenticator_1.default, user_controller.can_add_review);
router.post("/review", authenticator_1.default, user_controller.add_review);
router.put("/review", authenticator_1.default, user_controller.edit_review);
router.get("/review", user_controller.list_reviews);
router.get("/review/my", authenticator_1.default, user_controller.list_my_reviews);
router.get("/review/my/:_id", authenticator_1.default, user_controller.my_review_details);
router.delete("/review/delete/:_id", authenticator_1.default, user_controller.delete_review);
router.post("/wishlist", authenticator_1.default, user_controller.add_wishlist),
    router.get("/wishlist", authenticator_1.default, user_controller.get_wishlist),
    router.delete("/wishlists/delete/:_id", authenticator_1.default, user_controller.delete_wishlist);
router.get("/coupons", authenticator_1.default, user_controller.list_coupons);
router.get("/coupons/used", authenticator_1.default, user_controller.list_used_coupons);
router.get("/coupons/expired", authenticator_1.default, user_controller.expired_coupons);
router.get("/coupons/:_id", authenticator_1.default, user_controller.coupon_details);
router.post("/shipment", authenticator_1.default, user_controller.shipment_create);
// search and listing module
router.get("/search", controller_1.default.search);
router.get("/categories", controller_1.default.categories);
router.get("/categories/:_id", controller_1.default.categories_details);
router.get("/sub_categories", controller_1.default.sub_categories);
router.get("/sub_categories/:_id", controller_1.default.sub_categories_details);
router.get("/sub_subcategories", controller_1.default.sub_subcategories);
router.get("/sub_subcategories/:_id", controller_1.default.sub_subcategories_details);
router.get("/brands", controller_1.default.brands);
router.get("/brands/:_id", controller_1.default.brands_details);
router.get("/nested", controller_1.default.nested);
router.post("/cart", authenticator_1.default, controller_1.default.add_to_cart);
router.put("/cart", authenticator_1.default, controller_1.default.edit_cart);
router.get("/cart", authenticator_1.default, controller_1.default.list_cart);
router.delete("/cart/:_id", authenticator_1.default, controller_1.default.remove_from_cart);
router.get("/cart/price_details", authenticator_1.default, controller_1.default.price_details);
// faq module
router.get("/product/faqs", controller_1.default.list_faqs);
router.post("/product/faqs/like-dislike", authenticator_1.default, controller_1.default.faq_like_dislike);
// router.post("/product/faqs/dislike", authenticator, controller.faq_dislike)
router.get("/notifications", authenticator_1.default, user_controller.list_notifications);
router.put("/notifications", authenticator_1.default, user_controller.read_notifications);
router.put("/notifications/clear", authenticator_1.default, user_controller.clear_notifications);
router.get("/main-keys", user_controller.getKeys);
router.get("/main-keys/:_id", user_controller.getKeyDetail);
exports.default = router;
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
