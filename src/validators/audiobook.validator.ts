import Joi from "joi";

export const createAudiobookSchema = Joi.object({
  title: Joi.string().required().trim().min(2).max(100),
  author: Joi.string().required().trim().min(2).max(100),
  description: Joi.string().optional().allow(""),
  categoryId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/, "Valid Object ID"),
  // Files are validated by multer mostly, not Joi easily.
});

export const updateAudiobookSchema = Joi.object({
  title: Joi.string().optional().trim().min(2).max(100),
  author: Joi.string().optional().trim().min(2).max(100),
  description: Joi.string().optional().allow(""),
  categoryId: Joi.string().optional().regex(/^[0-9a-fA-F]{24}$/, "Valid Object ID"),
});

export const addCommentSchema = Joi.object({
  text: Joi.string().required().trim().min(1).max(500),
});

export const updateHistorySchema = Joi.object({
  audiobookId: Joi.string().required().regex(/^[0-9a-fA-F]{24}$/, "Valid Object ID"),
  progressInSeconds: Joi.number().required().min(0),
  isCompleted: Joi.boolean().optional(),
});
