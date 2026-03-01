import { Request, Response } from "express";
import { reviewService } from "../services/review.service";
import mongoose from "mongoose";

export class ReviewController {
    async createOrUpdateReview(req: Request, res: Response) {
        try {
            const { rating, text } = req.body;
            const audiobookId = req.params.audiobookId as string;

            const user = req.user as any;
            const userId = user?.id || user?._id || user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(audiobookId)) {
                res.status(400).json({ message: "Invalid audiobook ID" });
                return;
            }

            if (typeof rating !== "number" || rating < 1 || rating > 5) {
                res.status(400).json({ message: "Rating must be a number between 1 and 5" });
                return;
            }

            // Check if user already has a review for this book
            const existingReview = await reviewService.getUserReviewForAudiobook(userId, audiobookId);

            let review;
            if (existingReview) {
                review = await reviewService.updateReview(userId, audiobookId, rating, text);
                res.status(200).json(review);
            } else {
                review = await reviewService.createReview(userId, audiobookId, rating, text);
                res.status(201).json(review);
            }
        } catch (error) {
            console.error("Error creating/updating review:", error);
            res.status(500).json({ message: "Failed to create/update review" });
        }
    }

    async getReviewsForAudiobook(req: Request, res: Response) {
        try {
            const audiobookId = req.params.audiobookId as string;
            const limit = parseInt(req.query.limit as string) || 20;
            const skip = parseInt(req.query.skip as string) || 0;

            if (!mongoose.Types.ObjectId.isValid(audiobookId)) {
                res.status(400).json({ message: "Invalid audiobook ID" });
                return;
            }

            const reviews = await reviewService.getReviewsForAudiobook(audiobookId, limit, skip);
            res.status(200).json(reviews);
        } catch (error) {
            console.error("Error fetching reviews:", error);
            res.status(500).json({ message: "Failed to fetch reviews" });
        }
    }

    async getUserReview(req: Request, res: Response) {
        try {
            const audiobookId = req.params.audiobookId as string;
            const user = req.user as any;
            const userId = user?.id || user?._id || user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(audiobookId)) {
                res.status(400).json({ message: "Invalid audiobook ID" });
                return;
            }

            const review = await reviewService.getUserReviewForAudiobook(userId, audiobookId);
            if (!review) {
                res.status(404).json({ message: "Review not found" });
                return;
            }

            res.status(200).json(review);
        } catch (error) {
            console.error("Error fetching user review:", error);
            res.status(500).json({ message: "Failed to fetch user review" });
        }
    }

    async deleteReview(req: Request, res: Response) {
        try {
            const audiobookId = req.params.audiobookId as string;
            const user = req.user as any;
            const userId = user?.id || user?._id || user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(audiobookId)) {
                res.status(400).json({ message: "Invalid audiobook ID" });
                return;
            }

            const success = await reviewService.deleteReview(userId, audiobookId);
            if (!success) {
                res.status(404).json({ message: "Review not found" });
                return;
            }

            res.status(200).json({ message: "Review deleted successfully" });
        } catch (error) {
            console.error("Error deleting review:", error);
            res.status(500).json({ message: "Failed to delete review" });
        }
    }
}

export const reviewController = new ReviewController();
