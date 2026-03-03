import { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";

export const authController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.registerUser(req.body);
            res.status(201).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.loginUser(req.body);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.forgotPassword(req.body.email);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.resetPassword(req.params.token as string, req.body.password);
            res.status(200).json({
                success: true,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    },
};
