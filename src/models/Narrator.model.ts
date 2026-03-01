import mongoose, { Document, Schema } from "mongoose";

export interface INarrator extends Document {
    name: string;
    biography?: string;
    imageUrl?: string;
    imagePublicId?: string;
}

const NarratorSchema = new Schema<INarrator>(
    {
        name: { type: String, required: true, trim: true, unique: true },
        biography: { type: String, trim: true },
        imageUrl: { type: String },
        imagePublicId: { type: String },
    },
    { timestamps: true }
);

export const Narrator = mongoose.model<INarrator>("Narrator", NarratorSchema);
