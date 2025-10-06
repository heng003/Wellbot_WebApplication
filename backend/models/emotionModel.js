const supabase = require('../config/supabaseClient');

// Get aggregated emotions by date range
async function findEmotionsByDate(userId, startDate, endDate) {
    const { data, error } = await supabase
        .from("emotional_log")
        .select(`
            emotion_label,
            confidence_score,
            emotional_score,
            timestamp
            `)
        .eq("user_id", userId)
        .gte("timestamp", startDate)
        .lte("timestamp", endDate);

    if (error) throw error;

    // Group manually since Supabase doesn’t allow raw GROUP BY in client
    const grouped = {};
    data.forEach(row => {
        if (!grouped[row.emotion_label]) {
            grouped[row.emotion_label] = {
                emotion_label: row.emotion_label,
                count: 0,
                total_conf: 0,
                total_emotional: 0,
            };
        }
        grouped[row.emotion_label].count++;
        grouped[row.emotion_label].total_conf += row.confidence_score;
        grouped[row.emotion_label].total_emotional += row.emotional_score;
    });

    return Object.values(grouped).map(g => ({
        emotion_label: g.emotion_label,
        count: g.count,
        avg_confidence: g.total_conf / g.count,
        avg_emotional_score: g.total_emotional / g.count,
    }));
}

// Get time series emotions
async function findTimeSeries(userId, startDate, endDate) {
    const { data, error } = await supabase
        .from("emotional_log")
        .select("timestamp, confidence_score, emotional_score")
        .eq("user_id", userId)
        .gte("timestamp", startDate)
        .lte("timestamp", endDate);

    if (error) throw error;

    // Bucket manually by hour
    const buckets = {};
    data.forEach(row => {
        const bucket = new Date(row.timestamp);
        bucket.setMinutes(0, 0, 0); // truncate to hour
        const key = bucket.toISOString();

        if (!buckets[key]) {
            buckets[key] = {
                bucket: key,
                count: 0,
                total_conf: 0,
                total_emotional: 0,
            };
        }
        buckets[key].count++;
        buckets[key].total_conf += row.confidence_score;
        buckets[key].total_emotional += row.emotional_score;
    });

    return Object.values(buckets)
        .map(b => ({
            bucket: b.bucket,
            avg_confidence: b.total_conf / b.count,
            avg_emotional_score: b.total_emotional / b.count,
        }))
        .sort((a, b) => new Date(a.bucket) - new Date(b.bucket));
}

// Get aggregated emotions by date range
async function getEmotionsSummary(userId, start, end) {
    const { data, error } = await supabase
        .from("emotional_log")
        .select("emotion_label, confidence_score, emotional_score, timestamp")
        .eq("user_id", userId)
        .gte("timestamp", start)
        .lt("timestamp", end); // exclusive upper bound for safer range

    if (error) throw error;

    // Manual aggregation
    const grouped = {};
    data.forEach((row) => {
        if (!grouped[row.emotion_label]) {
            grouped[row.emotion_label] = {
                emotion_label: row.emotion_label,
                count: 0,
                total_conf: 0,
                total_emotional: 0,
            };
        }
        grouped[row.emotion_label].count++;
        grouped[row.emotion_label].total_conf += row.confidence_score;
        grouped[row.emotion_label].total_emotional += row.emotional_score;
    });

    return Object.values(grouped).map((g) => ({
        emotion_label: g.emotion_label,
        count: g.count,
        avg_confidence: g.total_conf / g.count,
        avg_emotional_score: g.total_emotional / g.count,
    }));
}

// Get time series emotions (bucket by hour)
async function getEmotionsTimeSeries(userId, start, end) {
    const { data, error } = await supabase
        .from("emotional_log")
        .select("timestamp, confidence_score, emotional_score")
        .eq("user_id", userId)
        .gte("timestamp", start)
        .lt("timestamp", end);

    if (error) throw error;

    // Bucket manually by hour
    const buckets = {};
    data.forEach((row) => {
        const bucket = new Date(row.timestamp);
        bucket.setMinutes(0, 0, 0); // truncate to hour
        const key = bucket.toISOString();

        if (!buckets[key]) {
            buckets[key] = {
                bucket: key,
                count: 0,
                total_conf: 0,
                total_emotional: 0,
            };
        }
        buckets[key].count++;
        buckets[key].total_conf += row.confidence_score;
        buckets[key].total_emotional += row.emotional_score;
    });

    return Object.values(buckets)
        .map((b) => ({
            bucket: b.bucket,
            avg_confidence: b.total_conf / b.count,
            avg_emotional_score: b.total_emotional / b.count,
        }))
        .sort((a, b) => new Date(a.bucket) - new Date(b.bucket));
}

module.exports = {
    findEmotionsByDate,
    findTimeSeries,
    getEmotionsSummary,
    getEmotionsTimeSeries,
};
