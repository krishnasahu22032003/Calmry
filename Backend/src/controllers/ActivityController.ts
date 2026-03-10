import type {Request, Response } from "express";
import Activity from "../models/Activity.js";
import mongoose from "mongoose";

export const logActivity = async (req: Request, res: Response) => {

    try {
        const { type, name, description, duration, difficulty, feedback } = req.body
        const userId = req.user._id

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User Not Authenticated"
            })
        }

        const activity = await Activity.create({
            userId,
            type,
            name,
            description,
            duration,
            difficulty,
            completed:false,
            feedback,
           
        })

        return res.status(201).json({
            success: true,
            message: `Activity logged for user ${userId}`,
            data: activity
        })


    } catch (err) {
        console.log((err as Error).message)
        return res.status(500).json({
            success: false,
            message: "Internal server Error"
        })
    }

}

export const getUserActivities = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const activities = await Activity.find({ userId }).sort({
      timestamp: -1,
    });

    return res.status(200).json({
      success: true,
      data: activities,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const toggleActivityCompletion = async (
  req: Request,
  res: Response
) => {

  try {

    const { id } = req.params
    const { completed } = req.body

    const userId = req.user._id
     if (!mongoose.Types.ObjectId.isValid(id as string)) {
  return res.status(400).json({
    success: false,
    message: "Invalid activity id"
  })
}
if (typeof completed !== "boolean") {
  return res.status(400).json({
    success: false,
    message: "completed must be boolean"
  })
}
    const activity = await Activity.findOneAndUpdate(
      {
    _id: new mongoose.Types.ObjectId(id as string),
    userId
  },
  { completed },
  { new: true }
    )

    if (!activity) {
      return res.status(404).json({
        success: false,
        message: "Activity not found"
      })
    }

    return res.status(200).json({
      success: true,
      data: activity
    })

  } catch (error) {

    console.error(error)

    return res.status(500).json({
      success: false,
      message: "Server error"
    })

  }

}