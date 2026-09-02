import {prisma} from "../../lib/prisma.js";
import AppError from "../../utils/AppError.js";

const createSubstation = async (payload: { name: string; code: string; location: string; capacityMw?: number }) => {
	const isExist = await prisma.substation.findUnique({
		where: { code: payload.code },
	});

	if (isExist) {
		throw new AppError(400, "Substation with this code already exists!");
	}

	const result = await prisma.substation.create({
		data: payload,
	});

	return result;
};

const getAllSubstations = async () => {
	const result = await prisma.substation.findMany({
		include: {
			schedules: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	return result;
};

const getSubstationById = async (id: string) => {
	const result = await prisma.substation.findUnique({
		where: { id },
		include: {
			schedules: true,
		},
	});

	if (!result) {
		throw new AppError(404, "Substation not found!");
	}

	return result;
};

const updateSubstation = async (id: string, payload: Partial<{ name: string; code: string; location: string; capacityMw?: number }>) => {
	const isExist = await prisma.substation.findUnique({
		where: { id },
	});

	if (!isExist) {
		throw new AppError(404, "Substation not found!");
	}

	const result = await prisma.substation.update({
		where: { id },
		data: payload,
	});

	return result;
};

const deleteSubstation = async (id: string) => {
	const isExist = await prisma.substation.findUnique({
		where: { id },
	});

	if (!isExist) {
		throw new AppError(404, "Substation not found!");
	}

	const result = await prisma.substation.delete({
		where: { id },
	});

	return result;
};

export const SubstationService = {
	createSubstation,
	getAllSubstations,
	getSubstationById,
	updateSubstation,
	deleteSubstation,
};