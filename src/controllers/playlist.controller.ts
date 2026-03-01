import { Request, Response } from "express";
import { playlistService } from "../services/playlist.service";
import mongoose from "mongoose";

export class PlaylistController {
    async createPlaylist(req: Request, res: Response) {
        try {
            const { name, description, isPublic } = req.body;
            const user = req.user as any;
            const userId = user?.id || user?._id || user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            if (!name) {
                res.status(400).json({ message: "Playlist name is required" });
                return;
            }

            const playlist = await playlistService.createPlaylist(userId, name, description, isPublic);
            res.status(201).json(playlist);
        } catch (error) {
            console.error("Error creating playlist:", error);
            res.status(500).json({ message: "Failed to create playlist" });
        }
    }

    async getPlaylist(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: "Invalid playlist ID" });
                return;
            }

            const playlist = await playlistService.getPlaylistById(id);

            if (!playlist) {
                res.status(404).json({ message: "Playlist not found" });
                return;
            }

            // Check access: must be public OR owned by the requesting user
            const user = req.user as any;
            const reqUserId = user?.id || user?._id?.toString() || user?.userId;
            const isOwner = reqUserId && playlist.userId.toString() === reqUserId.toString();
            if (!playlist.isPublic && !isOwner) {
                res.status(403).json({ message: "Access denied" });
                return;
            }

            res.status(200).json(playlist);
        } catch (error) {
            console.error("Error fetching playlist:", error);
            res.status(500).json({ message: "Failed to fetch playlist" });
        }
    }

    async getUserPlaylists(req: Request, res: Response) {
        try {
            const user = req.user as any;
            const userId = user?.id || user?._id || user?.userId;
            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            const playlists = await playlistService.getUserPlaylists(userId);
            res.status(200).json(playlists);
        } catch (error) {
            console.error("Error fetching user playlists:", error);
            res.status(500).json({ message: "Failed to fetch playlists" });
        }
    }

    async updatePlaylist(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { name, description, isPublic } = req.body;
            const user = req.user as any;
            const userId = user?.id || user?._id || user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: "Invalid playlist ID" });
                return;
            }

            const playlist = await playlistService.updatePlaylist(id, userId, { name, description, isPublic });
            if (!playlist) {
                res.status(404).json({ message: "Playlist not found or access denied" });
                return;
            }

            res.status(200).json(playlist);
        } catch (error) {
            console.error("Error updating playlist:", error);
            res.status(500).json({ message: "Failed to update playlist" });
        }
    }

    async deletePlaylist(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const user = req.user as any;
            const userId = user?.id || user?._id || user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(id)) {
                res.status(400).json({ message: "Invalid playlist ID" });
                return;
            }

            const success = await playlistService.deletePlaylist(id, userId);
            if (!success) {
                res.status(404).json({ message: "Playlist not found or access denied" });
                return;
            }

            res.status(200).json({ message: "Playlist deleted successfully" });
        } catch (error) {
            console.error("Error deleting playlist:", error);
            res.status(500).json({ message: "Failed to delete playlist" });
        }
    }

    async addAudiobook(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { audiobookId } = req.body;
            const user = req.user as any;
            const userId = user?.id || user?._id || user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(audiobookId)) {
                res.status(400).json({ message: "Invalid IDs" });
                return;
            }

            const playlist = await playlistService.addAudiobookToPlaylist(id, userId, audiobookId);
            if (!playlist) {
                res.status(404).json({ message: "Playlist not found or access denied" });
                return;
            }

            res.status(200).json(playlist);
        } catch (error) {
            console.error("Error adding audiobook to playlist:", error);
            res.status(500).json({ message: "Failed to add audiobook" });
        }
    }

    async removeAudiobook(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const audiobookId = req.params.audiobookId as string;
            const user = req.user as any;
            const userId = user?.id || user?._id || user?.userId;

            if (!userId) {
                res.status(401).json({ message: "Unauthorized" });
                return;
            }

            if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(audiobookId)) {
                res.status(400).json({ message: "Invalid IDs" });
                return;
            }

            const playlist = await playlistService.removeAudiobookFromPlaylist(id, userId, audiobookId);
            if (!playlist) {
                res.status(404).json({ message: "Playlist not found or access denied" });
                return;
            }

            res.status(200).json(playlist);
        } catch (error) {
            console.error("Error removing audiobook from playlist:", error);
            res.status(500).json({ message: "Failed to remove audiobook" });
        }
    }
}

export const playlistController = new PlaylistController();
