const supabase = require('../config/supabaseClient');

async function findInterventionsByUserId(userId) {
    const { data, error } = await supabase
        .from('intervention_log')
        .select('*')
        .eq('user_id', userId)
        // order by timestamp column (matches schema)
        .order('timestamp', { ascending: false });
    if (error) throw error;
    return data;
}

module.exports = {
    findInterventionsByUserId,
}