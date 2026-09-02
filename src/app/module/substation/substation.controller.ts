import type { Request, Response } from "express";
import {catchAsync} from "../../utils/catchAsync.js";
import {sendResponse} from "../../utils/sendResponse.js";
import { SubstationService } from "./substation.service.js";

const createSubstation = catchAsync(async (req: Request, res: Response) => {
	const result = await SubstationService.createSubstation(req.body);

	sendResponse(res, {
		statusCode: 201,
		success: true,
		message: "Substation created successfully!",
		data: result,
	});
});

const getAllSubstations = catchAsync(async (req: Request, res: Response) => {
	const result = await SubstationService.getAllSubstations();

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Substations fetched successfully!",
		data: result,
	});
});

const getSubstationById = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SubstationService.getSubstationById(id as string);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Substation retrieved successfully!",
		data: result,
	});
});

const updateSubstation = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SubstationService.updateSubstation(id as string, req.body);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Substation updated successfully!",
		data: result,
	});
});

const deleteSubstation = catchAsync(async (req: Request, res: Response) => {
	const { id } = req.params;
	const result = await SubstationService.deleteSubstation(id as string);

	sendResponse(res, {
		statusCode: 200,
		success: true,
		message: "Substation deleted successfully!",
		data: result,
	});
});

export const SubstationController = {
	createSubstation,
	getAllSubstations,
	getSubstationById,
	updateSubstation,
	deleteSubstation,
};