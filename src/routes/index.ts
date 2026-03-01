import { Router } from "express";
import audiobookRoutes from "./audiobook.routes";
import authRoutes from "./auth.routes";
import categoryRoutes from "./category.routes";
import interactionRoutes from "./interaction.routes";
import historyRoutes from "./history.routes";
import feedRoutes from "./feed.routes";
import userRoutes from "./user.routes";
import playlistRoutes from "./playlist.routes";
import reviewRoutes from "./review.routes";
import bookmarkRoutes from "./bookmark.routes";
import adminRoutes from "./admin.routes";
import authorRoutes from "./author.routes";
import narratorRoutes from "./narrator.routes";
import appLinkRoutes from "./appLink.routes";

const router = Router();

// Your API now handles `/api/v1/`
router.use("/audiobooks", audiobookRoutes);
router.use("/auth", authRoutes);
router.use("/categories", categoryRoutes);
router.use("/interactions", interactionRoutes);
router.use("/history", historyRoutes);
router.use("/feed", feedRoutes);
router.use("/users", userRoutes);
router.use("/playlists", playlistRoutes);
router.use("/audiobooks", reviewRoutes); // Mount review routes on /audiobooks so it handles /audiobooks/:id/reviews
router.use("/audiobooks", bookmarkRoutes); // Mount bookmark routes on /audiobooks for creation/fetching
router.use("/bookmarks", bookmarkRoutes); // Mount on /bookmarks for update/delete of a specific bookmark
router.use("/admin", adminRoutes); // Mount admin routes
router.use("/authors", authorRoutes);
router.use("/narrators", narratorRoutes);
router.use("/app-links", appLinkRoutes);

export default router;
