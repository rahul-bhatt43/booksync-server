import mongoose, { Document, Schema } from "mongoose";

export interface IAudiobook extends Document {
  title: string;
  authorId: mongoose.Types.ObjectId;
  narratorId?: mongoose.Types.ObjectId;
  description?: string;
  categoryId: mongoose.Types.ObjectId;
  audioUrl: string;       // Cloudinary URL
  audioPublicId: string;  // We save this so we can delete it from Cloudinary later
  coverImageUrl?: string; // Optional cover image
  coverImagePublicId?: string; // Cloudinary public ID for the cover image
  durationInSeconds?: number;
  averageRating: number;
  reviewsCount: number;
  likesCount: number;
  commentsCount: number;
}

const AudiobookSchema = new Schema<IAudiobook>(
  {
    title: { type: String, required: true, trim: true },
    authorId: { type: Schema.Types.ObjectId, ref: "Author", required: true },
    narratorId: { type: Schema.Types.ObjectId, ref: "Narrator" },
    description: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    audioUrl: { type: String, required: true },
    audioPublicId: { type: String, required: true },
    coverImageUrl: { type: String },
    coverImagePublicId: { type: String },
    durationInSeconds: { type: Number },
    averageRating: { type: Number, default: 0 },
    reviewsCount: { type: Number, default: 0 },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Audiobook = mongoose.model<IAudiobook>("Audiobook", AudiobookSchema);
