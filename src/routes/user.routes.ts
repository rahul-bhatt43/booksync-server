import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";
import { Request, Response, NextFunction } from "express";

const router = Router();

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

router.get("/profile/:id", optionalAuth, UserController.getProfile);

export default router;
