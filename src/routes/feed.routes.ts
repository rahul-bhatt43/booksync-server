import { Router } from "express";
import { FeedController } from "../controllers/feed.controller";
import { protect } from "../middlewares/auth.middleware";

const router = Router();

// We use protect lazily here, or we can create an optionalAuth middleware.
// For simplicity, let's assume home feed needs to know who's logged in for "continue listening", 
// but we'll accept requests without token by using a custom middleware.

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User.model";

// Middleware to inject user if token is present, but not fail if it's absent
const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { id: string };
            const user = await User.findById(decoded.id).select("-password");
            if (user) req.user = user;
        } catch (error) {
            // Ignored for optional auth
        }
    }
    next();
};

router.get("/home", optionalAuth, FeedController.getHomeFeed);
router.get("/search", FeedController.search);

export default router;
