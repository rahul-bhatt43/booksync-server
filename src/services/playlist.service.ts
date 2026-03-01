import { Playlist, IPlaylist } from "../models/Playlist.model";
import mongoose from "mongoose";

export class PlaylistService {
    async createPlaylist(
        userId: string,
        name: string,
        description?: string,
        isPublic: boolean = false
    ): Promise<IPlaylist> {
        const playlist = new Playlist({
            userId: new mongoose.Types.ObjectId(userId),
            name,
            description,
            isPublic,
            audiobooks: [],
        });
        return await playlist.save();
    }

    async getPlaylistById(playlistId: string): Promise<IPlaylist | null> {
        return await Playlist.findById(playlistId).populate("audiobooks");
    }

    async getUserPlaylists(userId: string): Promise<IPlaylist[]> {
        return await Playlist.find({ userId: new mongoose.Types.ObjectId(userId) }).populate("audiobooks");
    }

    async getPublicPlaylists(): Promise<IPlaylist[]> {
        return await Playlist.find({ isPublic: true }).populate("userId", "name profilePictureUrl").populate("audiobooks").limit(50);
    }

    async updatePlaylist(
        playlistId: string,
        userId: string,
        updateData: Partial<IPlaylist>
    ): Promise<IPlaylist | null> {
        return await Playlist.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(playlistId), userId: new mongoose.Types.ObjectId(userId) },
            { $set: updateData },
            { new: true }
        );
    }

    async deletePlaylist(playlistId: string, userId: string): Promise<boolean> {
        const result = await Playlist.deleteOne({
            _id: new mongoose.Types.ObjectId(playlistId),
            userId: new mongoose.Types.ObjectId(userId),
        });
        return result.deletedCount === 1;
    }

    async addAudiobookToPlaylist(playlistId: string, userId: string, audiobookId: string): Promise<IPlaylist | null> {
        return await Playlist.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(playlistId), userId: new mongoose.Types.ObjectId(userId) },
            { $addToSet: { audiobooks: new mongoose.Types.ObjectId(audiobookId) } }, // Prevents duplicates
            { new: true }
        );
    }

    async removeAudiobookFromPlaylist(playlistId: string, userId: string, audiobookId: string): Promise<IPlaylist | null> {
        return await Playlist.findOneAndUpdate(
            { _id: new mongoose.Types.ObjectId(playlistId), userId: new mongoose.Types.ObjectId(userId) },
            { $pull: { audiobooks: new mongoose.Types.ObjectId(audiobookId) } },
            { new: true }
        );
    }
}

export const playlistService = new PlaylistService();
