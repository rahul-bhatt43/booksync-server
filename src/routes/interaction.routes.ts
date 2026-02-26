import { Router } from "express";
import { InteractionController } from "../controllers/interaction.controller";
import { protect } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { addCommentSchema } from "../validators/audiobook.validator";

const router = Router();

// Routes for audiobook interactions
router.post("/audiobooks/:id/comments", protect, validate(addCommentSchema), InteractionController.addComment);
router.get("/audiobooks/:id/comments", InteractionController.getComments); // Public viewing of comments
router.post("/audiobooks/:id/like", protect, InteractionController.toggleLike);

// Routes for specific comments
router.delete("/comments/:commentId", protect, InteractionController.deleteComment);

export default router;
