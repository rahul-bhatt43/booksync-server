import { Request, Response, NextFunction } from "express";
import { HistoryService } from "../services/history.service";

export class HistoryController {

    static async updateProgress(req: Request, res: Response, next: NextFunction) {
        try {
            const { audiobookId, progressInSeconds, isCompleted } = req.body;

            if (!audiobookId || progressInSeconds === undefined) {
                res.status(400);
                throw new Error("audiobookId and progressInSeconds are required");
            }

            const history = await HistoryService.updateProgress(
                req.user!._id.toString(),
                audiobookId,
                progressInSeconds,
                isCompleted || false
            );

            res.status(200).json({ success: true, data: history });
        } catch (error) {
            next(error);
        }
    }

    static async getHistory(req: Request, res: Response, next: NextFunction) {
        try {
            const history = await HistoryService.getUserHistory(req.user!._id.toString());
            res.status(200).json({ success: true, data: history });
        } catch (error) {
            next(error);
        }
    }
}
