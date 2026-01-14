import React, { useState, useRef } from "react";
import { createPortal } from "react-dom";

const HoverTooltip = ({
    children,
    content,
    placement = "top",
    forceVisible = false,
}) => {
    const [show, setShow] = useState(false);
    const triggerRef = useRef(null);

    const isVisible = show || forceVisible;

    const getPositionStyle = () => {
        if (!triggerRef.current) return {};

        const rect = triggerRef.current.getBoundingClientRect();
        const gap = 8;

        switch (placement) {
            case "top":
                return {
                    top: rect.top - gap,
                    left: rect.left + rect.width / 2,
                    transform: "translate(-50%, -100%)",
                };
            case "bottom":
                return {
                    top: rect.bottom + gap,
                    left: rect.left + rect.width / 2,
                    transform: "translateX(-50%)",
                };
            case "left":
                return {
                    top: rect.top + rect.height / 2,
                    left: rect.left - gap,
                    transform: "translate(-100%, -50%)",
                };
            case "right":
                return {
                    top: rect.top + rect.height / 2,
                    left: rect.right + gap,
                    transform: "translateY(-50%)",
                };
            default:
                return {};
        }
    };

    return (
        <>
            {/* Trigger */}
            <div
                ref={triggerRef}
                className="inline-flex items-center"
                onMouseEnter={() => setShow(true)}
                onMouseLeave={() => setShow(false)}
            >
                {children}
            </div>

            {/* Tooltip Portal */}
            {isVisible &&
                createPortal(
                    <div
                        className="fixed whitespace-nowrap p-3 text-xs font-medium text-white
                                   bg-gray-800 rounded shadow-lg pointer-events-none
                                   transition-opacity duration-200"
                        style={{
                            ...getPositionStyle(),
                            zIndex: 9999,
                        }}
                    >
                        {content}

                        {/* Arrow */}
                        {placement === "top" && (
                            <div className="absolute left-1/2 top-full -translate-x-1/2
                                            border-4 border-transparent border-t-gray-800" />
                        )}
                        {placement === "bottom" && (
                            <div className="absolute left-1/2 bottom-full -translate-x-1/2
                                            border-4 border-transparent border-b-gray-800" />
                        )}
                        {placement === "left" && (
                            <div className="absolute left-full top-1/2 -translate-y-1/2
                                            border-4 border-transparent border-l-gray-800" />
                        )}
                        {placement === "right" && (
                            <div className="absolute right-full top-1/2 -translate-y-1/2
                                            border-4 border-transparent border-r-gray-800" />
                        )}
                    </div>,
                    document.body
                )}
        </>
    );
};

export default HoverTooltip;