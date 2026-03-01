import { Review, IReview } from "../models/Review.model";
import { Audiobook } from "../models/Audiobook.model";
import mongoose from "mongoose";

export class ReviewService {
    async createReview(userId: string, audiobookId: string, rating: number, text?: string): Promise<IReview> {
        const review = new Review({
            userId: new mongoose.Types.ObjectId(userId),
            audiobookId: new mongoose.Types.ObjectId(audiobookId),
            rating,
            text,
        });

        await review.save();
        await this.updateAudiobookRating(audiobookId);
        return review;
    }

    async getReviewsForAudiobook(audiobookId: string, limit: number = 20, skip: number = 0): Promise<IReview[]> {
        return await Review.find({ audiobookId: new mongoose.Types.ObjectId(audiobookId) })
            .populate("userId", "name profilePictureUrl")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
    }

    async getUserReviewForAudiobook(userId: string, audiobookId: string): Promise<IReview | null> {
        return await Review.findOne({
            userId: new mongoose.Types.ObjectId(userId),
            audiobookId: new mongoose.Types.ObjectId(audiobookId),
        });
    }

    async updateReview(userId: string, audiobookId: string, rating: number, text?: string): Promise<IReview | null> {
        const review = await Review.findOneAndUpdate(
            { userId: new mongoose.Types.ObjectId(userId), audiobookId: new mongoose.Types.ObjectId(audiobookId) },
            { $set: { rating, text } },
            { new: true }
        );

        if (review) {
            await this.updateAudiobookRating(audiobookId);
        }
        return review;
    }

    async deleteReview(userId: string, audiobookId: string): Promise<boolean> {
        const result = await Review.deleteOne({
            userId: new mongoose.Types.ObjectId(userId),
            audiobookId: new mongoose.Types.ObjectId(audiobookId),
        });

        if (result.deletedCount === 1) {
            await this.updateAudiobookRating(audiobookId);
            return true;
        }
        return false;
    }

    private async updateAudiobookRating(audiobookId: string) {
        const stats = await Review.aggregate([
            { $match: { audiobookId: new mongoose.Types.ObjectId(audiobookId) } },
            { $group: { _id: "$audiobookId", averageRating: { $avg: "$rating" }, reviewsCount: { $sum: 1 } } }
        ]);

        if (stats.length > 0) {
            await Audiobook.findByIdAndUpdate(audiobookId, {
                averageRating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal place
                reviewsCount: stats[0].reviewsCount,
            });
        } else {
            await Audiobook.findByIdAndUpdate(audiobookId, {
                averageRating: 0,
                reviewsCount: 0,
            });
        }
    }
}

export const reviewService = new ReviewService();
