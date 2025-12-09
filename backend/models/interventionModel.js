const supabase = require('../config/supabaseClient');

async function findInterventionsByUserId(userId, startDate, endDate) {

    // Convert dates to ISO UTC boundaries
    let p_start = null;
    let p_end = null;

    if (startDate && endDate) {
        p_start = `${startDate}T00:00:00.000Z`;
        p_end   = `${endDate}T23:59:59.999Z`;
    }

    const { data, error } = await supabase.rpc(
        "get_interventions_by_user",
        {
            p_user: userId,
            p_start,
            p_end,
            p_limit: 2500
        }
    );

    if (error) throw error;
    return data || [];
}

module.exports = {
    findInterventionsByUserId
};