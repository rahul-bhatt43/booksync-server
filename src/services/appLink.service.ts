import { AppLink } from "../models/AppLink.model";

export class AppLinkService {
    static async createAppLink(data: any) {
        const existingLink = await AppLink.findOne({ platform: data.platform.toLowerCase() });
        if (existingLink) {
            throw new Error(`An app link for platform '${data.platform}' already exists.`);
        }

        const appLink = new AppLink(data);
        await appLink.save();
        return appLink;
    }

    static async getAllAppLinks(activeOnly: boolean = false) {
        const query = activeOnly ? { isActive: true } : {};
        return AppLink.find(query).sort({ platform: 1 });
    }

    static async getAppLinkById(id: string) {
        const appLink = await AppLink.findById(id);
        if (!appLink) throw new Error("App link not found");
        return appLink;
    }

    static async updateAppLink(id: string, data: any) {
        if (data.platform) {
            const existingLink = await AppLink.findOne({ platform: data.platform.toLowerCase(), _id: { $ne: id } });
            if (existingLink) {
                throw new Error(`An app link for platform '${data.platform}' already exists.`);
            }
        }

        const appLink = await AppLink.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (!appLink) throw new Error("App link not found");
        return appLink;
    }

    static async deleteAppLink(id: string) {
        const appLink = await AppLink.findByIdAndDelete(id);
        if (!appLink) throw new Error("App link not found");
        return appLink;
    }
}
