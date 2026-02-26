import { Comment } from "../models/Comment.model";
import { Like } from "../models/Like.model";
import { Audiobook } from "../models/Audiobook.model";

export class InteractionService {
    static async addComment(userId: string, audiobookId: string, text: string) {
        const comment = await Comment.create({
            user: userId,
            audiobook: audiobookId,
            text,
        });

        // Update audiobook comment count
        await Audiobook.findByIdAndUpdate(audiobookId, { $inc: { commentsCount: 1 } });

        return comment.populate("user", "name profilePictureUrl");
    }

    static async deleteComment(commentId: string, userId: string) {
        console.log("commentId", commentId);
        console.log("userId", userId);
        
        const comment = await Comment.findById(commentId);
        if (!comment) {
            throw Object.assign(new Error("Comment not found"), { statusCode: 404 });
        }

        // Check ownership
        if (comment.user.toString() !== userId) {
            throw Object.assign(new Error("Not authorized to delete this comment"), { statusCode: 403 });
        }

        await comment.deleteOne();

        // Update audiobook comment count
        await Audiobook.findByIdAndUpdate(comment.audiobook, { $inc: { commentsCount: -1 } });

        return true;
    }

    static async getCommentsForAudiobook(audiobookId: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit;

        const comments = await Comment.find({ audiobook: audiobookId })
            .populate("user", "name profilePictureUrl")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Comment.countDocuments({ audiobook: audiobookId });

        return {
            comments,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
            },
        };
    }

    static async toggleLike(userId: string, audiobookId: string) {
        const existingLike = await Like.findOne({ user: userId, audiobook: audiobookId });

        if (existingLike) {
            // Unlike
            await existingLike.deleteOne();
            await Audiobook.findByIdAndUpdate(audiobookId, { $inc: { likesCount: -1 } });
            return { liked: false };
        } else {
            // Like
            await Like.create({ user: userId, audiobook: audiobookId });
            await Audiobook.findByIdAndUpdate(audiobookId, { $inc: { likesCount: 1 } });
            return { liked: true };
        }
    }
}
