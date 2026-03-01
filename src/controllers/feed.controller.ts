import { Request, Response, NextFunction } from "express";
import { Audiobook } from "../models/Audiobook.model";
import { Author } from "../models/Author.model";
import { Category } from "../models/Category.model";
import { ListeningHistory } from "../models/ListeningHistory.model";

export class FeedController {

    static async getHomeFeed(req: Request, res: Response, next: NextFunction) {
        try {
            const latest = await Audiobook.find()
                .sort({ createdAt: -1 })
                .limit(10)
                .populate("categoryId", "name")
                .populate("authorId", "name imageUrl");

            const popular = await Audiobook.find()
                .sort({ likesCount: -1, commentsCount: -1 })
                .limit(10)
                .populate("categoryId", "name")
                .populate("authorId", "name imageUrl");

            let continueListening: any[] = [];

            // If user is authenticated, fetch their listening history
            if (req.user) {
                const history = await ListeningHistory.find({
                    user: req.user._id,
                    isCompleted: false
                })
                    .sort({ lastListenedAt: -1 })
                    .limit(5)
                    .populate({
                        path: "audiobook",
                        populate: { path: "authorId", select: "name imageUrl" }
                    });

                continueListening = history.map(h => ({
                    progressInSeconds: h.progressInSeconds,
                    lastListenedAt: h.lastListenedAt,
                    audiobook: h.audiobook
                }));
            }

            const categories = await Category.find().limit(5);

            res.status(200).json({
                success: true,
                data: {
                    continueListening,
                    latest,
                    popular,
                    categories
                }
            });
        } catch (error) {
            next(error);
        }
    }

    static async search(req: Request, res: Response, next: NextFunction) {
        try {
            const q = req.query.q as string;
            if (!q) {
                res.status(400).json({ success: false, message: "Search query is required" });
                return;
            }

            const matchingAuthors = await Author.find({ name: { $regex: q, $options: "i" } }).select('_id');
            const authorIds = matchingAuthors.map(a => a._id);

            // Search in audiobooks title and authorId
            const audiobooks = await Audiobook.find({
                $or: [
                    { title: { $regex: q, $options: "i" } },
                    { authorId: { $in: authorIds } }
                ]
            })
                .populate("categoryId", "name")
                .populate("authorId", "name imageUrl");

            // Search categories
            const categories = await Category.find({
                name: { $regex: q, $options: "i" }
            });

            res.status(200).json({
                success: true,
                data: {
                    audiobooks,
                    categories
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
