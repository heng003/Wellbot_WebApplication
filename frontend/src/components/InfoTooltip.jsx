import React, { useState } from "react";
import { MdInfoOutline } from "react-icons/md";

const InfoTooltip = ({ content, placement = "left", iconSize = "w-5 h-5" }) => {
    const [show, setShow] = useState(false);

    // Determine position based on prop
    // margins added to create slight spacing between icon and tooltip
    let positionClasses = "";

    switch (placement) {
        case "top-left":
            positionClasses = "bottom-full left-0 mb-2";
            break;
        case "top-right":
            positionClasses = "bottom-full right-0 mb-2";
            break;
        case "left":
            positionClasses = "right-full top-1/2 -translate-y-1/2 mr-2";
            break;
        case "right":
            positionClasses = "left-full top-1/2 -translate-y-1/2 ml-2";
            break;
        case "bottom-right":
            positionClasses = "top-full right-0 mt-2";
            break;
        case "bottom-left":
            positionClasses = "top-full left-0 mt-2";
        default: // bottom
            positionClasses = "top-full left-1/2 -translate-x-1/2 mt-2";
    }

    return (
        <div
            className="relative inline-block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            {/* Trigger Icon */}
            <div className="cursor-pointer text-gray-400 hover:text-[#3E9389] transition-colors">
                <MdInfoOutline className={iconSize} />
            </div>

            {/* Tooltip Content */}
            {show && (
                <div
                    className={`
                        absolute ${positionClasses}
                        w-64 p-3 
                        text-xs font-medium text-white 
                        bg-gray-800 
                        rounded-lg shadow-xl 
                        z-[999]
                        pointer-events-none
                    `}
                    style={{ minWidth: "200px" }}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default InfoTooltip;