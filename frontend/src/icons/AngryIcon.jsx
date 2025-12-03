const AngryIcon = () => {
    return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="angry-mask">
                <rect width="25" height="25" fill="white" />
                <g transform="translate(5,5)" fill="black">
                    <path d="M3.75 4.375L5.625 5.625" stroke="black" strokeWidth="1.25" strokeLinecap="round" />
                    <path d="M11.25 4.375L9.375 5.625" stroke="black" strokeWidth="1.25" strokeLinecap="round" />
                    <path d="M5 11.25C6.875 12.5 8.125 12.5 10 11.25" stroke="black" strokeWidth="1.5" fill="none" />
                </g>
            </mask>
            <circle cx="12.5" cy="12.5" r="12.5" fill="var(--angry-color)" mask="url(#angry-mask)" />
        </svg>
    );
};

export default AngryIcon;