import { type Request, type Response } from "express"
import z from "zod";
import { UserModel } from "../models/UserModel.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import JWT_SECRET from "../config/Config.js";
import { ENV } from "../lib/ENV.js";
import { SessionModel } from "../models/SessionModel.js";

export const UserSignup = async (req: Request, res: Response) => {

    const requiredbody = z.object({
        username: z.string().min(3).max(50).transform((v) => v.trim()),
        email: z.string().email().min(5).max(50).transform((v) => v.trim()),
        password: z.string()
            .min(8).max(128)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                "Password must include uppercase, lowercase, number, and special character"
            )
            .transform((v) => v.trim()),
    });

    const parseddata = requiredbody.safeParse(req.body)

    if (!parseddata.success) {

        return res.status(400).json({
            success: false,
            errors: parseddata.error.flatten(),
            message: "Validation Failed"
        })
    }
    const { username, email, password } = parseddata.data;



    try {

        if (await UserModel.findOne({ email })) {
            return res.status(409).json({
                success: false,
                message: "User already exists"
            })
        }
        const hashedpassword = await bcrypt.hash(password, 10)

        const newUser = await UserModel.create({
            username,
            email,
            password: hashedpassword
        })
        if (!newUser) {
            return res.status(400).json({
                success: false,
                message: "Error while entering user in the database"
            })
        }
        return res.status(201).json({
            success: true,
            message: "User Successfully signedUp", User: {
                id: newUser._id,
                email: newUser.email,
                username: newUser.username
            }
        })
    } catch (err) {
        console.log((err as Error).message, "Internal Server Error")
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }

}

export const UserSignIn = async (req: Request, res: Response) => {

    const requiredbody = z.object({
        email: z.string().email().min(5).max(50).transform((v) => v.trim()),
        password: z.string()
            .min(8).max(128)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                "Password must include uppercase, lowercase, number, and special character"
            )
            .transform((v) => v.trim()),
    });

    const parseddata = requiredbody.safeParse(req.body)

    if (!parseddata.success) {
        return res.status(400).json({
            success: false,
            errors: parseddata.error.flatten(),
            message: "Validation Failed"
        })
    }

    const { email, password } = parseddata.data

    try {
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials"
            })
        }
        const checkPassword = await bcrypt.compare(password, user.password as string)
        if (!checkPassword) {
            return res.status(401).json({
                success: false,
                message: "Invalid Credentials"
            })
        }
        const token = jwt.sign({ userId: user?._id }, JWT_SECRET, { expiresIn: "7d" })

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        const expiresAt = new Date()

        expiresAt.setHours(expiresAt.getHours() + 48);

        const session = new SessionModel({

            userId: user._id,
            token,
            expiresAt,
            deviceInfo: req.headers["user-agent"]
        })
        await session.save()

        return res.status(200).json({
            success: true,
            message: "Signin successful",
            user: { id: user._id, username: user.username, email: user.email },

        });
    } catch (err) {
        console.error("Signin error:", (err as Error).message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
}

export const UserLogOut = (req: Request, res: Response) => {

    try {
        res.clearCookie("auth_token", {
            httpOnly: true,
            secure: ENV.NODE_ENV === "production",
            sameSite: ENV.NODE_ENV === "production" ? "none" : "lax",
        })
        return res.status(200).json({
            success: true,
            message: "Logout successful"
        })
    } catch (err) {
        console.log((err as Error).message, "Error while logout")
        return res.status(500).json({
            success: false,
            message: "Internal server error "
        })
    }


}

export const checkUser = async (req: Request, res: Response) => {

    try {

        if (!req.user || !req.user._id) {

            return res.status(401).json({ message: "Unauthorized" });
        }
        const user = await UserModel.findById(req.user._id).select("-password")
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error in /check route:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}


export const UpdateUserDetails = async (req: Request, res: Response) => {
    const schema = z.object({
        currentpassword: z.string(),
        newusername: z.string().trim().min(3).max(50),
        newemail: z.string().trim().email().min(5).max(50),
        newpassword: z.string()
            .min(8)
            .max(128)
            .regex(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/,
                "Password must include uppercase, lowercase, number, and special character"
            ),
    });

    const parsed = schema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            success: false,
            errors: parsed.error.flatten(),
            message: "Validation Failed",
        });
    }

    if (!req.user || !req.user._id) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    const { currentpassword, newusername, newemail, newpassword } = parsed.data;

    try {
        const user = await UserModel.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(currentpassword, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        const existingEmail = await UserModel.findOne({ email: newemail });

        if (
            existingEmail &&
            existingEmail._id.toString() !== req.user._id.toString()
        ) {
            return res.status(409).json({
                success: false,
                message: "Email already in use",
            });
        }

        const hashedPassword = await bcrypt.hash(newpassword, 10);

        const updatedUser = await UserModel.findByIdAndUpdate(
            req.user._id,
            {
                username: newusername,
                email: newemail,
                password: hashedPassword,
            },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "User details updated successfully",
            user: {
                id: updatedUser?._id,
                email: updatedUser?.email,
                username: updatedUser?.username,
            },
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};