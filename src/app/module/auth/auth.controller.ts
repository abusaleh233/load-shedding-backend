import type { Request, Response } from "express";
import config from "../../config/index";
import {catchAsync} from "../../utils/catchAsync";
import { AuthService } from "./auth.service";
import { sendResponse } from "../../utils/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthService.registerUser(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "User registered successfully!",
		data: result,
	});
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
	const result = await AuthService.loginUser(req.body);
	const { refreshToken, accessToken, user } = result;

	res.cookie("refreshToken", refreshToken, {
		secure: config.node_env === "production",
		httpOnly: true,
	});

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "User logged in successfully!",
		data: {
			accessToken,
			user,
		},
	});
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
	const { refreshToken } = req.cookies;
	const result = await AuthService.refreshToken(refreshToken);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Access token retrieved successfully!",
		data: result,
	});
});

export const AuthController = {
	registerUser,
	loginUser,
	refreshToken,
};