import { jwtDecode } from 'jwt-decode';

export function getIdFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const decoded = jwtDecode(token);
        return decoded.userId;
    } catch (e) {
        return null;
    }
}

export function getRoleFromToken() {
    const role = localStorage.getItem('role');
    if (!role) return null;
    try {
        return role;
    } catch (e) {
        return null;
    }
}