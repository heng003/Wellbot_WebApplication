const supabase = require('../config/supabaseClient');

// Setup for tracking active user subscriptions
const userChannels = new Map();

/**
 * Subscribes to Realtime changes for a specific user.
 * It uses reference counting to handle multiple connections (tabs) for the same user.
 */
const subscribeUser = (userId, io) => {
    if (!userId) return;

    // Check if we already have a subscription for this user
    if (userChannels.has(userId)) {
        const entry = userChannels.get(userId);
        entry.refCount += 1;
        // console.log(`User ${userId} refCount increased to ${entry.refCount}`);
        return;
    }

    console.log(`Subscribing to realtime updates for user: ${userId}`);

    // Handler for changes
    const handleRecordChange = (payload) => {
        console.log('Change received for user:', userId, payload);
        const { eventType, table } = payload;

        // Emit to the user's specific room
        io.to(`user_${userId}`).emit('data_update', {
            table: table,
            type: eventType,
            timestamp: new Date().toISOString()
        });
    };

    // Create a new channel specifically for this user
    const channel = supabase.channel(`realtime:${userId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'emotional_log', filter: `user_id=eq.${userId}` }, handleRecordChange)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'intervention_log', filter: `user_id=eq.${userId}` }, handleRecordChange)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wb_embeddings', filter: `user_id=eq.${userId}` }, handleRecordChange)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wb_journal', filter: `user_id=eq.${userId}` }, handleRecordChange)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'wb_gratitude_item', filter: `user_id=eq.${userId}` }, handleRecordChange)
        .subscribe((status, err) => {
            if (status === 'SUBSCRIBED') {
                // console.log(`Subscribed to realtime channels for user ${userId}`);
            } else if (status === 'CHANNEL_ERROR') {
                console.error(`Realtime subscription error for user ${userId}:`, err);
            }
        });

    // Store in map with refCount 1
    userChannels.set(userId, { channel, refCount: 1 });
};

/**
 * Unsubscribes a user. 
 * Decrements ref count and removes the channel if count reaches 0.
 */
const unsubscribeUser = (userId) => {
    if (!userId || !userChannels.has(userId)) return;

    const entry = userChannels.get(userId);
    entry.refCount -= 1;

    if (entry.refCount <= 0) {
        console.log(`Unsubscribing user: ${userId}`);
        entry.channel.unsubscribe();
        userChannels.delete(userId);
    } else {
        // console.log(`User ${userId} refCount decreased to ${entry.refCount}`);
    }
};

module.exports = { subscribeUser, unsubscribeUser };
