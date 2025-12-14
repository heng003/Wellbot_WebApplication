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

        if (!startDate || !endDate) {
            return res.status(400).json({ error: "startDate and endDate are required" });
        }

        // Parse YYYY-MM-DD into local Date (avoid UTC shift)
        const parseLocalDate = (s) => {
            const [y, m, d] = s.split('-').map(Number);
            if (!y || !m || !d) throw new Error(`Invalid date format: ${s}`);
            return new Date(y, m - 1, d, 0, 0, 0, 0);
        };

        const start = parseLocalDate(startDate);
        const end = parseLocalDate(endDate);

        // Normalize to whole-day range and convert to ISO for model
        end.setHours(23, 59, 59, 999);
        const startISO = start.toISOString();
        const endISO = end.toISOString();

        const emotions = await Emotion.getEmotionsSummary(userId, startISO, endISO);
        const timeSeries = await Emotion.getEmotionsTimeSeries(userId, startISO, endISO);

        return res.json({ emotions, timeSeries });

    } catch (err) {
        console.error("getEmotionsByDate error:", err);
        return res.status(500).json({ error: err.message || "Server error" });
    }
};

exports.getEmotionalScoreTrend = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate, bucketType = 'day' } = req.query;

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'startDate and endDate are required' });
        }

        const dailyData = await Emotion.getDailyAggregates(
            userId,
            startDate,
            endDate,
            bucketType
        );

        // Calculate trend metrics
        const currentScore = dailyData.length > 0
            ? dailyData[dailyData.length - 1].avgScore
            : 0;

        const previousScore = dailyData.length > 1
            ? dailyData[0].avgScore
            : currentScore;

        const trendDirection = currentScore > previousScore
            ? 'up'
            : currentScore < previousScore
                ? 'down'
                : 'stable';

        const trendPercentage = previousScore !== 0
            ? Math.abs(((currentScore - previousScore) / previousScore) * 100).toFixed(2)
            : 0;

        return res.json({
            currentScore,
            trendDirection,
            trendPercentage,
            dailyData,
        });
    } catch (err) {
        console.error('Error fetching trend:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.getEmotionCountsByDate = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query; // These are STRINGS "YYYY-MM-DD"

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (!startDate || !endDate) {
            return res.status(400).json({ error: 'startDate and endDate are required' });
        }

        console.log('Controller received:', { userId, startDate, endDate });

        // Pass the strings to the service. The service will handle conversion.
        const counts = await Emotion.getEmotionCountsByDay(userId, startDate, endDate);

        return res.json({ dailyCounts: counts });

    } catch (err) {
        console.error('getEmotionCountsByDate error:', err);
        res.status(500).json({ error: err.message, stack: err.stack });
    }
};

exports.getEmotionalLogs = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const data = await Emotion.getEmotionalLogsFromDb(
            userId,
            startDate,
            endDate
        );

        return res.status(200).json({ data });
    } catch (err) {
        console.error("Error fetching emotional logs:", err);
        return res.status(500).json({ error: "Server Error" });
    }
};