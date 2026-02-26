import mongoose, { Document, Schema } from "mongoose";

export interface IComment extends Document {
    user: mongoose.Types.ObjectId;
    audiobook: mongoose.Types.ObjectId;
    text: string;
}

const CommentSchema = new Schema<IComment>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        audiobook: { type: Schema.Types.ObjectId, ref: "Audiobook", required: true },
        text: { type: String, required: true, trim: true },
    },
    { timestamps: true }
);

export const Comment = mongoose.model<IComment>("Comment", CommentSchema);
