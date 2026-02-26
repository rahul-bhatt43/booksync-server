import Joi from "joi";

export const createCategorySchema = Joi.object({
    name: Joi.string().required().trim().min(2).max(50),
    description: Joi.string().optional().allow(""),
});

export const updateCategorySchema = Joi.object({
    name: Joi.string().optional().trim().min(2).max(50),
    description: Joi.string().optional().allow(""),
});
