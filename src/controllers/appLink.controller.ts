import { Request, Response, NextFunction } from "express";
import { AppLinkService } from "../services/appLink.service";

export class AppLinkController {
    // Public endpoint
    static async getActiveLinks(req: Request, res: Response, next: NextFunction) {
        try {
            const activeLinks = await AppLinkService.getAllAppLinks(true);
            res.status(200).json({ success: true, count: activeLinks.length, data: activeLinks });
        } catch (error: any) {
            next(error);
        }
    }

    // Admin endpoints
    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const links = await AppLinkService.getAllAppLinks(false);
            res.status(200).json({ success: true, count: links.length, data: links });
        } catch (error: any) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const link = await AppLinkService.getAppLinkById(req.params.id as string);
            res.status(200).json({ success: true, data: link });
        } catch (error: any) {
            next(error);
        }
    }

    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const link = await AppLinkService.createAppLink(req.body);
            res.status(201).json({ success: true, data: link });
        } catch (error: any) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const link = await AppLinkService.updateAppLink(req.params.id as string, req.body);
            res.status(200).json({ success: true, data: link });
        } catch (error: any) {
            next(error);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            await AppLinkService.deleteAppLink(req.params.id as string);
            res.status(200).json({ success: true, message: "App link deleted successfully" });
        } catch (error: any) {
            next(error);
        }
    }
}
