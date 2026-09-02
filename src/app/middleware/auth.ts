import type { NextFunction, Request, Response } from "express";
import config from "../config/index.js";
import {prisma} from "../lib/prisma.js";
import AppError from "../utils/AppError.js";
import jwtUtils from "../utils/jwt.js";

declare global {
	namespace Express {
		interface Request {
			user?: {
				id: string;
				email: string;
				role: string;
			};
		}
	}
}

const auth = (...requiredRoles: string[]) => {
	return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
		try {
			const token = req.headers.authorization?.split(" ")[1];

			if (!token) {
				throw new AppError(401, "You are not authorized! Token missing.");
			}

			// Verify Token using jwtUtils
			const decoded = jwtUtils.verifyToken(
				token,
				config.jwt_access_secret
			) as { id: string; email: string; role: string };

			// Check if User Exists in Database
			const user = await prisma.user.findUnique({
				where: { id: decoded.id },
			});

			if (!user) {
				throw new AppError(404, "User associated with this token was not found!");
			}

			// Check Role authorization
			if (requiredRoles.length && !requiredRoles.includes(decoded.role)) {
				throw new AppError(403, "You do not have permission to access this route!");
			}

			req.user = decoded;
			next();
		} catch (error) {
			next(error);
		}
	};
};

export default auth;