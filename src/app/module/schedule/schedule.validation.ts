import { z } from "zod";

const createScheduleValidationSchema = z.object({
	body: z.object({
		substationId: z.string({
			message: "Substation ID is required",
		}),
		areaName: z.string({
			message: "Area name is required",
		}),
		startTime: z.string({
			message: "Start time is required",
		}),
		endTime: z.string({
			message: "End time is required",
		}),
		date: z.string({
			message: "Date is required",
		}),
		status: z.enum(["SCHEDULED", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
	}),
});

const updateScheduleValidationSchema = z.object({
	body: z.object({
		substationId: z.string().optional(),
		areaName: z.string().optional(),
		startTime: z.string().optional(),
		endTime: z.string().optional(),
		date: z.string().optional(),
		status: z.enum(["SCHEDULED", "ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
	}),
});

export const ScheduleValidation = {
	createScheduleValidationSchema,
	updateScheduleValidationSchema,
};