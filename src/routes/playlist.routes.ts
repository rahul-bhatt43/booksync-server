import { Router } from "express";
import { playlistController } from "../controllers/playlist.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// Publicly accessible but optionally checks auth if token is provided? 
// For now, let's keep GET /:id accessible with standard auth middleware so we can grab user from req
// Actually, to view public playlists without auth we might need a separate route or optional auth middleware.
// Let's assume standard app usage requires auth.

router.use(protect as any); // Require auth for all playlist operations

router.post("/", playlistController.createPlaylist as any);
router.get("/user", playlistController.getUserPlaylists as any);
router.get("/:id", playlistController.getPlaylist as any);
router.patch("/:id", playlistController.updatePlaylist as any);
router.delete("/:id", playlistController.deletePlaylist as any);

router.post("/:id/audiobooks", playlistController.addAudiobook as any);
router.delete("/:id/audiobooks/:audiobookId", playlistController.removeAudiobook as any);

export default router;
