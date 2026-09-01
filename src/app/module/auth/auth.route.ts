import express from "express";
import validateRequest from "../../middleware/validateRequest.js";
import { AuthController } from "./auth.controller.js";
import { AuthValidation } from "./auth.validation.js";

const router = express.Router();

router.post(
	"/register",
	validateRequest(AuthValidation.registerValidationSchema),
	AuthController.registerUser
);

router.post(
	"/login",
	validateRequest(AuthValidation.loginValidationSchema),
	AuthController.loginUser
);

router.post(
	"/refresh-token",
	validateRequest(AuthValidation.refreshTokenValidationSchema),
	AuthController.refreshToken
);

export const AuthRoutes = router;