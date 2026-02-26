import mongoose, { Document, Schema } from "mongoose";

export interface IAudiobook extends Document {
  title: string;
  author: string;
  description?: string;
  categoryId: mongoose.Types.ObjectId;
  audioUrl: string;       // Cloudinary URL
  audioPublicId: string;  // We save this so we can delete it from Cloudinary later
  coverImageUrl?: string; // Optional cover image
  coverImagePublicId?: string; // Cloudinary public ID for the cover image
  durationInSeconds?: number;
  likesCount: number;
  commentsCount: number;
}

const AudiobookSchema = new Schema<IAudiobook>(
  {
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    description: { type: String },
    categoryId: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    audioUrl: { type: String, required: true },
    audioPublicId: { type: String, required: true },
    coverImageUrl: { type: String },
    coverImagePublicId: { type: String },
    durationInSeconds: { type: Number },
    likesCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Audiobook = mongoose.model<IAudiobook>("Audiobook", AudiobookSchema);
