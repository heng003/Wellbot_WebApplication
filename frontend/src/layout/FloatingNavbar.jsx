import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    MdNotifications,
    MdNotificationsNone,
    MdSettings,
    MdLogout,
    MdOutlineCalendarToday,
    MdSupervisorAccount
} from "react-icons/md";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { getIdFromToken, getRoleFromToken } from "../utils/auth";
import Swal from "sweetalert2";
import HoverTooltip from "../components/HoverTooltip";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

const FloatingNavbar = ({
    brandText,
    onDateChange,
    startDate,
    endDate,
    showUserFilter,
    wards,
    selectedWardId,
    onUserChange,
    showProfileSettingsOption = true,
    actionButton // { label: string, icon: ReactElement, onClick: function }
}) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [name, setName] = useState(null);
    const [notifications, setNotifications] = useState([]);

    // Dropdown States
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [showNotifMenu, setShowNotifMenu] = useState(false);
    const [showDateMenu, setShowDateMenu] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const [loading, setLoading] = useState(false);

    // Refs for outside click handling
    const profileRef = useRef(null);
    const notifRef = useRef(null);
    const dateRef = useRef(null);
    const userRef = useRef(null);

    // Ensure unique wards to prevent duplicates
    const uniqueWards = useMemo(() => {
        if (!wards) return [];
        return Array.from(
            new Map(wards.map(item => [item.id, item])).values()
        );
    }, [wards]);
    const currentWardName = uniqueWards.find(w => w.id === selectedWardId)?.full_name || "Select User";

    useEffect(() => {
        const id = getIdFromToken();
        const r = getRoleFromToken();
        const n = localStorage.getItem('name');
        setUserId(id);
        setRole(r);
        setName(n);

        // Fetch notifications if user
        if (r === 'user' && id) {
            fetchNotifications(id);
            const interval = setInterval(() => fetchNotifications(id), 30000);
            return () => clearInterval(interval);
        }
    }, [userId]);

    // Tutorial Sequence State
    const [tutorialStep, setTutorialStep] = useState(0); // 0: None, 1: User Filter, 2: Date Filter

    // Determine the tutorial key based on context
    const getTutorialKey = () => {
        if (role === 'guardian') {
            if (brandText === 'Main Dashboard') return 'tutorial_guardian_main_seen';
            if (['Emotion Dashboard', 'Activity Dashboard', 'Chat Map'].includes(brandText)) return 'tutorial_guardian_analytics_seen';
        }
        return 'tutorial_general_seen'; // Fallback for User or other pages
    };

    // Trigger tutorial sequence on mount (Persistence Check)
    useEffect(() => {
        if (tutorialStep !== 0) return;

        const key = getTutorialKey();
        const hasSeen = localStorage.getItem(key);

        if (!hasSeen) {
            // Small delay to let page settle before starting
            const timer = setTimeout(() => {
                const hasUserFilter = showUserFilter && uniqueWards.length > 0;
                const hasDateFilter = !!onDateChange;

                if (hasUserFilter) {
                    setTutorialStep(1);
                } else if (hasDateFilter) {
                    setTutorialStep(2);
                }
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [showUserFilter, uniqueWards, onDateChange, brandText, role, tutorialStep]);

    // Timer Logic for Tutorial Steps (5 seconds per step)
    useEffect(() => {
        if (tutorialStep === 0) return;

        let timer;
        const hasDateFilter = !!onDateChange;

        if (tutorialStep === 1) {
            // Step 1: User Filter -> Wait 5s -> Go to Step 2 (if exists) or Finish
            timer = setTimeout(() => {
                if (hasDateFilter) {
                    setTutorialStep(2);
                } else {
                    completeTutorial();
                }
            }, 5000);
        } else if (tutorialStep === 2) {
            // Step 2: Date Filter -> Wait 5s -> Finish
            timer = setTimeout(() => {
                completeTutorial();
            }, 5000);
        }

        return () => clearTimeout(timer);
    }, [tutorialStep, onDateChange]);

    const completeTutorial = () => {
        setTutorialStep(0);
        const key = getTutorialKey();
        localStorage.setItem(key, 'true');
    };

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setShowProfileMenu(false);
            }
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setShowNotifMenu(false);
            }
            if (dateRef.current && !dateRef.current.contains(event.target)) {
                setShowDateMenu(false);
            }
            if (userRef.current && !userRef.current.contains(event.target)) {
                setShowUserMenu(false);
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
                title: status === 'active' ? t('navbar.alerts.access_granted') : t('navbar.alerts.request_rejected'),
                text: status === 'active' ? t('navbar.alerts.guardian_added') : t('navbar.alerts.guardian_rejected'),
                timer: 1500,
                showConfirmButton: false,
                customClass: {
                    title: 'swal-title',
                }
            });

            setNotifications(prev => prev.filter(n => n.id !== permissionId));
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: t('navbar.alerts.error'),
                text: err.response?.data?.message || t('navbar.alerts.failed_update'),
                customClass: {
                    title: 'swal-title',
                }
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        const result = await Swal.fire({
            title: t('navbar.logout_modal.title'),
            text: t('navbar.logout_modal.text'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t('navbar.logout_modal.confirm'),
            cancelButtonText: t('navbar.logout_modal.cancel'),
            confirmButtonColor: "var(--primary-color)",
            customClass: {
                title: "swal-title"
            }
        });

        if (result.isConfirmed) {
            localStorage.removeItem("token");
            localStorage.removeItem("name");
            localStorage.removeItem('tutorial_guardian_main_seen');
            localStorage.removeItem('tutorial_guardian_analytics_seen');
            localStorage.removeItem('tutorial_general_seen');
            navigate("/");
        }
    };

    return (
        <nav className="sticky top-4 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 px-2 py-3 backdrop-blur-xl mb-4" style={{ zIndex: 99 }}>

            {/* Left Side: Breadcrumbs / Title */}
            <div className="ml-[6px]">
                <div className="h-6 pt-1">
                    <a className="text-sm font-normal text-navy-700 hover:underline" href="#">
                        {t('navbar.pages')}
                        <span className="mx-1 text-sm text-navy-700 hover:text-navy-700"> / </span>
                    </a>
                    <a className="text-sm font-normal capitalize text-navy-700 hover:underline" href="#">
                        {brandText}
                    </a>
                </div>
                <p className="shrink text-[30px] capitalize text-navy-700">
                    <a className="font-bold capitalize hover:text-navy-700" href="#">
                        {brandText}
                    </a>
                </p>
            </div>

            {/* Right Side: Actions */}
            <div className="flex items-center gap-4">

                {/* Extra Action Button (e.g. Add Item) */}
                {actionButton && (
                    <HoverTooltip content={actionButton.label} placement="bottom">
                        <button
                            onClick={actionButton.onClick}
                            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#3E9389] shadow-lg hover:bg-[#2F756D] transition-all text-white border-2 border-[#3E9389] hover:opacity-80"
                        >
                            {actionButton.icon}
                        </button>
                    </HoverTooltip>
                )}

                {/* Guardian User Filter (Custom Dropdown) */}
                {showUserFilter && (
                    <div className="relative" ref={userRef}>
                        <HoverTooltip
                            content={<>{t('navbar.select_user_tooltip')} {currentWardName !== "Select User" && <>, {t('navbar.current_user')}: <span className="font-semibold">{currentWardName}</span></>}</>}
                            placement="bottom"
                            forceVisible={tutorialStep === 1}
                        >
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all border-2 border-white overflow-hidden ${tutorialStep === 1 ? "bg-white ring-4 ring-[#3E9389] scale-110" : "bg-white hover:bg-gray-50"} text-[#3E9389] hover:opacity-80`}
                            >
                                <MdSupervisorAccount className="h-7 w-7" />
                            </button>
                        </HoverTooltip>

                        {showUserMenu && (
                            <div className="absolute right-0 top-14 mt-2 w-80 rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[1000] max-h-[300px] overflow-y-auto">
                                <div className="px-4 py-3 border-b border-gray-300">
                                    <p className="text-sm font-bold text-navy-700">{t('navbar.monitored_users')}</p>
                                </div>
                                <div className="p-2 flex flex-col gap-1">
                                    {uniqueWards.length > 0 ? (
                                        uniqueWards.map((ward) => (
                                            <button
                                                key={ward.id}
                                                onClick={() => {
                                                    onUserChange(ward.id);
                                                    setShowUserMenu(false);
                                                }}
                                                className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-colors text-left ${selectedWardId === ward.id
                                                    ? "bg-[#3E9389]/10 text-[#3E9389] font-medium"
                                                    : "text-gray-700 hover:bg-gray-100"
                                                    }`}
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-gray-500 shrink-0">
                                                    {ward.full_name ? ward.full_name.charAt(0).toUpperCase() : "U"}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-black truncate">{ward.full_name || t('navbar.unknown_user')}</span>
                                                    <span className="text-xs text-gray-700 truncate">{ward.email}</span>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="px-3 py-2 text-sm text-gray-500 text-center">
                                            {t('navbar.no_monitored_users')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Date Filter */}
                {onDateChange && (
                    <div className="relative" ref={dateRef}>
                        <HoverTooltip
                            content={t('navbar.select_date_tooltip')}
                            placement="bottom"
                            forceVisible={tutorialStep === 2}
                        >
                            <button
                                onClick={() => setShowDateMenu(!showDateMenu)}
                                className={`flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all ${tutorialStep === 2 ? "bg-white ring-4 ring-[#3E9389] scale-110" : "bg-white hover:bg-gray-50"} text-[#3E9389] hover:opacity-80`}
                            >
                                <MdOutlineCalendarToday className="h-7 w-7" />
                            </button>
                        </HoverTooltip>

                        {showDateMenu && (
                            <div className="absolute right-0 top-14 mt-2 bg-white border rounded-lg shadow-xl px-4 py-4 z-50 text-black min-w-[250px] text-left ring-1 ring-black ring-opacity-5">
                                <p className="pb-2 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                    {t('navbar.filter_date_range')}
                                </p>
                                <DatePicker
                                    selected={startDate}
                                    onChange={(dates) => {
                                        const [start, end] = dates;
                                        onDateChange(start, end);
                                    }}
                                    startDate={startDate}
                                    endDate={endDate}
                                    selectsRange
                                    inline
                                />
                                <div className="mt-2 flex justify-end">
                                    <button
                                        onClick={() => setShowDateMenu(false)}
                                        className="text-xs text-gray-500 hover:text-gray-700 underline"
                                    >
                                        {t('navbar.close')}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}


                {/* Notification Bell (User Only) - HIDDEN if not user */}
                {role === 'user' && (
                    <div className="relative" ref={notifRef}>
                        <HoverTooltip content={t('navbar.notifications_tooltip')} placement="bottom">
                            <button
                                onClick={() => setShowNotifMenu(!showNotifMenu)}
                                className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all text-gray-600 hover:opacity-80"
                            >
                                {notifications.length > 0 ? (
                                    <div className="relative">
                                        <MdNotifications className="h-7 w-7 text-[#3E9389]" />
                                        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white border-2 border-white">
                                            {notifications.length}
                                        </span>
                                    </div>
                                ) : (
                                    <MdNotificationsNone className="h-7 w-7" />
                                )}
                            </button>
                        </HoverTooltip>

                        {showNotifMenu && (
                            <div className="absolute right-0 top-14 mt-2 w-80 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[1000] max-h-[400px] overflow-y-auto">
                                <div className="px-4 py-3 flex items-center justify-between border-b border-gray-300">
                                    <p className="text-sm font-semibold text-navy-700">{t('navbar.notifications_header')}</p>
                                    <span className="text-xs text-gray-500">
                                        {notifications.length} {t('navbar.pending')}
                                    </span>
                                </div>

                                {notifications.length === 0 ? (
                                    <p className="text-sm text-gray-500 p-4 text-center">{t('navbar.no_new_notifications')}</p>
                                ) : (
                                    <div className="flex flex-col p-4 gap-3">
                                        {notifications.map((notif) => (
                                            <div key={notif.id} onClick={() => navigate("/user/accessManage")} className="flex flex-col rounded-lg bg-gray-50 p-3 shadow-sm border border-gray-100 hover:opacity-80 cursor-pointer">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-bold text-navy-700">{notif.guardianName || t('navbar.unknown_guardian')}</p>
                                                        <p className="text-xs text-gray-500 mt-1">{t('navbar.requesting_access')}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-3 flex gap-2 justify-end">
                                                    <button
                                                        onClick={() => handleAction(notif.id, 'rejected')}
                                                        disabled={loading}
                                                        className="flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-[10px] font-medium text-red-600 hover:bg-red-100"
                                                    >
                                                        {t('navbar.reject')}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(notif.id, 'active')}
                                                        disabled={loading}
                                                        className="flex items-center gap-1 rounded-md bg-[#3E9389] px-3 py-1.5 text-[10px] font-medium text-white hover:bg-[#2F756D]"
                                                    >
                                                        {t('navbar.approve')}
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

                {/* Language Switcher */}
                <LanguageSwitcher variant="icon" />

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                    <HoverTooltip content={showProfileSettingsOption ? t('navbar.profile_settings_tooltip') : t('navbar.logout_tooltip')} placement="bottom">
                        <button
                            onClick={() => setShowProfileMenu(!showProfileMenu)}
                            className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all border-4 border-white overflow-hidden hover:opacity-80"
                        >
                            <img src="/Images/avatar_green.png" alt="Profile" className="h-full w-full object-cover" />
                        </button>
                    </HoverTooltip>

                    {showProfileMenu && (
                        <div className="absolute right-0 top-14 mt-2 w-56 origin-top-right rounded-xl bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[1000]">
                            <div className="px-4 py-3 border-b border-gray-300">
                                <p className="text-sm font-bold text-navy-700">{t('navbar.hey', { name: name || "User" })}</p>
                            </div>
                            <div className="p-2 flex flex-col gap-1">
                                {showProfileSettingsOption && (
                                    <Link
                                        to={role === 'guardian' ? "/guardian/profile" : "/user/profile"}
                                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                        onClick={() => setShowProfileMenu(false)}
                                    >
                                        <MdSettings className="h-4 w-4" /> {t('navbar.profile_settings')}
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors text-left font-medium"
                                >
                                    <MdLogout className="h-4 w-4" /> {t('navbar.logout')}
                                </button>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default FloatingNavbar;
