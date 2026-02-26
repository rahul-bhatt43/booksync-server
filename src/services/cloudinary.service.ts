import cloudinary from "../config/cloudinary";

export class CloudinaryService {
  /**
   * Upload an audio file buffer to Cloudinary and return the safe URL
   */
  static async uploadAudio(fileBuffer: Buffer, folderName: string = "audiobooks") {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "video", // Cloudinary treats audio as "video" for resource typing
          folder: folderName,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Trigger the stream
      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Upload an image file buffer to Cloudinary
   */
  static async uploadImage(fileBuffer: Buffer, folderName: string = "audiobooks/covers") {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "image",
          folder: folderName,
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );

      // Trigger the stream
      uploadStream.end(fileBuffer);
    });
  }

  /**
   * Delete a file from Cloudinary (used if an audiobook is destroyed)
   */
  static async deleteFile(publicId: string, resourceType: "video" | "image" = "video") {
    try {
      if (!publicId) return true;
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
      return true;
    } catch (error) {
      console.error(`Failed to delete file from cloudinary: ${publicId}`, error);
      return false;
    }
  }
}
