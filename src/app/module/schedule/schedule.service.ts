import {prisma} from "../../lib/prisma";
import {redisClient} from "../../lib/redis";
import AppError from "../../utils/AppError";

const CACHE_KEY = "load_shedding_schedules";

const createSchedule = async (payload: any) => {
	const result = await prisma.schedule.create({
		data: payload,
		include: {
			substation: true,
		},
	});

	// Invalidate Redis Cache when new schedule is created
	if (redisClient.isOpen) {
		await redisClient.del(CACHE_KEY);
	}

	return result;
};

const getAllSchedules = async () => {
	// Try to fetch from Redis Cache first
	if (redisClient.isOpen) {
		const cachedData = await redisClient.get(CACHE_KEY);
		if (cachedData) {
			return JSON.parse(cachedData);
		}
	}

	const result = await prisma.schedule.findMany({
		include: {
			substation: true,
		},
		orderBy: {
			createdAt: "desc",
		},
	});

	// Cache the result for 1 hour (3600 seconds)
	if (redisClient.isOpen && result.length > 0) {
		await redisClient.setEx(CACHE_KEY, 3600, JSON.stringify(result));
	}

	return result;
};

const getScheduleById = async (id: string) => {
	const result = await prisma.schedule.findUnique({
		where: { id },
		include: {
			substation: true,
		},
	});

	if (!result) {
		throw new AppError(404, "Schedule not found!");
	}

	return result;
};

const updateSchedule = async (id: string, payload: Partial<any>) => {
	const isScheduleExists = await prisma.schedule.findUnique({
		where: { id },
	});

	if (!isScheduleExists) {
		throw new AppError(404, "Schedule not found!");
	}

	const result = await prisma.schedule.update({
		where: { id },
		data: payload,
		include: {
			substation: true,
		},
	});

	// Invalidate Redis Cache after update
	if (redisClient.isOpen) {
		await redisClient.del(CACHE_KEY);
	}

	return result;
};

const deleteSchedule = async (id: string) => {
	const isScheduleExists = await prisma.schedule.findUnique({
		where: { id },
	});

	if (!isScheduleExists) {
		throw new AppError(404, "Schedule not found!");
	}

	const result = await prisma.schedule.delete({
		where: { id },
	});

	// Invalidate Redis Cache after deletion
	if (redisClient.isOpen) {
		await redisClient.del(CACHE_KEY);
	}

	return result;
};

export const ScheduleService = {
	createSchedule,
	getAllSchedules,
	getScheduleById,
	updateSchedule,
	deleteSchedule,
};