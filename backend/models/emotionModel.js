const supabase = require('../config/supabaseClient');

// Get aggregated emotions by date range
async function getEmotionsSummary(userId, start, end) {
    const { data, error } = await supabase.rpc("get_emotions_summary", {
        p_user: userId,
        p_start: start,
        p_end: end
    });

    if (error) throw error;
    return data;
}

// Get time series emotions (bucket by hour)
// Get time series emotions (bucket by hour)
async function getEmotionsTimeSeries(userId, start, end) {
    // We reuse the flexible RPC but hardcode the interval to '1 hour'
    // to match the original behavior of this function.
    const { data, error } = await supabase.rpc("get_emotional_aggregates_dynamic", {
        p_user: userId,
        p_start: start,
        p_end: end,
        p_interval: '1 hour'
    });

    if (error) throw error;

    // The RPC already returns the data in the correct format:
    // [{ bucket: "...", avg_confidence: 0.8, avg_emotional_score: 5, cnt: 10 }, ...]
    return data;
}

// Get daily aggregated emotional scores with optional bucketing + fill missing buckets (and copy previous value)
async function getDailyAggregates(userId, startDate, endDate, bucketType = 'day') {
    // 1. Map bucketType to SQL Interval
    let sqlInterval;
    switch (bucketType) {
        case '15min': sqlInterval = '15 minutes'; break;
        case '30min': sqlInterval = '30 minutes'; break;
        case 'hour': sqlInterval = '1 hour'; break;
        case '2hour': sqlInterval = '2 hours'; break;
        case 'day': sqlInterval = '1 day'; break;
        case 'month': sqlInterval = '1 month'; break;
        default: sqlInterval = '1 day';
    }

    const p_start = startDate || null;
    const p_end = endDate || null;

    // 2. Call the RPC
    const { data: aggregatedData, error } = await supabase.rpc("get_emotional_aggregates_dynamic", {
        p_user: userId,
        p_start,
        p_end,
        p_interval: sqlInterval
    });

    if (error) throw error;

    // --- HELPER: Format Date to Key ---
    const formatKey = (d) => {
        if (bucketType === 'month') {
            // Returns "YYYY-MM" (e.g., "2025-11")
            return d.toISOString().slice(0, 7);
        }

        if (bucketType === 'day') {
            // Returns "YYYY-MM-DD"
            return d.toISOString().split('T')[0];
        }

        // For hours/minutes: "YYYY-MM-DDTHH:mm"
        return d.toISOString().slice(0, 16);
    };

    // 3. Populate Map using the STABLE key
    const dataMap = new Map();
    (aggregatedData || []).forEach(row => {
        // We force the DB timestamp to be treated as UTC to prevent double-shifting if driver behaves oddly
        const dbString = row.bucket.endsWith('Z') || row.bucket.includes('+')
            ? row.bucket
            : row.bucket + 'Z';

        const dbDate = new Date(dbString);

        // SHIFT TIMESTAMP: The SQL buckets are in KL Time (UTC+8).
        // The RPC returns them as a timestamptz which converts KL wall-clock to UTC.
        // E.g. 00:00 KL -> 16:00 UTC (previous day).
        // We must shift +8 hours to align it back to the "Wall Clock" time expected by the loop.
        dbDate.setHours(dbDate.getHours() + 8);

        const key = formatKey(dbDate);
        dataMap.set(key, row);
    });

    const result = [];
    let cursor = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    // Helper to advance cursor
    const advanceCursor = (date) => {
        if (bucketType === 'month') {
            date.setMonth(date.getMonth() + 1);
        }
        else if (bucketType === 'day') date.setDate(date.getDate() + 1);
        else if (bucketType === '2hour') date.setHours(date.getHours() + 2);
        else if (bucketType === 'hour') date.setHours(date.getHours() + 1);
        else if (bucketType === '30min') date.setMinutes(date.getMinutes() + 30);
        else if (bucketType === '15min') date.setMinutes(date.getMinutes() + 15);
    };

    while (cursor <= end) {
        // Generate the key for the current loop position
        // cursor is already representing the "Wall Clock" time in UTC
        const key = formatKey(cursor);

        // LOOKUP using the simple string key
        const row = dataMap.get(key);

        let avgScore, avgConfidence, count;

        if (row) {
            avgScore = Math.round(row.avg_emotional_score);
            avgConfidence = Math.round(row.avg_confidence * 100) / 100;
            count = row.cnt;
            lastAvgScore = avgScore;
            lastAvgConf = avgConfidence;
        } else {
            avgScore = null;
            avgConfidence = null;
            count = 0;
        }

        result.push({
            date: cursor.toISOString(), // Keep full ISO for the frontend to parse
            avgScore,
            avgConfidence,
            count
        });

        advanceCursor(cursor);
    }

    return result;
}

async function getEmotionCountsByDay(userId, start, end) {
    const { data, error } = await supabase.rpc("get_emotion_counts_by_day", {
        p_user: userId,
        p_start: start,
        p_end: end
    });

    if (error) throw error;
    return data;
}

async function getEmotionalLogsFromDb(userId, startDate, endDate, limit = 200) {
    const startISO = `${startDate}T00:00:00.000Z`;
    const endISO = `${endDate}T23:59:59.999Z`;

    const { data, error } = await supabase.rpc("get_emotional_logs_paginated", {
        p_user: userId,
        p_start: startISO,
        p_end: endISO,
        p_limit: limit,
        p_before: null
    });

    if (error) throw error;
    return data;
}

async function getMoodActivityCorrelation(userId, startDate, endDate) {
    const { data, error } = await supabase.rpc("get_mood_activity_correlation", {
        p_user_id: userId,
        p_start: startDate,
        p_end: endDate
    });

    if (error) throw error;
    return data;
}

module.exports = {
    getEmotionsSummary,
    getEmotionsTimeSeries,
    getDailyAggregates,
    getEmotionCountsByDay,
    getEmotionalLogsFromDb,
    getMoodActivityCorrelation,
};
