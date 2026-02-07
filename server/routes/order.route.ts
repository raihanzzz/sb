import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated";
import { createCheckoutSession, getOrders, confirmDevOrder } from "../controller/order.controller";

const router = express.Router();

router.route("/").get(isAuthenticated, getOrders);
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);
router.route("/confirm-dev").get(confirmDevOrder);
//router.route("/webhook").post()

export default router