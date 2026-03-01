import { Router } from "express";
import { adminController } from "../controllers/admin.controller";
import { protect, authorize } from "../middlewares/auth.middleware";

const router = Router();

// Require user to be logged in AND have the 'admin' role
router.use(protect as any, authorize("admin") as any);

router.get("/stats", adminController.getDashboardStats as any);

export default router;
