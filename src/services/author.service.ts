import { Author } from "../models/Author.model";
import { CloudinaryService } from "./cloudinary.service";

export class AuthorService {
    static async createAuthor(data: any, imageFile?: Express.Multer.File) {
        let imageUrl;
        let imagePublicId;

        if (imageFile) {
            const uploadResult: any = await CloudinaryService.uploadImage(imageFile.buffer);
            imageUrl = uploadResult.secure_url;
            imagePublicId = uploadResult.public_id;
        }

        const author = new Author({
            name: data.name,
            biography: data.biography,
            imageUrl,
            imagePublicId,
        });

        await author.save();
        return author;
    }

    static async getAllAuthors(search?: string) {
        const query: any = {};
        if (search) {
            query.name = { $regex: search, $options: "i" };
        }
        return Author.find(query).sort({ name: 1 });
    }

    static async getAuthorById(id: string) {
        const author = await Author.findById(id);
        if (!author) throw new Error("Author not found");
        return author;
    }

    static async updateAuthor(id: string, data: any, imageFile?: Express.Multer.File) {
        const author = await Author.findById(id);
        if (!author) throw new Error("Author not found");

        if (imageFile) {
            if (author.imagePublicId) {
                await CloudinaryService.deleteFile(author.imagePublicId, "image");
            }
            const uploadResult: any = await CloudinaryService.uploadImage(imageFile.buffer);
            data.imageUrl = uploadResult.secure_url;
            data.imagePublicId = uploadResult.public_id;
        }

        Object.assign(author, data);
        await author.save();
        return author;
    }

    static async deleteAuthor(id: string) {
        const author = await Author.findById(id);
        if (!author) throw new Error("Author not found");

        if (author.imagePublicId) {
            await CloudinaryService.deleteFile(author.imagePublicId, "image");
        }

        await author.deleteOne();
    }
}
