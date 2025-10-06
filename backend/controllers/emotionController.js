require("dotenv").config();
const createError = require("../utils/appError");
const Emotion = require("../models/emotionModel");

exports.getEmotionsByDate = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        // Default: today
        const start = startDate ? new Date(startDate) : new Date();
        const end = endDate ? new Date(endDate) : start;

        // Normalize to whole-day range
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        end.setDate(end.getDate() + 1); // exclusive upper bound

        const emotions = await Emotion.getEmotionsSummary(
            userId,
            start.toISOString(),
            end.toISOString()
        );

        const timeSeries = await Emotion.getEmotionsTimeSeries(
            userId,
            start.toISOString(),
            end.toISOString()
        );

        res.json({ emotions, timeSeries });
    } catch (err) {
        console.error("getEmotionsByDate error:", err.message);
        res.status(500).json({ error: "Server error" });
    }
};