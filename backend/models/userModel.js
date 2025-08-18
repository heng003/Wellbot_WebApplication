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

// Find by email
async function findUserByEmail(email) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();

    if (error) return null;
    return data;
}

// Find by username
async function findUserByUsername(username) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
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

// Check if user exists by email and username
async function userExists(email, username) {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .or(`email.eq.${email},username.eq.${username}`)
        .single();

    if (error) return false;
    return data !== null;
}

// Find by id and update
async function findUserById(id) {
    const { data, error } = await supabase
        .from('users')
        .update({
            password: hashedPassword,
            tokenEmail: null
        })
        .eq('id', id)
        .select();

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

module.exports = {
    createUser,
    findUserByEmail,
    findUserByUsername,
    findUserByVerificationToken,
    findUserById,
    updateUserById,
};