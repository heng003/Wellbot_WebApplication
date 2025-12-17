import React from 'react';

const InfoIcon = ({ className = 'w-4 h-4', title = 'Info' }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={className}
        aria-hidden="true"
    >
        {title ? <title>{title}</title> : null}
        <path
            fillRule="evenodd"
            d="M18 10A8 8 0 1 1 2 10a8 8 0 0 1 16 0zm-8-3a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm1 9a1 1 0 1 0-2 0v-5a1 1 0 1 0 2 0v5z"
            clipRule="evenodd"
        />
    </svg>
);

export default InfoIcon;
