import { Router } from "express";
import { HistoryController } from "../controllers/history.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateHistorySchema } from "../validators/audiobook.validator";

const router = Router();

router.use(protect); // All history routes require authentication

router.post("/update", validate(updateHistorySchema), HistoryController.updateProgress);
router.get("/", HistoryController.getHistory);

export default router;
