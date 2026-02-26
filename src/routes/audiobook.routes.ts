import { Router } from "express";
import { AudiobookController } from "../controllers/audiobook.controller";
import { upload } from "../middlewares/upload.middleware";
import { protect, authorize, optionalAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { createAudiobookSchema, updateAudiobookSchema } from "../validators/audiobook.validator";

const router = Router();

// Configure multer to accept both audioFile and coverImage
const uploadFields = upload.fields([
    { name: "audioFile", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
]);

router
    .route("/")
    .get(AudiobookController.getAll)
    .post(protect, authorize("admin"), uploadFields, validate(createAudiobookSchema), AudiobookController.create);

router
    .route("/:id")
    .get(optionalAuth, AudiobookController.getById)
    .put(protect, authorize("admin"), validate(updateAudiobookSchema), AudiobookController.update)
    .delete(protect, authorize("admin"), AudiobookController.remove);

export default router;
