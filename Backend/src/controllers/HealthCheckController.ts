import type { Request, Response } from "express";

export default function healthCheck(req: Request, res: Response) {

    return res.status(200).json({
        success: true,
        message: "App is healthy and is running..."
    });
};