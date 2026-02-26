import { Request, Response, NextFunction } from "express";
import { InteractionService } from "../services/interaction.service";

export class InteractionController {

    static async addComment(req: Request, res: Response, next: NextFunction) {
        try {
            const comment = await InteractionService.addComment(
                req.user!._id.toString(),
                req.params.id as string,
                req.body.text
            );
            res.status(201).json({ success: true, data: comment });
        } catch (error) {
            next(error);
        }
    }

    static async deleteComment(req: Request, res: Response, next: NextFunction) {
        try {
            await InteractionService.deleteComment(req.params.commentId as string, req.user!._id.toString());
            res.status(200).json({ success: true, message: "Comment deleted" });
        } catch (error) {
            next(error);
        }
    }

    static async getComments(req: Request, res: Response, next: NextFunction) {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;

            const result = await InteractionService.getCommentsForAudiobook(req.params.id as string, page, limit);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }

    static async toggleLike(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await InteractionService.toggleLike(req.user!._id.toString(), req.params.id as string);
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    }
}
