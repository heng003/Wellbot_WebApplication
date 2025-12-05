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
        .select("emotion_label, confidence_score, emotional_score")
        .eq("user_id", userId)
        .gte("timestamp", start)
        .lt("timestamp", end);

    if (error) throw error;

    const grouped = {};

    data.forEach(row => {
        const label = row.emotion_label;

        if (!grouped[label]) {
            grouped[label] = {
                count: 0,
                total_conf: 0,
                total_emotional: 0,
            };
        }

        grouped[label].count++;
        grouped[label].total_conf += row.confidence_score;
        grouped[label].total_emotional += row.emotional_score;
    });

    return Object.entries(grouped).map(([emotion_label, g]) => ({
        emotion_label,
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

    const buckets = {};

    data.forEach(row => {
        const hour = new Date(row.timestamp);
        hour.setMinutes(0, 0, 0);  
        const key = hour.toISOString();

        if (!buckets[key]) {
            buckets[key] = {
                count: 0,
                total_conf: 0,
                total_emotional: 0,
            };
        }

        buckets[key].count++;
        buckets[key].total_conf += row.confidence_score;
        buckets[key].total_emotional += row.emotional_score;
    });

    return Object.entries(buckets)
        .map(([bucket, b]) => ({
            bucket,
            avg_confidence: b.total_conf / b.count,
            avg_emotional_score: b.total_emotional / b.count,
        }))
        .sort((a, b) => new Date(a.bucket) - new Date(b.bucket));
}

// Get daily aggregated emotional scores between start and end (inclusive)
async function getDailyAggregates(userId, start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    endDate.setHours(23, 59, 59, 999);

    const { data, error } = await supabase
        .from("emotional_log")
        .select("timestamp, confidence_score, emotional_score")
        .eq("user_id", userId)
        .gte("timestamp", startDate.toISOString())
        .lte("timestamp", endDate.toISOString());

    if (error) throw error;

    const grouped = {};
    (data || []).forEach(row => {
        const date = new Date(row.timestamp).toISOString().split('T')[0];
        if (!grouped[date]) {
            grouped[date] = { date, total_conf: 0, total_emotional: 0, count: 0 };
        }
        grouped[date].count++;
        grouped[date].total_conf += (row.confidence_score || 0);
        grouped[date].total_emotional += (row.emotional_score || 0);
    });

    return Object.values(grouped).map(g => ({
        date: g.date,
        avgScore: g.count > 0 ? Math.round(g.total_emotional / g.count) : 0,
        avgConfidence: g.count > 0 ? Math.round((g.total_conf / g.count) * 100) / 100 : 0,
        count: g.count,
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
}

// Get daily aggregated emotional scores with optional bucketing + fill missing buckets (and copy previous value)
async function getDailyAggregates(userId, start, end, bucketType = 'day') {
	const startDate = new Date(start);
	const endDate = new Date(end);
	// inclusive end
	endDate.setHours(23, 59, 59, 999);

	const { data, error } = await supabase
		.from("emotional_log")
		.select("timestamp, confidence_score, emotional_score")
		.eq("user_id", userId)
		.gte("timestamp", startDate.toISOString())
		.lte("timestamp", endDate.toISOString());

	if (error) throw error;

	// bucket key generator aligned to bucketType
	const getBucketKey = (dateObj) => {
		const d = new Date(dateObj);
		if (bucketType === '15min') {
			const minutes = Math.floor(d.getMinutes() / 15) * 15;
			d.setMinutes(minutes, 0, 0);
			return d.toISOString();
		}
		if (bucketType === '30min') {
			const minutes = Math.floor(d.getMinutes() / 30) * 30;
			d.setMinutes(minutes, 0, 0);
			return d.toISOString();
		}
		if (bucketType === 'hour') {
			d.setMinutes(0, 0, 0);
			return d.toISOString();
		}
		if (bucketType === '2hour') {
			const hour = Math.floor(d.getHours() / 2) * 2;
			d.setHours(hour, 0, 0, 0);
			return d.toISOString();
		}
		// day
		d.setHours(0, 0, 0, 0);
		return d.toISOString().split('T')[0];
	};

	const grouped = {};
	(data || []).forEach(row => {
		const key = getBucketKey(row.timestamp);
		if (!grouped[key]) grouped[key] = { date: key, total_conf: 0, total_emotional: 0, count: 0 };
		grouped[key].count++;
		grouped[key].total_conf += (row.confidence_score || 0);
		grouped[key].total_emotional += (row.emotional_score || 0);
	});

	// Build full sequence of buckets between start and end
	const buckets = [];
	const alignedStart = new Date(getBucketKey(startDate));
	let stepMinutes;
	switch (bucketType) {
		case '15min': stepMinutes = 15; break;
		case '30min': stepMinutes = 30; break;
		case 'hour': stepMinutes = 60; break;
		case '2hour': stepMinutes = 120; break;
		default: stepMinutes = 24 * 60; // day
	}

	let cursor = new Date(alignedStart);
	const endCursor = new Date(endDate);
	// for day buckets compare dates only
	const cmpFn = bucketType === 'day'
		? (a, b) => new Date(a.toISOString().split('T')[0]).getTime() <= new Date(b.toISOString().split('T')[0]).getTime()
		: (a, b) => a.getTime() <= b.getTime();

	while (cmpFn(cursor, endCursor)) {
		const key = bucketType === 'day' ? cursor.toISOString().split('T')[0] : cursor.toISOString();
		buckets.push(key);
		// advance cursor
		if (bucketType === 'day') {
			cursor.setDate(cursor.getDate() + 1);
		} else {
			cursor = new Date(cursor.getTime() + stepMinutes * 60 * 1000);
		}
	}

	// Ensure grouped has all bucket keys
	buckets.forEach(k => {
		if (!grouped[k]) grouped[k] = { date: k, total_conf: 0, total_emotional: 0, count: 0 };
	});

	// Create ordered list and fill missing avgScore by copying previous non-empty value
	const ordered = buckets
		.map(k => {
			const g = grouped[k];
			return {
				date: g.date,
				total_conf: g.total_conf || 0,
				total_emotional: g.total_emotional || 0,
				count: g.count || 0,
			};
		})
		.sort((a, b) => new Date(a.date) - new Date(b.date));

	let lastAvgScore = 0;
	let lastAvgConf = 0;
	const result = ordered.map(item => {
		let avgScore = item.count > 0 ? Math.round(item.total_emotional / item.count) : null;
		let avgConfidence = item.count > 0 ? Math.round((item.total_conf / item.count) * 100) / 100 : null;

		// copy previous non-null if this bucket is empty
		if (avgScore === null) {
			avgScore = lastAvgScore;
			avgConfidence = lastAvgConf;
		} else {
			lastAvgScore = avgScore;
			lastAvgConf = avgConfidence;
		}

		return {
			date: item.date,
			avgScore,
			avgConfidence,
			count: item.count,
		};
	});

	return result;
}

async function getEmotionCountsByDay(userId, startInput, endInput) {
    // 1. Convert Strings to Dates
    const startDate = new Date(startInput);
    const endDate = new Date(endInput);

    // 2. Validate Dates
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        throw new Error(`Invalid Date Format. Received: ${startInput}, ${endInput}`);
    }

    // 3. Set Boundaries
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    // 4. Query Supabase
    const { data, error } = await supabase
        .from("emotional_log")
        .select("timestamp, emotion_label")
        .eq("user_id", userId)
        .gte("timestamp", startDate.toISOString())
        .lte("timestamp", endDate.toISOString())
        .limit(20000); // <--- ADD THIS LINE (Adjust number if you expect more rows)

    if (error) {
        console.error("Supabase Error:", error);
        throw new Error(`DB Error: ${error.message}`);
    }

    // 5. Grouping Logic
    const EMOTIONS = ["HAPPY", "SAD", "ANGRY", "FEAR"];
    const grouped = {};

    (data || []).forEach((row) => {
        if (!row.timestamp) return;

        // Extract YYYY-MM-DD
        const dateKey = row.timestamp.split('T')[0];
        const label = (row.emotion_label || "").toUpperCase();

        if (!grouped[dateKey]) {
            grouped[dateKey] = { HAPPY: 0, SAD: 0, ANGRY: 0, FEAR: 0 };
        }

        if (EMOTIONS.includes(label)) {
            grouped[dateKey][label] += 1;
        }
    });

    // 6. Fill Missing Days
    const result = [];
    let cursor = new Date(startDate);

    // Safe Loop
    while (cursor.getTime() <= endDate.getTime()) {
        const yyyy = cursor.getFullYear();
        const mm = String(cursor.getMonth() + 1).padStart(2, '0');
        const dd = String(cursor.getDate()).padStart(2, '0');
        const key = `${yyyy}-${mm}-${dd}`;

        const dayData = grouped[key] || { HAPPY: 0, SAD: 0, ANGRY: 0, FEAR: 0 };

        result.push({ date: key, ...dayData });

        cursor.setDate(cursor.getDate() + 1);
    }

    return result;
}

async function getEmotionalLogsFromDb(userId, startDate, endDate) {
    let query = supabase
        .from('emotional_log')
        .select('id, timestamp, emotion_label, confidence_score, emotional_score')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });

    // Apply date filter
    if (startDate && endDate) {
        // Validation regex for YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        
        if (dateRegex.test(startDate) && dateRegex.test(endDate)) {
            // Manually construct ISO strings to lock the time range to UTC boundaries
            // This assumes your DB stores timestamps in UTC (Standard practice)
            const startISO = `${startDate}T00:00:00.000Z`;
            const endISO = `${endDate}T23:59:59.999Z`;

            query = query
                .gte("timestamp", startISO)
                .lte("timestamp", endISO);
        }
    }

    const { data, error } = await query;

    if (error) throw error;

    return data;
}

module.exports = {
    findEmotionsByDate,
    findTimeSeries,
    getEmotionsSummary,
    getEmotionsTimeSeries,
    getDailyAggregates,
    getEmotionCountsByDay,
    getEmotionalLogsFromDb,
};
