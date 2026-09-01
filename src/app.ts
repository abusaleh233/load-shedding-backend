import cors from "cors";
import express, { type Application, type Request, type Response } from "express";
import helmet from "helmet";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import { AuthRoutes } from "./app/module/auth/auth.route";
import { PaymentController } from "./app/module/payment/payment.controller";
import { PaymentRoutes } from "./app/module/payment/payment.route";
import { ScheduleRoutes } from "./app/module/schedule/schedule.route";
import AppError from "./app/utils/AppError";

const app: Application = express();

// Security and CORS Middlewares
app.use(helmet());
app.use(cors());

// Stripe Webhook Endpoint (RAW Body parser must be mounted before express.json)
app.post(
	"/api/v1/payments/webhook",
	express.raw({ type: "application/json" }),
	PaymentController.webhook
);

// Standard Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root Health Check Route
app.get("/", (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: "⚡ Load Shedding & Power Management API Server is Running Active!",
	});
});

// Directly Mounting Module Routes (No central routes/index.ts)
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/schedules", ScheduleRoutes);
app.use("/api/v1/payments", PaymentRoutes);

// Not Found Route Handler
app.use((req: Request, res: Response, next) => {
	next(new AppError(404, `Cannot find ${req.originalUrl} on this server!`));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

export default app;