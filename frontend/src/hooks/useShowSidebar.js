import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export const useShowSidebar = () => {
    const { pathname } = useLocation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (pathname.startsWith("/guardian") || pathname.startsWith("/user")) && windowWidth >= 1200;
};