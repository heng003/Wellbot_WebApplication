const supabase = require('../config/supabaseClient');

async function findInterventionsByUserId(userId) {
    const { data, error } = await supabase
        .from('intervention_log')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false })
        .limit(2500); 
    if (error) throw error;
    return data;
}

module.exports = {
    findInterventionsByUserId
};