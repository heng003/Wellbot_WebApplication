import React, { useState } from "react";

const HoverTooltip = ({ children, content, placement = "top", forceVisible = false }) => {
    const [show, setShow] = useState(false);

    // Position logic
    let positionClass = "";
    switch (placement) {
        case "top": positionClass = "bottom-full left-1/2 -translate-x-1/2 mb-2"; break;
        case "bottom": positionClass = "top-full left-1/2 -translate-x-1/2 mt-2"; break;
        case "left": positionClass = "right-full top-1/2 -translate-y-1/2 mr-2"; break;
        case "right": positionClass = "left-full top-1/2 -translate-y-1/2 ml-2"; break;
        default: positionClass = "bottom-full left-1/2 -translate-x-1/2 mb-2";
    }

    const isVisible = show || forceVisible;

    return (
        <div
            // 'inline-flex' ensures the wrapper wraps tightly around whatever child you pass
            className="relative inline-flex items-center"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {/* This can be a button, div, span, text, image, anything! */}
            {children}

            {/* The Tooltip Popup */}
            {isVisible && (
                <div
                    className={`
                        absolute ${positionClass}
                        z-[300] whitespace-nowrap
                        p-3 
                        text-xs font-medium text-white 
                        bg-gray-800 rounded shadow-lg
                        pointer-events-none
                        transition-opacity duration-200
                    `}
                >
                    {content}
                    {/* Tooltip Arrow */}
                    {placement === "top" && (
                        <div className="absolute top-full left-1/2 -translate-x-1/2 
                  border-4 border-transparent border-t-gray-800" />
                    )}

                    {placement === "bottom" && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 
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

                </div>
            )}
        </div>
    );
};

export default HoverTooltip;