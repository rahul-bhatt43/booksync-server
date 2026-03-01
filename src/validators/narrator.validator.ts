import Joi from "joi";

export const createNarratorSchema = Joi.object({
    name: Joi.string().required().trim().min(2).max(100),
    biography: Joi.string().optional().allow(""),
});

export const updateNarratorSchema = Joi.object({
    name: Joi.string().optional().trim().min(2).max(100),
    biography: Joi.string().optional().allow(""),
});
