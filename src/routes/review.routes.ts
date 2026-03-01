import { Router } from "express";
import { reviewController } from "../controllers/review.controller";
import { protect, optionalAuth } from "../middlewares/auth.middleware";

const router = Router({ mergeParams: true }); // Allows access to audiobookId from parent router if mounted from audiobook routes

// Create or update a review (requires auth)
router.post("/:audiobookId/reviews", protect as any, reviewController.createOrUpdateReview as any);

// Get all reviews for an audiobook (public, optionally uses auth to highlight user's own review if we wanted that)
router.get("/:audiobookId/reviews", optionalAuth as any, reviewController.getReviewsForAudiobook as any);

// Get the specific review made by the logged-in user for this audiobook
router.get("/:audiobookId/reviews/me", protect as any, reviewController.getUserReview as any);

// Delete user's review for this audiobook
router.delete("/:audiobookId/reviews", protect as any, reviewController.deleteReview as any);

export default router;
