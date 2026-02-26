import mongoose, { Document, Schema } from "mongoose";

export interface IListeningHistory extends Document {
    user: mongoose.Types.ObjectId;
    audiobook: mongoose.Types.ObjectId;
    progressInSeconds: number;
    isCompleted: boolean;
    lastListenedAt: Date;
}

const ListeningHistorySchema = new Schema<IListeningHistory>(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        audiobook: { type: Schema.Types.ObjectId, ref: "Audiobook", required: true },
        progressInSeconds: { type: Number, default: 0 },
        isCompleted: { type: Boolean, default: false },
        lastListenedAt: { type: Date, default: Date.now },
    },
    { timestamps: true }
);

// One progress record per user per audiobook
ListeningHistorySchema.index({ user: 1, audiobook: 1 }, { unique: true });

export const ListeningHistory = mongoose.model<IListeningHistory>("ListeningHistory", ListeningHistorySchema);
