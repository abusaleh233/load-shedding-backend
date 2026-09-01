import { z } from "zod";

const registerValidationSchema = z.object({
	body: z.object({
		name: z.string().min(2, "Name must be at least 2 characters long"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		phone: z.string().optional(),
		role: z.enum(["ADMIN", "USER", "SUBSTATION_OPERATOR"]).optional(),
	}),
});

const loginValidationSchema = z.object({
	body: z.object({
		email: z.string().email("Invalid email address"),
		password: z.string().min(1, "Password is required"),
	}),
});

const refreshTokenValidationSchema = z.object({
	cookies: z.object({
		refreshToken: z.string({
			required_error: "Refresh token is required in cookies",
		}),
	}),
});

export const AuthValidation = {
	registerValidationSchema,
	loginValidationSchema,
	refreshTokenValidationSchema,
};