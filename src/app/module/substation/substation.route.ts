import express from "express";
import auth from "../../middleware/auth.js";
import { SubstationController } from "./substation.controller.js";

const router = express.Router();

router.get("/", SubstationController.getAllSubstations);
router.get("/:id", SubstationController.getSubstationById);

router.post(
	"/",
	auth("ADMIN"),
	SubstationController.createSubstation
);

router.patch(
	"/:id",
	auth("ADMIN", "SUBSTATION_OPERATOR"),
	SubstationController.updateSubstation
);

router.delete(
	"/:id",
	auth("ADMIN"),
	SubstationController.deleteSubstation
);

export const SubstationRoutes = router;