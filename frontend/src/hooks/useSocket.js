import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_WELLBOT_BACKEND_URL || 'http://localhost:5000';

/**
 * Hook to subscribe to realtime updates for specific tables.
 * @param {Array<string>} tables - List of table names to listen for (e.g. ['emotional_log'])
 * @param {Function} onUpdate - Callback function to run when update occurs.
 * @param {number} debounceMs - Debounce time in ms (default 2000ms).
 */
export const useSocketSubscription = (tables, onUpdate, debounceMs = 2000) => {
    const socketRef = useRef(null);
    const timeoutRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) return;

        // Initialize Socket
        socketRef.current = io(SOCKET_URL, {
            auth: { token },
            withCredentials: true
        });

        socketRef.current.on('connect', () => {
            console.log('Socket connected');
        });

        socketRef.current.on('connect_error', (err) => {
            console.error('Socket connection error:', err);
        });

        // Listen for data updates
        socketRef.current.on('data_update', (data) => {
            if (tables.includes(data.table)) {
                // console.log('Realtime update received:', data);

                // Debounce the callback
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }

                timeoutRef.current = setTimeout(() => {
                    if (onUpdate) onUpdate();
                }, debounceMs);
            }
        });

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [JSON.stringify(tables), onUpdate, debounceMs]);
};
