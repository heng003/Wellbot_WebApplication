const supabase = require('../config/supabaseClient');

async function findEmbeddingsByUserId(userId, startDate, endDate) {
    const p_start = startDate ? new Date(startDate).toISOString() : null;
    const p_end = endDate ? new Date(endDate).toISOString() : null;

    const { data, error } = await supabase
        .rpc('get_enriched_embeddings', {
            user_id_input: userId,
            p_start,
            p_end
        });

    if (error) throw error;
    return data || [];
}

module.exports = {
    findEmbeddingsByUserId
};