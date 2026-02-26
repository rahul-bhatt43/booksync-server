import { User } from "../models/User.model";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";

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
            role: role || "user",
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
};
