import { Request, Response } from "express";
import { adminService } from "../services/admin.service";

export class AdminController {
    async getDashboardStats(req: Request, res: Response) {
        try {
            const stats = await adminService.getDashboardStats();
            res.status(200).json({ success: true, data: stats });
        } catch (error) {
            console.error("Error fetching admin stats:", error);
            res.status(500).json({ success: false, message: "Failed to fetch admin stats" });
        }
    }
}

export const adminController = new AdminController();
