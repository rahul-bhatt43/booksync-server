import Joi from "joi";

export const registerSchema = Joi.object({
    name: Joi.string().required().trim().min(2).max(50),
    email: Joi.string().required().email().trim().lowercase(),
    password: Joi.string().required().min(6),
    role: Joi.string().valid("user").optional(), // Prevent users from registering as admin
});

export const loginSchema = Joi.object({
    email: Joi.string().required().email().trim().lowercase(),
    password: Joi.string().required(),
});
