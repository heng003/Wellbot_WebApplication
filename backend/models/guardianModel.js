const supabase = require('../config/supabaseClient');

// Insert new guardian
async function createGuardian(guardianData) {
    const { data, error } = await supabase
        .from('guardians')
        .insert([guardianData])
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Find by id
async function findGuardianById(id) {
    const { data, error } = await supabase
        .from('guardians')
        .select('*')
        .eq('id', id)
        .single();
    if (error) return null;
    return data;
}

// Find by email or username
async function findGuardianByEmailOrUsername(identifier) {
    const { data, error } = await supabase
        .from('guardians')
        .select('*')
        .or(`email.eq.${identifier},username.eq.${identifier}`)
        .single();
    if (error) return null;
    return data;
}

// Find by username (exclude current id)
async function findGuardianByUsernameExcludeId(username, excludeId) {
    const { data, error } = await supabase
        .from('guardians')
        .select('*')
        .eq('username', username)
        .neq('id', excludeId)
        .single();
    if (error) return null;
    return data;
}

module.exports = {
    createGuardian,
    findGuardianById,
    findGuardianByEmailOrUsername,
    findGuardianByUsernameExcludeId,
};