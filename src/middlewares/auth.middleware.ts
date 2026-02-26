import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User, IUser } from "../models/User.model";

// Extend Express Request object to include user
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret") as { id: string; role: string };

            // Get user from the token
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                res.status(401);
                throw new Error("Not authorized");
            }

            req.user = user;
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            next(new Error("Not authorized, token failed"));
        }
    }

    if (!token) {
        res.status(401);
        next(new Error("Not authorized, no token"));
    }
};

// Role based authorization
export const authorize = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            next(new Error(`User role '${req.user?.role || 'unknown'}' is not authorized to access this route`));
            return;
        }
        next();
    };
};

export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
