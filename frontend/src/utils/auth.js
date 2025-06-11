import { jwtDecode } from 'jwt-decode';

export function getGuardianIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.userId;
    } catch (e) {
        return null;
    }
}