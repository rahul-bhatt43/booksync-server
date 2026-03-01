import { Narrator } from "../models/Narrator.model";
import { CloudinaryService } from "./cloudinary.service";

export class NarratorService {
    static async createNarrator(data: any, imageFile?: Express.Multer.File) {
        let imageUrl;
        let imagePublicId;

        if (imageFile) {
            const uploadResult: any = await CloudinaryService.uploadImage(imageFile.buffer);
            imageUrl = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }

        const narrator = new Narrator({
            name: data.name,
            biography: data.biography,
            imageUrl,
            imagePublicId,
        });

        await narrator.save();
        return narrator;
    }

    static async getAllNarrators(search?: string) {
        const query: any = {};
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        return Narrator.find(query).sort({ name: 1 });
    }

    static async getNarratorById(id: string) {
        const narrator = await Narrator.findById(id);
        if (!narrator) throw new Error("Narrator not found");
        return narrator;
    }

    static async updateNarrator(id: string, data: any, imageFile?: Express.Multer.File) {
        const narrator = await Narrator.findById(id);
        if (!narrator) throw new Error("Narrator not found");

        if (imageFile) {
            if (narrator.imagePublicId) {
                await CloudinaryService.deleteFile(narrator.imagePublicId, "image");
            }
            const uploadResult: any = await CloudinaryService.uploadImage(imageFile.buffer);
            data.imageUrl = uploadResult.secure_url;
            data.imagePublicId = uploadResult.public_id;
        }

        Object.assign(narrator, data);
        await narrator.save();
        return narrator;
    }

    static async deleteNarrator(id: string) {
        const narrator = await Narrator.findById(id);
        if (!narrator) throw new Error("Narrator not found");

        if (narrator.imagePublicId) {
            await CloudinaryService.deleteFile(narrator.imagePublicId, "image");
        }

        await narrator.deleteOne();
    }
}
