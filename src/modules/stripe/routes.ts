import express from 'express';
import controller from './stripe_controller';
import authenticator from '../../middlewares/authenticator';
const router = express.Router();

router.post("/token", controller.gen_token)  //// "deprecated" : true
router.post("/card", authenticator, controller.create_a_card)
router.get("/card", authenticator, controller.list_cards)
router.delete("/card/:_id", authenticator, controller.delete_card);

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

export default router