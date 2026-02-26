import { ListeningHistory } from "../models/ListeningHistory.model";

export class HistoryService {
    static async updateProgress(userId: string, audiobookId: string, progressInSeconds: number, isCompleted: boolean) {
        const history = await ListeningHistory.findOneAndUpdate(
            { user: userId, audiobook: audiobookId },
            {
                progressInSeconds,
                isCompleted,
                lastListenedAt: new Date()
            },
            { new: true, upsert: true }
        );
        return history;
    }

    static async getUserHistory(userId: string) {
        // Return history sorted by most recently listened
        // Populate audiobook details to show in UI
        const history = await ListeningHistory.find({ user: userId })
            .populate({
                path: "audiobook",
                select: "title author coverImageUrl durationInSeconds",
            })
            .sort({ lastListenedAt: -1 });

        return history;
    }
}
