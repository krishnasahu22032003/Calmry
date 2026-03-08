import type { Request, Response } from "express";
import Mood from "../models/Mood.js";

export const logMood = async (req: Request, res: Response) => {
  try {
    const { score, note, context, activities } = req.body;

    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User is not authenticated",
      });
    }

    if (score === undefined) {
      return res.status(400).json({
        success: false,
        message: "Score is required",
      });
    }

    const mood = await Mood.create({
      userId,
      score,
      note,
      context,
      activities,
    });

    return res.status(201).json({
      success: true,
      message: `Mood entry created`,
      data: mood,
    });
  } catch (err) {
    console.log((err as Error).message);

    return res.status(500).json({
      success: false,
      message: "Internal server Error",
    });
  }
};