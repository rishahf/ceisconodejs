"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_controller_1 = __importDefault(require("./stripe_controller"));
const authenticator_1 = __importDefault(require("../../middlewares/authenticator"));
const router = express_1.default.Router();
router.post("/token", stripe_controller_1.default.gen_token); //// "deprecated" : true
router.post("/card", authenticator_1.default, stripe_controller_1.default.create_a_card);
router.get("/card", authenticator_1.default, stripe_controller_1.default.list_cards);
router.delete("/card/:_id", authenticator_1.default, stripe_controller_1.default.delete_card);
// router.get("/plan", controller.list_plans)
// router.get("/plan/details", controller.plan_details)
// router.get("/plan/purchased", authenticator, controller.purchased_plans)
// router.post("/subscription", authenticator, controller.create_a_subscription)
// router.put("/subscription", authenticator, controller.update_a_subscription)
// router.get("/invoice", authenticator, controller.retrive_a_invoice)
// router.get("/invoice/upcoming", authenticator, controller.retrive_upcoming_invoice)
// router.post("/plan/downgrade", authenticator, controller.downgrade_plan)
// router.get("/plan/downgrade", authenticator, controller.retrive_downgraded_plan)
// router.delete("/plan/downgrade/:_id", authenticator, controller.cancel_downgrade)
// router.post("/mobile/send_otp", authenticator,controller.mobile_otp)
// router.post("/mobile/verify", authenticator,controller.mobile_verification)
exports.default = router;
