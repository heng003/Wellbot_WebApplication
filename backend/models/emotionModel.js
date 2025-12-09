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

// Get daily aggregated emotional scores between start and end (inclusive)
// async function getDailyAggregates(userId, start, end) {
//     const startDate = new Date(start);
//     const endDate = new Date(end);
//     endDate.setHours(23, 59, 59, 999);

//     const { data, error } = await supabase
//         .from("emotional_log")
//         .select("timestamp, confidence_score, emotional_score")
//         .eq("user_id", userId)
//         .gte("timestamp", startDate.toISOString())
//         .lte("timestamp", endDate.toISOString());

//     if (error) throw error;

//     const grouped = {};
//     (data || []).forEach(row => {
//         const date = new Date(row.timestamp).toISOString().split('T')[0];
//         if (!grouped[date]) {
//             grouped[date] = { date, total_conf: 0, total_emotional: 0, count: 0 };
//         }
//         grouped[date].count++;
//         grouped[date].total_conf += (row.confidence_score || 0);
//         grouped[date].total_emotional += (row.emotional_score || 0);
//     });

//     return Object.values(grouped).map(g => ({
//         date: g.date,
//         avgScore: g.count > 0 ? Math.round(g.total_emotional / g.count) : 0,
//         avgConfidence: g.count > 0 ? Math.round((g.total_conf / g.count) * 100) / 100 : 0,
//         count: g.count,
//     })).sort((a, b) => new Date(a.date) - new Date(b.date));
// }

// Get daily aggregated emotional scores with optional bucketing + fill missing buckets (and copy previous value)
async function getDailyAggregates(userId, start, end, bucketType = 'day') {
    // 1. Map bucketType to SQL Interval
    let sqlInterval;
    switch (bucketType) {
        case '15min': sqlInterval = '15 minutes'; break;
        case '30min': sqlInterval = '30 minutes'; break;
        case 'hour':  sqlInterval = '1 hour'; break;
        case '2hour': sqlInterval = '2 hours'; break;
        case 'day':   sqlInterval = '1 day'; break;
        default:      sqlInterval = '1 day';
    }

    // 2. Call the RPC
    const { data: aggregatedData, error } = await supabase.rpc("get_emotional_aggregates_dynamic", {
        p_user: userId,
        p_start: start,
        p_end: end,
        p_interval: sqlInterval
    });

    if (error) throw error;

    // --- HELPER: Create a stable key ignoring timezone shifts ---
    const getBucketKey = (dateInput) => {
        const d = new Date(dateInput);
        if (bucketType === 'day') {
            // Returns "YYYY-MM-DD" based on the raw date value
            // We use .toISOString() and split, but we ensure we treat input as UTC first if needed
            // Safer approach: string match the date part
            return d.toISOString().split('T')[0];
        } 
        // For hours/minutes, we return "YYYY-MM-DDTHH:mm"
        return d.toISOString().slice(0, 16);
    };

    // 3. Populate Map using the STABLE key
    const dataMap = new Map();
    (aggregatedData || []).forEach(row => {
        // We force the DB timestamp to be treated as UTC to prevent the "-8 hours" shift
        // If row.bucket is "2025-12-09 00:00:00", adding "Z" forces it to be read as UTC.
        const dbTime = row.bucket.endsWith('Z') || row.bucket.includes('+') 
            ? row.bucket 
            : row.bucket + 'Z'; 
            
        const key = getBucketKey(dbTime);
        dataMap.set(key, row);
    });

    const result = [];
    let cursor = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    // Helper to advance cursor
    const advanceCursor = (date) => {
        if (bucketType === 'day') date.setDate(date.getDate() + 1);
        else if (bucketType === '2hour') date.setHours(date.getHours() + 2);
        else if (bucketType === 'hour') date.setHours(date.getHours() + 1);
        else if (bucketType === '30min') date.setMinutes(date.getMinutes() + 30);
        else if (bucketType === '15min') date.setMinutes(date.getMinutes() + 15);
    };

    // Variables for "Forward Fill"
    let lastAvgScore = 0;
    let lastAvgConf = 0;

    while (cursor <= endDate) {
        // Generate the key for the current loop position
        const key = getBucketKey(cursor);
        
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
            avgScore = lastAvgScore;
            avgConfidence = lastAvgConf;
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

async function getEmotionalLogsFromDb(userId, startDate, endDate) {
    const startISO = `${startDate}T00:00:00.000Z`;
    const endISO = `${endDate}T23:59:59.999Z`;

    const { data, error } = await supabase.rpc("get_emotional_logs_paginated", {
        p_user: userId,
        p_start: startISO,
        p_end: endISO,
        p_limit: 200,
        p_before: null
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
};
