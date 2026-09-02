import type { Request, Response } from "express";
import {catchAsync} from "../../utils/catchAsync";
import {sendResponse} from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

const createPaymentIntent = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.id as string;
	const { amount } = req.body;

	const result = await PaymentService.createPaymentIntent(userId, amount);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Payment intent initialized successfully!",
		data: result,
	});
});

const verifyPaymentStatus = catchAsync(async (req: Request, res: Response) => {
	const { transactionId } = req.params;

	const result = await PaymentService.verifyPaymentStatus(transactionId as string);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Payment status verified successfully!",
		data: result,
	});
});

const getUserPaymentHistory = catchAsync(async (req: Request, res: Response) => {
	const userId = req.user?.id as string;

	const result = await PaymentService.getUserPaymentHistory(userId);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Payment history fetched successfully!",
		data: result,
	});
});

const webhook = catchAsync(async (req: Request, res: Response) => {
	const signature = req.headers["stripe-signature"] as string;

	// req.body এখানে raw Buffer হিসেবে আসবে
	const result = await PaymentService.handleStripeWebhook(req.body, signature);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Webhook processed successfully!",
		data: result,
	});
});

export const PaymentController = {
	createPaymentIntent,
	verifyPaymentStatus,
	getUserPaymentHistory,
    webhook,
};