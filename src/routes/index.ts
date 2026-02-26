import { Router } from "express";
import audiobookRoutes from "./audiobook.routes";
import authRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import interactionRoutes from "./interaction.routes";
import historyRoutes from "./history.routes";
import feedRoutes from "./feed.routes";
import userRoutes from "./user.routes";

const router = Router();

// Your API now handles `/api/v1/`
router.use("/audiobooks", audiobookRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/interactions", interactionRoutes);
router.use("/history", historyRoutes);
router.use("/feed", feedRoutes);
router.use("/users", userRoutes);

export default router;
