import { Request, Response } from "express";
import { bookmarkService } from "../services/bookmark.service";
import mongoose from "mongoose";

export class BookmarkController {
    async createBookmark(req: Request, res: Response) {
        try {
            const { timestamp, note } = req.body;
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

            if (typeof timestamp !== "number" || timestamp < 0) {
                res.status(400).json({ message: "A valid positive timestamp in seconds is required" });
                return;
            }

            const bookmark = await bookmarkService.createBookmark(userId, audiobookId, timestamp, note);
            res.status(201).json(bookmark);
        } catch (error: any) {
            console.error("Error creating bookmark:", error);
            if (error.code === 11000) {
                res.status(409).json({ message: "A bookmark at this exact timestamp already exists." });
                return;
            }
            res.status(500).json({ message: "Failed to create bookmark" });
        }
    }

    async getBookmarks(req: Request, res: Response) {
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

            const bookmarks = await bookmarkService.getBookmarksForAudiobook(userId, audiobookId);
            res.status(200).json(bookmarks);
        } catch (error) {
            console.error("Error fetching bookmarks:", error);
            res.status(500).json({ message: "Failed to fetch bookmarks" });
        }
    }

    async updateBookmark(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { timestamp, note } = req.body;
            const user = req.user as any;
            const userId = user?.id || user?._id || user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: "Invalid bookmark ID" });
                return;
            }

            const bookmark = await bookmarkService.updateBookmark(id, userId, timestamp, note);
            if (!bookmark) {
                res.status(404).json({ message: "Bookmark not found or access denied" });
                return;
            }

            res.status(200).json(bookmark);
        } catch (error) {
            console.error("Error updating bookmark:", error);
            res.status(500).json({ message: "Failed to update bookmark" });
        }
    }

    async deleteBookmark(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const user = req.user as any;
            const userId = user?.id || user?._id || user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: "Invalid bookmark ID" });
                return;
            }

            const success = await bookmarkService.deleteBookmark(id, userId);
            if (!success) {
                res.status(404).json({ message: "Bookmark not found or access denied" });
                return;
            }

            res.status(200).json({ message: "Bookmark deleted successfully" });
        } catch (error) {
            console.error("Error deleting bookmark:", error);
            res.status(500).json({ message: "Failed to delete bookmark" });
        }
    }
}

export const bookmarkController = new BookmarkController();
