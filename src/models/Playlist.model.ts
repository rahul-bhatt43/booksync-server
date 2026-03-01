import mongoose, { Document, Schema } from "mongoose";

export interface IPlaylist extends Document {
    name: string;
    description?: string;
    userId: mongoose.Types.ObjectId;
    audiobooks: mongoose.Types.ObjectId[];
    isPublic: boolean;
}

const PlaylistSchema = new Schema<IPlaylist>(
    {
        name: { type: String, required: true, trim: true },
        description: { type: String, trim: true },
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        audiobooks: [{ type: Schema.Types.ObjectId, ref: "Audiobook" }],
        isPublic: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export const Playlist = mongoose.model<IPlaylist>("Playlist", PlaylistSchema);
