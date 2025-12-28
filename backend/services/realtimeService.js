const supabase = require('../config/supabaseClient');

const setupRealtimeSubscriptions = (io) => {
    console.log("Initializing Supabase Realtime Subscriptions...");

    const handleRecordChange = (payload) => {
        console.log('Change received!', payload);
        const { eventType, new: newRecord, old: oldRecord, table } = payload;

        let userId = null;
        if (newRecord && newRecord.user_id) {
            userId = newRecord.user_id;
        } else if (oldRecord && oldRecord.user_id) {
            userId = oldRecord.user_id;
        }

        if (userId) {
            // Emit to the specific user's room
            // Event structure: { table, eventType, timestamp }
            // We send minimal data to trigger a refetch
            io.to(`user_${userId}`).emit('data_update', {
                table: table,
                type: eventType,
                timestamp: new Date().toISOString()
            });
            console.log(`Emitted update for table ${table} to user_${userId}`);
        }
    };

    // Subscribe to changes in relevant tables
    supabase
        .channel('dashboard-db-changes')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'emotional_log' },
            handleRecordChange
        )
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'intervention_log' },
            handleRecordChange
        )
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'wb_embeddings' },
            handleRecordChange
        )
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'wb_journal' },
            handleRecordChange
        )
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'wb_gratitude_item' },
            handleRecordChange
        )
        .subscribe((status) => {
            console.log('Supabase Realtime Status:', status);
        });
};

module.exports = setupRealtimeSubscriptions;
