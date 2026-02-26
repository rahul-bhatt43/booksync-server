import { Request, Response, NextFunction } from "express";
import { Category } from "../models/Category.model";

export const categoryController = {
    async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const { name, description } = req.body;
            const category = await Category.create({ name, description });

            res.status(201).json({
                success: true,
                data: category,
            });
        } catch (error) {
            next(error);
        }
    },

    async getCategories(req: Request, res: Response, next: NextFunction) {
        try {
            const categories = await Category.find();
            res.status(200).json({
                success: true,
                data: categories,
            });
        } catch (error) {
            next(error);
        }
    },

    async updateCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!category) {
                res.status(404);
                throw new Error("Category not found");
            }

            res.status(200).json({
                success: true,
                data: category,
            });
        } catch (error) {
            next(error);
        }
    },

    async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const category = await Category.findByIdAndDelete(req.params.id);

            if (!category) {
                res.status(404);
                throw new Error("Category not found");
            }

            res.status(200).json({
                success: true,
                data: {},
            });
        } catch (error) {
            next(error);
        }
    },
};
