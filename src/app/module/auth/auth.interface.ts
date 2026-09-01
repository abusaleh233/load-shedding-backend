export type TRegisterUser = {
	name: string;
	email: string;
	password: string;
	phone?: string;
	role?: "ADMIN" | "USER" | "SUBSTATION_OPERATOR";
};

export type TLoginUser = {
	email: string;
	password: string;
};

export type TLoginResponse = {
	accessToken: string;
	refreshToken: string;
	user: {
		id: string;
		name: string;
		email: string;
		role: string;
	};
};