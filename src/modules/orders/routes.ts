import express from 'express';
import controller from './controller';
import authenticator from '../../middlewares/authenticator';
const router = express.Router();


router.post("/", authenticator, controller.create_order)
router.get("/", authenticator, controller.user_list_orders)
router.put("/cancel", authenticator, controller.cancel_order)
router.put("/cancellation/request", authenticator, controller.cancel_cancellation_request);
router.get("/payment_status", authenticator, controller.order_payment_status)

// order_details
router.get("/:_id", authenticator, controller.order_details)
router.get("/products/:_id", authenticator, controller.ordered_products_detail);

//pending user invoice
router.get("/invoice/detail/:_id",authenticator, controller.ordered_products_invoice)

router.post("/coupon/availablity", authenticator,controller.check_coupon_availability);
router.get("/address/delivery/:_id", authenticator, controller.check_delivery_availability);

export default router;