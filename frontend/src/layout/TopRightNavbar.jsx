import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MdNotifications, MdNotificationsNone, MdPerson, MdSettings, MdLogout, MdCheck, MdClose } from "react-icons/md";
import { getIdFromToken, getRoleFromToken } from "../utils/auth";
import Swal from "sweetalert2";
import LanguageSwitcher from "../components/LanguageSwitcher";

const TopRightNavbar = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifMenu, setShowNotifMenu] = useState(false);
    const [loading, setLoading] = useState(false);

    const name = localStorage.getItem('name');

    const profileRef = useRef(null);
    const notifRef = useRef(null);

    useEffect(() => {
        const id = getIdFromToken();
        const r = getRoleFromToken();
        setUserId(id);
        setRole(r);

        // Fetch notifications if user
        if (r === 'user' && id) {
            fetchNotifications(id);
            // Optional: Poll every 30 seconds
            const interval = setInterval(() => fetchNotifications(id), 30000);
            return () => clearInterval(interval);
        }
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchNotifications = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(`/api/permission/user/getPendingRequests/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNotifications(res.data || []);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    const handleAction = async (permissionId, status) => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            await axios.patch("/api/permission/user/updateRequestStatus",
                { permissionId, status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            Swal.fire({
                icon: "success",
                title: status === 'active' ? "Access Granted" : "Request Rejected",
                text: status === 'active' ? "Guardian has been added." : "Guardian request rejected.",
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    title: 'swal-title',
                }
            });

            // Remove from list locally
            setNotifications(prev => prev.filter(n => n.id !== permissionId));
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.response?.data?.message || "Failed to update status",
                customClass: {
                    title: 'swal-title',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    return (
        <div className="fixed z-[999] flex items-center gap-3" style={{ top: "2rem", right: "2rem" }}>
            <LanguageSwitcher />
            {/* Notification Bell (User Only) */}
            {role === 'user' && (
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setShowNotifMenu(!showNotifMenu)}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-100 dark:bg-navy-800 text-gray-600"
                    >
                        {notifications.length > 0 ? (
                            <MdNotifications className="h-6 w-6 text-[#3E9389]" />
                        ) : (
                            <MdNotificationsNone className="h-6 w-6" />
                        )}
                        {notifications.length > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                                {notifications.length}
                            </span>
                        )}
                    </button>

                    {showNotifMenu && (
                        <div className="absolute right-0 mt-3 w-80 origin-top-right rounded-xl bg-white p-4 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[1000] max-h-[400px] overflow-y-auto">
                            <div className="mb-3 flex items-center justify-between">
                                <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                <span className="text-xs text-gray-500">{notifications.length} Pending</span>
                            </div>

                            {notifications.length === 0 ? (
                                <p className="text-sm text-gray-500 py-4 text-center">No new notifications</p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className="flex flex-col rounded-lg bg-gray-50 p-3 shadow-sm border border-gray-100">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-sm font-bold text-navy-700">{notif.guardianName || "Unknown Guardian"}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Requesting access to your data</p>
                                                    {notif.message && (
                                                        <p className="text-xs text-gray-600 italic mt-1 bg-white p-1 rounded border border-gray-100">"{notif.message}"</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-3 flex gap-2 justify-end">
                                                <button
                                                    onClick={() => handleAction(notif.id, 'rejected')}
                                                    disabled={loading}
                                                    className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                                                >
                                                    <MdClose /> Reject
                                                </button>
                                                <button
                                                    onClick={() => handleAction(notif.id, 'active')}
                                                    disabled={loading}
                                                    className="flex items-center gap-1 rounded-md bg-[#3E9389] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#2F756D] transition-colors shadow-sm"
                                                >
                                                    <MdCheck /> Approve
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
                <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition-all hover:bg-gray-100 dark:bg-navy-800 text-gray-600 overflow-hidden border border-white"
                >
                    <MdPerson className="h-6 w-6 text-gray-600" />
                </button>

                {showProfileMenu && (
                    <div className="absolute right-0 mt-3 w-48 origin-top-right rounded-xl bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[1000]">
                        <div className="px-4 py-3 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900 truncate">👋 Hey, <span className="text-gray-500 font-semibold capitalize">{name || "User"}</span></p>
                        </div>

                        <Link
                            to={role === 'guardian' ? "/guardian/profile" : "/user/profile"}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                        >
                            <MdSettings className="h-4 w-4" /> Profile Settings
                        </Link>

                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                            <MdLogout className="h-4 w-4" /> Log Out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TopRightNavbar;
