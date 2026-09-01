import express from "express";
import auth from "../../middleware/auth.js";
import validateRequest from "../../middleware/validateRequest.js";
import { ScheduleController } from "./schedule.controller.js";
import { ScheduleValidation } from "./schedule.validation.js";

const router = express.Router();

// Public route to view load shedding schedules
router.get("/", ScheduleController.getAllSchedules);

router.get("/:id", ScheduleController.getScheduleById);

// Admin & Operator protected routes
router.post(
	"/",
	auth("ADMIN", "SUBSTATION_OPERATOR"),
	validateRequest(ScheduleValidation.createScheduleValidationSchema),
	ScheduleController.createSchedule
);

router.patch(
	"/:id",
	auth("ADMIN", "SUBSTATION_OPERATOR"),
	validateRequest(ScheduleValidation.updateScheduleValidationSchema),
	ScheduleController.updateSchedule
);

router.delete(
	"/:id",
	auth("ADMIN"),
	ScheduleController.deleteSchedule
);

export const ScheduleRoutes = router;