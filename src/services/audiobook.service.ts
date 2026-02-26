import { Audiobook } from "../models/Audiobook.model";
import { CloudinaryService } from "./cloudinary.service";
import { Like } from "../models/Like.model";
import { Comment } from "../models/Comment.model";

export class AudiobookService {
  static async createAudiobook(data: any, audioFile: Express.Multer.File, coverImageFile?: Express.Multer.File) {
    if (!audioFile) throw new Error("Audio file is required");

    // 1. Upload the audio buffer to Cloudinary
    const uploadResult: any = await CloudinaryService.uploadAudio(audioFile.buffer);

    let coverImageUrl;
    let coverImagePublicId;

    // 2. Upload cover image if provided
    if (coverImageFile) {
      const coverUploadResult: any = await CloudinaryService.uploadImage(coverImageFile.buffer);
      coverImageUrl = coverUploadResult.secure_url;
      coverImagePublicId = coverUploadResult.public_id;
    }

    // 3. Save the metadata and the Cloudinary secure URL to MongoDB
    const audiobook = new Audiobook({
      title: data.title,
      author: data.author,
      description: data.description,
      categoryId: data.categoryId,
      audioUrl: uploadResult.secure_url,
      audioPublicId: uploadResult.public_id,
      coverImageUrl,
      coverImagePublicId,
      durationInSeconds: uploadResult.duration, // Cloudinary nicely provides audio duration!
    });

    await audiobook.save();
    return audiobook;
  }

  static async getAllAudiobooks(filters: any = {}) {
    const query: any = {};

    if (filters.categoryId) {
      const categories = Array.isArray(filters.categoryId)
        ? filters.categoryId
        : (filters.categoryId as string).split(',');
      query.categoryId = { $in: categories };
    }

    if (filters.search) {
      query.$or = [
        { title: { $regex: filters.search, $options: "i" } },
        { author: { $regex: filters.search, $options: "i" } },
      ];
    }

    return Audiobook.find(query).populate("categoryId", "name").sort({ createdAt: -1 });
  }

  static async getAudiobookById(id: string, userId?: string) {
    const audiobook = await Audiobook.findById(id).populate("categoryId", "name");
    if (!audiobook) throw new Error("Audiobook not found");

    let isLikedByUser = false;
    let userComments: any[] = [];

    if (userId) {
      const like = await Like.findOne({ user: userId, audiobook: id });
      isLikedByUser = !!like;
      userComments = await Comment.find({ user: userId, audiobook: id }).sort({ createdAt: -1 });
    }

    return {
      ...audiobook.toObject(),
      isLikedByUser,
      userComments,
    };
  }

  static async updateAudiobook(id: string, data: any) {
    const audiobook = await Audiobook.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    if (!audiobook) throw new Error("Audiobook not found");
    return audiobook;
  }

  static async deleteAudiobook(id: string) {
    const audiobook = await Audiobook.findById(id);
    if (!audiobook) throw new Error("Audiobook not found");

    // 1. Delete the actual audio file from Cloudinary
    await CloudinaryService.deleteFile(audiobook.audioPublicId, "video");

    // 2. Delete the cover image if exists
    if (audiobook.coverImagePublicId) {
      await CloudinaryService.deleteFile(audiobook.coverImagePublicId, "image");
    }

    // 3. Remove the record from the database
    await audiobook.deleteOne();
  }
}
