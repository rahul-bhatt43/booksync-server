import { Request, Response, NextFunction } from "express";
import { User } from "../models/User.model";
import { Like } from "../models/Like.model";
import { ListeningHistory } from "../models/ListeningHistory.model";

export class UserController {

    static async getProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const userParamId = req.params.id;
            const isSelf = req.user && req.user._id.toString() === userParamId;

            const user = await User.findById(userParamId).select("-password -role");
            if (!user) {
                res.status(404);
                throw new Error("User not found");
            }

            // Fetch user's public activity: likes
            const likes = await Like.find({ user: userParamId })
                .populate({
                    path: "audiobook",
                    select: "title authorId coverImageUrl",
                    populate: { path: "authorId", select: "name" }
                })
                .sort({ createdAt: -1 })
                .limit(10);

            let history: any[] = [];

            // Only fetch history if the user is requesting their own profile
            if (isSelf) {
                history = await ListeningHistory.find({ user: userParamId })
                    .populate({
                        path: "audiobook",
                        select: "title authorId coverImageUrl durationInSeconds",
                        populate: { path: "authorId", select: "name" }
                    })
                    .sort({ lastListenedAt: -1 })
                    .limit(10);
            }

            res.status(200).json({
                success: true,
                data: {
                    user,
                    likes,
                    history: isSelf ? history : undefined
                }
            });
        } catch (error) {
            next(error);
        }
    }
}
