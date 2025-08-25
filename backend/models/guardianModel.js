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

// Find by email
async function findGuardianByEmail(email) {
    const { data, error } = await supabase
        .from('guardians')
        .select('*')
        .eq('email', email)
        .single();
    if (error) return null;
    return data;
}

// Find by email or full name
async function findGuardianByEmailOrFullName(email, preferName) {
    const { data, error } = await supabase
        .from('guardians')
        .select('*')
        .or(`email.eq.${email},full_name.eq.${preferName}`)
        .single();

    if (error) return null;
    return data;
}

// Find by verification token
async function findGuardianByVerificationToken(token) {
    const { data, error } = await supabase
        .from('guardians')
        .select('*')
        .eq('verification_token', token)
        .single();

    if (error) return null;
    return data;
}

module.exports = {
    createGuardian,
    findGuardianById,
    findGuardianByEmail,
    findGuardianByEmailOrFullName,
    findGuardianByVerificationToken
};