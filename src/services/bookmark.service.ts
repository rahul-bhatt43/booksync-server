import { Bookmark, IBookmark } from "../models/Bookmark.model";
import mongoose from "mongoose";

export class BookmarkService {
    async createBookmark(userId: string, audiobookId: string, timestamp: number, note?: string): Promise<IBookmark> {
        const bookmark = new Bookmark({
            userId: new mongoose.Types.ObjectId(userId),
            audiobookId: new mongoose.Types.ObjectId(audiobookId),
            timestamp,
            note,
        });
        return await bookmark.save();
    }

    async getBookmarksForAudiobook(userId: string, audiobookId: string): Promise<IBookmark[]> {
        return await Bookmark.find({
            userId: new mongoose.Types.ObjectId(userId),
            audiobookId: new mongoose.Types.ObjectId(audiobookId),
        }).sort({ timestamp: 1 });
    }

    async updateBookmark(bookmarkId: string, userId: string, timestamp?: number, note?: string): Promise<IBookmark | null> {
        const updates: Partial<IBookmark> = {};
        if (timestamp !== undefined) updates.timestamp = timestamp;
        if (note !== undefined) updates.note = note;

        return await Bookmark.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(bookmarkId), userId: new mongoose.Types.ObjectId(userId) },
            { $set: updates },
            { new: true }
        );
    }

    async deleteBookmark(bookmarkId: string, userId: string): Promise<boolean> {
        const result = await Bookmark.deleteOne({
            _id: new mongoose.Types.ObjectId(bookmarkId),
            userId: new mongoose.Types.ObjectId(userId),
        });
        return result.deletedCount === 1;
    }
}

export const bookmarkService = new BookmarkService();
