import type { Request, Response } from "express";
import {catchAsync} from "../../utils/catchAsync.js";
import {sendResponse} from "../../utils/sendResponse.js";
import { ScheduleService } from "./schedule.service.js";

const createSchedule = catchAsync(async (req: Request, res: Response) => {
	const result = await ScheduleService.createSchedule(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Load shedding schedule created successfully!",
		data: result,
	});
});

const getAllSchedules = catchAsync(async (req: Request, res: Response) => {
	const result = await ScheduleService.getAllSchedules();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Schedules fetched successfully!",
		data: result,
	});
});

const getScheduleById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ScheduleService.getScheduleById(id as string);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Schedule retrieved successfully!",
		data: result,
	});
});

const updateSchedule = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ScheduleService.updateSchedule(id as string, req.body);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Schedule updated successfully!",
		data: result,
	});
});

const deleteSchedule = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await ScheduleService.deleteSchedule(id as string);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Schedule deleted successfully!",
		data: result,
	});
});

export const ScheduleController = {
	createSchedule,
	getAllSchedules,
	getScheduleById,
	updateSchedule,
	deleteSchedule,
};