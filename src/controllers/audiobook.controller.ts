import { Request, Response, NextFunction } from "express";
import { AudiobookService } from "../services/audiobook.service";

export class AudiobookController {

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const audioFile = files?.audioFile?.[0];
      const coverImageFile = files?.coverImage?.[0];

      if (!audioFile) {
        res.status(400);
        throw new Error("No audio file uploaded");
      }

      const audiobook = await AudiobookService.createAudiobook(req.body, audioFile, coverImageFile);

      res.status(201).json({ success: true, data: audiobook });
    } catch (error: any) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = {
        categoryId: req.query.categoryId,
        authorId: req.query.authorId,
        narratorId: req.query.narratorId,
        search: req.query.search,
      };

      const audiobooks = await AudiobookService.getAllAudiobooks(filters);
      res.status(200).json({ success: true, data: audiobooks });
    } catch (error: any) {
      next(error);
    }
  }

  static async getTrending(req: Request, res: Response, next: NextFunction) {
    try {
      const audiobooks = await AudiobookService.getTrendingAudiobooks();
      res.status(200).json({ success: true, data: audiobooks });
    } catch (error: any) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user?._id?.toString();
      const audiobook = await AudiobookService.getAudiobookById(req.params.id as string, userId);
      res.status(200).json({ success: true, data: audiobook });
    } catch (error: any) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const audiobook = await AudiobookService.updateAudiobook(req.params.id as string, req.body);
      res.status(200).json({ success: true, data: audiobook });
    } catch (error: any) {
      next(error);
    }
  }

  static async remove(req: Request, res: Response, next: NextFunction) {
    try {
      await AudiobookService.deleteAudiobook(req.params.id as string);
      res.status(200).json({ success: true, message: "Audiobook successfully deleted" });
    } catch (error: any) {
      next(error);
    }
  }
}
