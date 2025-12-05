import { useEffect, useState } from "react";
import { HiX } from "react-icons/hi";
import Links from "../components/SidebarLinks";
import DashIcon from "../icons/DashIcon";
import ProfileIcon from "../icons/ProfileIcon";
import TablesIcon from "../icons/TablesIcon";
import KanbanIcon from "../icons/KanbanIcon";
import LogOutIcon from "../icons/LogOutIcon";

export const routes = [
    {
        role: "guardian",
        name: "User Management",
        activeKey: "Management",
        path: "/guardian/monitoredUser",
        icon: <DashIcon />
    },
    {
        role: "guardian",
        name: "Analytics",
        activeKey: "Analytics",
        path: "/guardian/analytics",
        icon: <TablesIcon />
    },
    {
        role: "guardian",
        name: "Profile",
        activeKey: "Profile",
        path: "/guardian/profile",
        icon: <ProfileIcon />
    },

    // User routes
    {
        role: "user",
        name: "Dashboard",
        activeKey: "Dashboard",
        path: "/user/dashboard",
        children: [
            { name: 'Main Dashboard', activeKey: 'Main', path: '/user/dashboard/main' },
            { name: 'Emotion Dashboard', activeKey: 'Emotion', path: '/user/dashboard/emotion' },
            { name: 'Activity Dashboard', activeKey: 'Intervention', path: '/user/dashboard/intervention' },
        ],
        icon: <DashIcon />
    },
    {
        role: "user",
        name: "Activities",
        activeKey: "Activities",
        children: [
            { name: 'Journal', activeKey: 'Journal', path: '/user/activities/journal' },
            { name: 'Gratitude', activeKey: 'Gratitude', path: '/user/activities/gratitude' },
        ],
        icon: <KanbanIcon />
    },
    {
        role: "user",
        name: "Access Control",
        activeKey: "Access",
        path: "/user/accessManage",
        icon: <TablesIcon />
    },
    {
        role: "user",
        name: "Profile",
        activeKey: "Profile",
        path: "/user/profile",
        icon: <ProfileIcon />
    },
    {
        role: "user",
        name: "Log Out",
        path: "/",
        icon: <LogOutIcon />,
        logout: true
    }
];

const Sidebar = () => {

    const [isOpen, setIsOpen] = useState(window.innerWidth >= 1000);

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
                    Well<span class="font-medium">-Bot</span>
                </div>
            </div>
            <div class="mt-[58px] mb-7 h-px bg-gray-300" style={{ borderWidth: '1px', borderStyle: "solid", borderColor: "#e9ecef" }} />

            <ul className="mb-auto pt-1">
                <Links routes={routes} />
            </ul>

        </div>
    );
};

export default Sidebar;