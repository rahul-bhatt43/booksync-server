import { Router } from "express";
import { NarratorController } from "../controllers/narrator.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createNarratorSchema, updateNarratorSchema } from "../validators/narrator.validator";
import multer from "multer";

const router = Router();
const upload = multer();

router.route("/")
    .get(NarratorController.getAll)
    .post(protect, authorize("admin"), upload.single("imageFile"), validate(createNarratorSchema), NarratorController.create);

router.route("/:id")
    .get(NarratorController.getById)
    .put(protect, authorize("admin"), upload.single("imageFile"), validate(updateNarratorSchema), NarratorController.update)
    .delete(protect, authorize("admin"), NarratorController.remove);

export default router;
