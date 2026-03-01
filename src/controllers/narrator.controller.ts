import { Request, Response, NextFunction } from "express";
import { NarratorService } from "../services/narrator.service";

export class NarratorController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const imageFile = req.file;
            const narrator = await NarratorService.createNarrator(req.body, imageFile);
            res.status(201).json({ success: true, data: narrator });
        } catch (error: any) {
            next(error);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const search = req.query.search as string;
            const narrators = await NarratorService.getAllNarrators(search);
            res.status(200).json({ success: true, count: narrators.length, data: narrators });
        } catch (error: any) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const narrator = await NarratorService.getNarratorById(req.params.id as string);
            res.status(200).json({ success: true, data: narrator });
        } catch (error: any) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const imageFile = req.file;
            const narrator = await NarratorService.updateNarrator(req.params.id as string, req.body, imageFile);
            res.status(200).json({ success: true, data: narrator });
        } catch (error: any) {
            next(error);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            await NarratorService.deleteNarrator(req.params.id as string);
            res.status(200).json({ success: true, message: "Narrator deleted successfully" });
        } catch (error: any) {
            next(error);
        }
    }
}
