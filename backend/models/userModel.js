const supabase = require('../config/supabaseClient');

// Insert new user
async function createUser(userData) {
    const { data, error } = await supabase
        .from('users')   // table name in Supabase
        .insert([userData])
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Find user by email
async function findUserByEmail(email) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) return null;
    return data;
}

// Find by verification token
async function findUserByVerificationToken(token) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('verification_token', token)
        .single();

    if (error) return null;
    return data;
}

// Find by id
async function findUserById(id) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

    if (error) return null;
    return data;
}

// Find by a list of ids
async function findUsersByIds(ids) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .in('id', ids);

    if (error) return null;
    return data;
}

// Update user by id
async function updateUserById(id, userData) {
    const { data, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

// Update user preference for intervention
async function updatePreferIntervention(id, preferIntervention) {
    const { data, error } = await supabase
        .from('users')
        .update({ prefer_intervention: preferIntervention })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data;
}

module.exports = {
    createUser,
    findUserByEmail,
    findUserByVerificationToken,
    findUserById,
    findUsersByIds,
    updateUserById,
    updatePreferIntervention,
};