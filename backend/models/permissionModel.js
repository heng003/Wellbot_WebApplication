const supabase = require('../config/supabaseClient');

// Insert new permission
async function createPermission(permissionData) {
    const { data, error } = await supabase
        .from('permissions')
        .insert([permissionData])
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Find permission by guardianId and userId
async function findPermissionByGuardianAndUser(guardianId, userId) {
    const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .eq('guardian_id', guardianId)
        .eq('user_id', userId)
        .single();
    if (error) return null;
    return data;
}

// Find permission by id
async function findPermissionById(id) {
    const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .eq('id', id)
        .single();
    if (error) return null;
    return data;
}

// Delete permission by id
async function deletePermissionById(id) {
    const { error } = await supabase
        .from('permissions')
        .delete()
        .eq('id', id);
    if (error) throw error;
}

// Delete permission by guardianId and userId
async function deletePermissionByGuardianAndUser(guardianId, userId) {
    const { error } = await supabase
        .from('permissions')
        .delete()
        .eq('guardian_id', guardianId)
        .eq('user_id', userId);
    if (error) throw error;
}

// Find all permissions by guardianId
async function findPermissionsByGuardianId(guardianId) {
    const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .eq('guardian_id', guardianId);
    if (error) return [];
    return data;
}

// Find all permissions by userId and status
async function findPermissionsByUserIdAndStatus(userId, status) {
    const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', status);
    if (error) return [];
    return data;
}

// Update permission status by id
async function updatePermissionStatusById(id, status) {
    const { data, error } = await supabase
        .from('permissions')
        .update({ status, updated_at: new Date() })
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Count active guardians for a user
async function countActiveGuardians(userId) {
    const { count, error } = await supabase
        .from('permissions')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'active');
    if (error) throw error;
    return count;
}

module.exports = {
    createPermission,
    findPermissionByGuardianAndUser,
    findPermissionById,
    deletePermissionById,
    deletePermissionByGuardianAndUser,
    findPermissionsByGuardianId,
    findPermissionsByUserIdAndStatus,
    updatePermissionStatusById,
    countActiveGuardians,
};