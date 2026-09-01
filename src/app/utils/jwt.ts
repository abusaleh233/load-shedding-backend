import jwt, { type JwtPayload, type Secret, type SignOptions } from "jsonwebtoken";
import AppError from "./AppError.js";

const createToken = (
	payload: Record<string, unknown>,
	secret: Secret,
	expiresIn: SignOptions["expiresIn"]
): string => {
	return jwt.sign(payload, secret, {
		expiresIn,
	});
};

const verifyToken = (token: string, secret: Secret): JwtPayload => {
	try {
		return jwt.verify(token, secret) as JwtPayload;
	} catch (error) {
		throw new AppError(401, "Invalid or expired token!");
	}
};

export const jwtUtils = {
	createToken,
	verifyToken,
};

export default jwtUtils;