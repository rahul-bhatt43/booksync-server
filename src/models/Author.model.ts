import mongoose, { Document, Schema } from "mongoose";

export interface IAuthor extends Document {
    name: string;
    biography?: string;
    imageUrl?: string;
    imagePublicId?: string;
}

const AuthorSchema = new Schema<IAuthor>(
    {
        name: { type: String, required: true, trim: true, unique: true },
        biography: { type: String, trim: true },
        imageUrl: { type: String },
        imagePublicId: { type: String },
    },
    { timestamps: true }
);

export const Author = mongoose.model<IAuthor>("Author", AuthorSchema);
