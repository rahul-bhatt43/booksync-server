import { Router } from "express";
import { AppLinkController } from "../controllers/appLink.controller";
import { protect, authorize } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createAppLinkSchema, updateAppLinkSchema } from "../validators/appLink.validator";

const router = Router();

// Public route to get active download links
router.get("/active", AppLinkController.getActiveLinks);

// Admin-only routes for management
router.route("/")
    .get(protect, authorize("admin"), AppLinkController.getAll)
    .post(protect, authorize("admin"), validate(createAppLinkSchema), AppLinkController.create);

router.route("/:id")
    .get(protect, authorize("admin"), AppLinkController.getById)
    .put(protect, authorize("admin"), validate(updateAppLinkSchema), AppLinkController.update)
    .delete(protect, authorize("admin"), AppLinkController.remove);

export default router;
