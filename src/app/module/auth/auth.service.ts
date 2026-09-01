import bcrypt from "bcrypt";
import config from "../../config/index.js";
import {prisma }from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";
import jwtUtils from "../../utils/jwt.js";
import type { TLoginResponse, TLoginUser, TRegisterUser } from "./auth.interface.js";
import {JwtPayload, SignOptions } from "jsonwebtoken";


const registerUser = async (payload: TRegisterUser) => {
	const isUserExists = await prisma.user.findUnique({
		where: { email: payload.email },
	});

	if (isUserExists) {
		throw new AppError(400, "User with this email already exists!");
	}

	const hashedPassword = await bcrypt.hash(
		payload.password,
		Number(config.bcrypt_salt_rounds)
	);

	const newUser = await prisma.user.create({
		data: {
			...payload,
			password: hashedPassword,
		},
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			phone: true,
			createdAt: true,
		},
	});

	return newUser;
};

const loginUser = async (payload: TLoginUser): Promise<TLoginResponse> => {
	const user = await prisma.user.findUnique({
		where: { email: payload.email },
	});

	if (!user) {
		throw new AppError(404, "User not found!");
	}

	const isPasswordMatched = await bcrypt.compare(
		payload.password,
		user.password
	);

	if (!isPasswordMatched) {
		throw new AppError(403, "Password does not match!");
	}

	const jwtPayload = {
		id: user.id,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in as SignOptions
	);

	const refreshToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_refresh_secret,
		config.jwt_refresh_expires_in as SignOptions
	);

	return {
		accessToken,
		refreshToken,
		user: {
			id: user.id,
			name: user.name,
			email: user.email,
			role: user.role,
		},
	};
};

const refreshToken = async (token: string) => {
	const decoded = jwtUtils.verifyToken(token, config.jwt_refresh_secret);

	const user = await prisma.user.findUnique({
		where: { id: decoded.id },
	});

	if (!user) {
		throw new AppError(404, "User not found!");
	}

	const jwtPayload = {
		id: user.id,
		email: user.email,
		role: user.role,
	};

	const accessToken = jwtUtils.createToken(
		jwtPayload,
		config.jwt_access_secret,
		config.jwt_access_expires_in
	);

	return { accessToken };
};

export const AuthService = {
	registerUser,
	loginUser,
	refreshToken,
};