import express from "express";
import auth from "../../middleware/auth.js";
import { PaymentController } from "./payment.controller.js";

const router = express.Router();

router.post(
	"/create-intent",
	auth("USER", "ADMIN"),
	PaymentController.createPaymentIntent
);

router.patch(
	"/verify/:transactionId",
	auth("USER", "ADMIN"),
	PaymentController.verifyPaymentStatus
);

router.get(
	"/my-history",
	auth("USER", "ADMIN"),
	PaymentController.getUserPaymentHistory
);

export const PaymentRoutes = router;