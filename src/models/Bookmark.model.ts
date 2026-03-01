import mongoose, { Document, Schema } from "mongoose";

export interface IBookmark extends Document {
    userId: mongoose.Types.ObjectId;
    audiobookId: mongoose.Types.ObjectId;
    timestamp: number; // in seconds
    note?: string;
}

const BookmarkSchema = new Schema<IBookmark>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        audiobookId: { type: Schema.Types.ObjectId, ref: "Audiobook", required: true },
        timestamp: { type: Number, required: true, min: 0 },
        note: { type: String, trim: true, maxlength: 500 },
    },
    { timestamps: true }
);

// Optional: prevent exact duplicate timestamps per user per book
BookmarkSchema.index({ userId: 1, audiobookId: 1, timestamp: 1 }, { unique: true });

export const Bookmark = mongoose.model<IBookmark>("Bookmark", BookmarkSchema);
