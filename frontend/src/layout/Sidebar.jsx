import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import Links from "../components/SidebarLinks";
import HomeIcon from "../icons/HomeIcon";
import ProfileIcon from "../icons/ProfileIcon";
import TablesIcon from "../icons/TablesIcon";
import KanbanIcon from "../icons/KanbanIcon";
import LogOutIcon from "../icons/LogOutIcon";
import ChartIcon from "../icons/ChartIcon";
import ReportIcon from "../icons/ReportIcon";

import { useTranslation } from "react-i18next";

const Sidebar = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 1000);

    const routes = [
        {
            role: "guardian",
            name: t('sidebar.user_care_panel'),
            activeKey: "Management",
            path: "/guardian/monitoredUser",
            icon: <HomeIcon />
        },
        {
            role: "guardian",
            name: t('sidebar.dashboard'),
            activeKey: "Dashboard",
            path: "/guardian/dashboard",
            children: [
                { name: t('sidebar.main_dashboard'), activeKey: 'Main', path: '/guardian/dashboard/main' },
                { name: t('sidebar.emotional_dashboard'), activeKey: 'Emotion', path: '/guardian/dashboard/emotion' },
                { name: t('sidebar.activity_dashboard'), activeKey: 'Intervention', path: '/guardian/dashboard/activity' },
                { name: t('sidebar.chatmap_dashboard'), activeKey: 'ChatMap', path: '/guardian/dashboard/chatMap' },
            ],
            icon: <ChartIcon />
        },
        {
            role: "guardian",
            name: t('sidebar.report'),
            activeKey: "Report",
            path: "/guardian/report",
            icon: <TablesIcon />
        },
        {
            role: "guardian",
            name: t('sidebar.profile'),
            activeKey: "Profile",
            path: "/guardian/profile",
            icon: <ProfileIcon />
        },
        {
            role: "guardian",
            name: t('sidebar.log_out'),
            path: "/",
            icon: <LogOutIcon />,
            logout: true
        },

        // User routes
        {
            role: "user",
            name: t('sidebar.dashboard'),
            activeKey: "Dashboard",
            path: "/user/dashboard",
            children: [
                { name: t('sidebar.main_dashboard'), activeKey: 'Main', path: '/user/dashboard/main' },
                { name: t('sidebar.emotional_dashboard'), activeKey: 'Emotion', path: '/user/dashboard/emotion' },
                { name: t('sidebar.activity_dashboard'), activeKey: 'Intervention', path: '/user/dashboard/activity' },
                { name: t('sidebar.chatmap_dashboard'), activeKey: 'ChatMap', path: '/user/dashboard/chatMap' },
            ],
            icon: <HomeIcon />
        },
        {
            role: "user",
            name: t('sidebar.activities'),
            activeKey: "Activities",
            children: [
                { name: t('sidebar.journal'), activeKey: 'Journal', path: '/user/activities/journal' },
                { name: t('sidebar.gratitude'), activeKey: 'Gratitude', path: '/user/activities/gratitude' },
            ],
            icon: <KanbanIcon />
        },
        {
            role: "user",
            name: t('sidebar.access_control'),
            activeKey: "Access",
            path: "/user/accessManage",
            icon: <TablesIcon />
        },
        {
            role: "user",
            name: t('sidebar.report'),
            activeKey: "Report",
            path: "/user/report",
            icon: <ReportIcon />
        },
        {
            role: "user",
            name: t('sidebar.profile'),
            activeKey: "Profile",
            path: "/user/profile",
            icon: <ProfileIcon />
        },
        {
            role: "user",
            name: t('sidebar.log_out'),
            path: "/",
            icon: <LogOutIcon />,
            logout: true
        }
    ];

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1000) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={`sm:none duration-175 linear fixed !z-50 flex min-h-full flex-col bg-white pb-10 shadow-2xl shadow-white/5 transition-alld md:!z-50 lg:!z-50 xl:!z-0
                ${isOpen ? "translate-x-0" : "-translate-x-96"}`
        } style={{ width: '280px' }}
        >
            <span
                className="absolute top-4 right-4 block cursor-pointer xl:hidden"
                onClick={() => setIsOpen(false)}
            >
                <HiX />
            </span>

            <div className={`mx-[56px] mt-[50px] flex items-center justify-center`}>
                <div className="mt-1 ml-1 h-2.5 font-poppins text-[26px] font-bold uppercase text-navy-700">
                    {t('app.title')}<span className="font-medium"></span>
                </div>
            </div>
            <div className="mt-[58px] mb-7 h-px bg-gray-300" style={{ borderWidth: '1px', borderStyle: "solid", borderColor: "#E9ECEF" }} />

            <ul className="mb-auto pt-1">
                <Links routes={routes} />
            </ul>

        </div>
    );
};

export default Sidebar;