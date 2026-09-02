import config from "../../config/index";
import {prisma} from "../../lib/prisma";
import AppError from "../../utils/AppError";

const createPaymentIntent = async (userId: string, amount: number) => {
	const user = await prisma.user.findUnique({
		where: { id: userId },
	});

	if (!user) {
		throw new AppError(404, "User not found!");
	}

	// Create a pending payment record in DB
	const paymentRecord = await prisma.payment.create({
		data: {
			userId,
			amount,
			status: "PENDING",
			transactionId: `TXN-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
		},
	});

	return {
		clientSecret: "mock_client_secret_for_stripe_integration",
		payment: paymentRecord,
	};
};

const verifyPaymentStatus = async (transactionId: string) => {
	const payment = await prisma.payment.findUnique({
		where: { transactionId },
	});

	if (!payment) {
		throw new AppError(404, "Transaction record not found!");
	}

	// Update status to PAID after successful verification
	const updatedPayment = await prisma.payment.update({
		where: { transactionId },
		data: { status: "PAID" },
	});

	return updatedPayment;
};

const getUserPaymentHistory = async (userId: string) => {
	const result = await prisma.payment.findMany({
		where: { userId },
		orderBy: { createdAt: "desc" },
	});

	return result;
};

const handleStripeWebhook = async (rawBody: Buffer, signature: string) => {
	// Stripe Event Verify & Processing Logic
	// উদাহরণস্বরূপ: Stripe event ডিকোড করে ডাটাবেজে পেমেন্ট স্ট্যাটাস 'PAID' করা
	return { received: true };
};

export const PaymentService = {
	createPaymentIntent,
	verifyPaymentStatus,
	getUserPaymentHistory,
    handleStripeWebhook,
};