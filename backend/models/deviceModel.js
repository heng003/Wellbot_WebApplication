const supabase = require('../config/supabaseClient');

// Insert new device
async function createDevice(deviceData) {
    const { data, error } = await supabase
        .from('devices')
        .insert([deviceData])
        .select()
        .single();
    if (error) throw error;
    return data;
}

// Find device by serial number and status
async function findDeviceBySerialAndStatus(serialNumber, status) {
    const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('serial_number', serialNumber)
        .eq('status', status)
        .single();
    if (error) return null;
    return data;
}

// Find device by id
async function findDeviceById(id) {
    const { data, error } = await supabase
        .from('devices')
        .select('*')
        .eq('id', id)
        .single();
    if (error) return null;
    return data;
}

// Update device by id
async function updateDeviceById(id, deviceData) {
    const { data, error } = await supabase
        .from('devices')
        .update(deviceData)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

module.exports = {
    createDevice,
    findDeviceBySerialAndStatus,
    findDeviceById,
    updateDeviceById,
};