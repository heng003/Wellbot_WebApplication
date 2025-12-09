import React from "react";

const PercentIcon = ({ percent = 0 }) => {
  // Ensure percent is within 0–100
  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  // Map percent to rotation angle (0% = 0deg, 100% = 180deg)
  const rotation = (clampedPercent / 100) * 180;

  return (
    <svg
      width="36"
      height="22"
      viewBox="0 0 36 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer shape */}
      <path
        d="M0 0C18 0 36 22 0 22Z"
        fill="#1D4ED8"
      />

      {/* Inner arrow, rotated based on percent */}
      <g transform={`rotate(${rotation} 18 11)`}>
        <path
          d="M18 0L20 20H16L18 0Z"
          fill="#272525"
        />
      </g>
    </svg>
  );
};

export default PercentIcon;