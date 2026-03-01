import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
    userId: mongoose.Types.ObjectId;
    audiobookId: mongoose.Types.ObjectId;
    rating: number; // 1 to 5
    text?: string;
}

const ReviewSchema = new Schema<IReview>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        audiobookId: { type: Schema.Types.ObjectId, ref: "Audiobook", required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        text: { type: String, trim: true, maxlength: 1000 },
    },
    { timestamps: true }
);

// Ensure a user can only review an audiobook once
ReviewSchema.index({ userId: 1, audiobookId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
