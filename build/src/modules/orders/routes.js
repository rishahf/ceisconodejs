"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
const authenticator_1 = __importDefault(require("../../middlewares/authenticator"));
const router = express_1.default.Router();
router.post("/", authenticator_1.default, controller_1.default.create_order);
router.get("/", authenticator_1.default, controller_1.default.user_list_orders);
router.put("/cancel", authenticator_1.default, controller_1.default.cancel_order);
router.put("/cancellation/request", authenticator_1.default, controller_1.default.cancel_cancellation_request);
router.get("/payment_status", authenticator_1.default, controller_1.default.order_payment_status);
// order_details
router.get("/:_id", authenticator_1.default, controller_1.default.order_details);
router.get("/products/:_id", authenticator_1.default, controller_1.default.ordered_products_detail);
//pending user invoice
router.get("/invoice/detail/:_id", authenticator_1.default, controller_1.default.ordered_products_invoice);
router.post("/coupon/availablity", authenticator_1.default, controller_1.default.check_coupon_availability);
router.get("/address/delivery/:_id", authenticator_1.default, controller_1.default.check_delivery_availability);
exports.default = router;
