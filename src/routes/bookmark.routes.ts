import { Router } from "express";
import { bookmarkController } from "../controllers/bookmark.controller";
import { protect } from "../middlewares/auth.middleware";

// Note: This router handles both /audiobooks/:audiobookId/bookmarks and plain /bookmarks/:id
const router = Router({ mergeParams: true });

router.use(protect as any); // All bookmark features require authentication

// Routes expected to be mounted at /audiobooks
router.post("/:audiobookId/bookmarks", bookmarkController.createBookmark as any);
router.get("/:audiobookId/bookmarks", bookmarkController.getBookmarks as any);

// Routes expected to be mounted at /bookmarks
router.patch("/:id", bookmarkController.updateBookmark as any);
router.delete("/:id", bookmarkController.deleteBookmark as any);

export default router;
