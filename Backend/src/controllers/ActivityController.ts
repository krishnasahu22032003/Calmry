import type { NextFunction, Request, Response } from "express";
import Activity from "../models/Activity.js";

export const logActivity = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const { type, name, description, duration, difficulty, feedback, timestamp } = req.body
        const userId = req.user._id

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User Not Authenticated"
            })
        }

        const activity = await Activity.create({
            type,
            name,
            description,
            duration,
            difficulty,
            feedback,
            timestamp: Date.now()
        })

        if (!activity) {
            return res.status(401).json({
                success: false,
                message: "Internal server error"
            })
        }
        return res.status(200).json({
            success: true,
            message: `Activity logged for user ${userId}`,
            data: activity
        })


    } catch (err) {
        console.log((err as Error).message)
        return res.status(400).json({
            success: false,
            message: "Internal server Error"
        })
    }

}