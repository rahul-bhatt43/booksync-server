import multer from "multer";

// We use memoryStorage so the file buffer is available for Cloudinary upload
// instead of saving it directly to your server's disk.
const storage = multer.memoryStorage();

// Add a filter if you only want to accept certain audio formats
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.startsWith("audio/") || file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Unsupported file format"));
  }
};

export const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for audiobooks
  },
  fileFilter,
});
