import Joi from "joi";

export const createAppLinkSchema = Joi.object({
    platform: Joi.string().required().trim().min(2).max(50),
    url: Joi.string().uri().required().trim(),
    isActive: Joi.boolean().optional(),
});

export const updateAppLinkSchema = Joi.object({
    platform: Joi.string().optional().trim().min(2).max(50),
    url: Joi.string().uri().optional().trim(),
    isActive: Joi.boolean().optional(),
});
