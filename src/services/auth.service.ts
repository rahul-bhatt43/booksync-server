import { User } from "../models/User.model";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import crypto from "crypto";
import { emailService } from "./email.service";

const generateToken = (id: string, role: string) => {
    const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRE || "30d") as unknown as number,
    };
    return jwt.sign({ id, role }, process.env.JWT_SECRET || "default_secret", options);
};

export const authService = {
    async registerUser(data: any) {
        const { name, email, password, role } = data;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw Object.assign(new Error("User already exists with this email"), { statusCode: 400 });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "user", // Hardcode to standard user
        });

        const token = generateToken(user._id.toString(), user.role);

        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePictureUrl: user.profilePictureUrl,
            },
            token,
        };
    },

    async loginUser(data: any) {
        const { email, password } = data;

        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password!);
        if (!isMatch) {
            throw Object.assign(new Error("Invalid credentials"), { statusCode: 401 });
        }

        const token = generateToken(user._id.toString(), user.role);

        return {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                profilePictureUrl: user.profilePictureUrl,
            },
            token,
        };
    },

    async forgotPassword(email: string) {
        const user = await User.findOne({ email });

        if (!user) {
            throw Object.assign(new Error("There is no user with that email"), { statusCode: 404 });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");

        // Hash token and set to resetPasswordToken field
        user.resetPasswordToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Set expire (10 mins)
        user.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

        await user.save();

        try {
            await emailService.sendResetPasswordEmail(user.email, resetToken);
            return { message: "Email sent" };
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            throw Object.assign(new Error("Email could not be sent"), { statusCode: 500 });
        }
    },

    async resetPassword(token: string, password: any) {
        // Hash token to compare with DB
        const resetPasswordToken = crypto
            .createHash("sha256")
            .update(token)
            .digest("hex");

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            throw Object.assign(new Error("Invalid token or token expired"), { statusCode: 400 });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Clear reset fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        return { message: "Password reset successful" };
    },
};
