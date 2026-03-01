import { Request, Response, NextFunction } from "express";
import { AuthorService } from "../services/author.service";

export class AuthorController {
    static async create(req: Request, res: Response, next: NextFunction) {
        try {
            const imageFile = req.file;
            const author = await AuthorService.createAuthor(req.body, imageFile);
            res.status(201).json({ success: true, data: author });
        } catch (error: any) {
            next(error);
        }
    }

    static async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const search = req.query.search as string;
            const authors = await AuthorService.getAllAuthors(search);
            res.status(200).json({ success: true, count: authors.length, data: authors });
        } catch (error: any) {
            next(error);
        }
    }

    static async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const author = await AuthorService.getAuthorById(req.params.id as string);
            res.status(200).json({ success: true, data: author });
        } catch (error: any) {
            next(error);
        }
    }

    static async update(req: Request, res: Response, next: NextFunction) {
        try {
            const imageFile = req.file;
            const author = await AuthorService.updateAuthor(req.params.id as string, req.body, imageFile);
            res.status(200).json({ success: true, data: author });
        } catch (error: any) {
            next(error);
        }
    }

    static async remove(req: Request, res: Response, next: NextFunction) {
        try {
            await AuthorService.deleteAuthor(req.params.id as string);
            res.status(200).json({ success: true, message: "Author deleted successfully" });
        } catch (error: any) {
            next(error);
        }
    }
}
