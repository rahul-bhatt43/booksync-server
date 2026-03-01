import mongoose, { Document, Schema } from "mongoose";

export interface IAppLink extends Document {
    platform: string; // e.g., 'ios', 'android', 'web'
    url: string;
    isActive: boolean;
}

const AppLinkSchema = new Schema<IAppLink>(
    {
        platform: { type: String, required: true, unique: true, trim: true, lowercase: true },
        url: { type: String, required: true, trim: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export const AppLink = mongoose.model<IAppLink>("AppLink", AppLinkSchema);
