import { logger } from "./logger.js";
import { ENV } from "../lib/ENV.js";
import type { Express } from "express";
import { connectDB } from "../lib/db.js";
export const startServer = async (app :Express ) => {
    try {
        await connectDB()

        const PORT = ENV.PORT || 3001;
        app.listen(PORT, () => {
            logger.info(`Server is running on port ${PORT}`);
            logger.info(
                `Inngest endpoint available at http://localhost:${PORT}/api/inngest`
            );
        });
    } catch (error) {
        logger.error("Failed to start server:", error);
        process.exit(1);
    }
};