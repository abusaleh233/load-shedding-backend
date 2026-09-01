import type { ErrorRequestHandler } from "express";
import config from "../config/index.js";
import AppError from "../utils/AppError.js";

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
	let statusCode = 500;
	let message = "Something went wrong!";
	let errorMessages: { path: string; message: string }[] = [];

	if (err instanceof AppError) {
		statusCode = err.statusCode;
		message = err.message;
		errorMessages = [
			{
				path: "",
				message: err.message,
			},
		];
	} else if (err instanceof Error) {
		message = err.message;
		errorMessages = [
			{
				path: "",
				message: err.message,
			},
		];
	}

	res.status(statusCode).json({
		success: false,
		message,
		errorMessages,
		stack: config.node_env === "development" ? err?.stack : undefined,
	});
};

export default globalErrorHandler;