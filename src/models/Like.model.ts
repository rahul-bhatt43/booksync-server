import mongoose, { Document, Schema } from "mongoose";

export interface ILike extends Document {
    user: mongoose.Types.ObjectId;
    audiobook: mongoose.Types.ObjectId;
}

const LikeSchema = new Schema<ILike>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        audiobook: { type: Schema.Types.ObjectId, ref: "Audiobook", required: true },
    },
    { timestamps: true }
);

// Ensure a user can only like a specific audiobook once
LikeSchema.index({ user: 1, audiobook: 1 }, { unique: true });

export const Like = mongoose.model<ILike>("Like", LikeSchema);
