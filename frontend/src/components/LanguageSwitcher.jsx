import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLanguage } from "react-icons/md";
import axios from 'axios';
import Swal from 'sweetalert2';
import HoverTooltip from "./HoverTooltip";

const LanguageSwitcher = ({ variant = 'default' }) => {
    const { t, i18n } = useTranslation();
    const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const changeLanguage = async (lng) => {
        // Confirmation Modal
        const result = await Swal.fire({
            title: t('profile.alerts.confirm_language_change') || "Change Language?",
            text: t('profile.alerts.confirm_language_desc') || "Are you sure you want to change the language?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "var(--primary-color)",
            confirmButtonText: t('profile.buttons.yes') || "Yes",
            cancelButtonText: t('profile.buttons.cancel') || "Cancel",
            customClass: {
                title: 'swal-title',
            }
        });

        if (result.isConfirmed) {
            i18n.changeLanguage(lng);
            setShowMenu(false);
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await axios.put('/api/profile/userProfile', { websiteLanguage: lng }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    Swal.fire({
                        title: t('profile.alerts.success'),
                        text: t('profile.alerts.language_updated') || "Language updated successfully!",
                        icon: "success",
                        confirmButtonColor: "var(--primary-color)",
                        customClass: {
                            title: 'swal-title',
                        }
                    });
                } catch (error) {
                    console.error("Failed to update website language", error);
                    // Optional: Show error
                }
            }
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 992);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const languages = [
        { code: 'en', label: 'English' },
        { code: 'ms', label: 'Bahasa Melayu' },
        { code: 'zh', label: '华文 (Chinese)' }
    ];

    const Trigger = () => {
        if (variant === 'icon') {
            return (
                <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all text-gray-600 hover:opacity-80"
                >
                    <MdLanguage className="h-7 w-7" />
                </button>
            );
        } else if (variant === 'nav-icon') {
            return (
                <div className={isMobile ? "nav-link" : "mr-10"}>
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className="text-gray-300 hover:opacity-60 transition-colors rounded-full"
                        title={languages.find(l => l.code === i18n.language)?.label || "Change Language"}
                    >
                        <MdLanguage className="h-7 w-7" />
                    </button>
                </div>
            );
        }
        return (
            <div
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-1 text-gray-600 hover:text-[#3E9389] transition-colors cursor-pointer p-2 rounded-lg hover:bg-gray-100"
            >
                <MdLanguage className="h-6 w-6" />
                <span className="text-sm font-medium uppercase">{i18n.language ? i18n.language.split('-')[0] : 'en'}</span>
            </div>
        );
    };

    return (
        <div className="relative inline-flex items-center" ref={menuRef}>
            {variant === 'icon' ? (
                <HoverTooltip content={t('profile.labels.change_language') || "Change Language"} placement="bottom">
                    <Trigger />
                </HoverTooltip>
            ) : (
                <Trigger />
            )}

            {showMenu && (
                <div className={`absolute right-0 mt-2 w-56 rounded-xl bg-white py-1 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-[1000] ${variant === 'icon' ? 'top-14' : variant === 'navbar' ? 'top-12' : 'top-10'
                    }`}>
                    <div className="px-4 py-3 border-b border-gray-300">
                        <p className="text-sm font-bold text-navy-700">{t('profile.labels.change_language') || "Change Language"}</p>
                    </div>

                    <div className="p-2 flex flex-col gap-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => changeLanguage(lang.code)}
                                className={`flex w-full items-center gap-2 px-3 py-2 text-sm text-left rounded-md transition-colors ${i18n.language === lang.code ? 'bg-[#3E9389]/10 text-[#3E9389] font-bold' : 'text-gray-900 hover:bg-gray-100'
                                    }`}
                            >
                                {lang.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;
