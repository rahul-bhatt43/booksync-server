import Joi from "joi";

export const createAuthorSchema = Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    biography: Joi.string().optional().allow(""),
});

export const updateAuthorSchema = Joi.object({
    name: Joi.string().optional().trim().min(2).max(100),
    biography: Joi.string().optional().allow(""),
});
