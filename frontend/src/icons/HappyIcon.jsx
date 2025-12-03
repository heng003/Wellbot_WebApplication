const HappyIcon = () => {
    return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="happy-mask">
                <rect width="25" height="25" fill="white" />
                <g transform="translate(5,5)" fill="black">
                    <circle cx="5" cy="5" r="1.25" />
                    <circle cx="10" cy="5" r="1.25" />
                    <path d="M5 9.5C6.25 11.25 8.75 11.25 10 9.5" stroke="black" strokeWidth="1.5" fill="none" />
                </g>
            </mask>
            <circle cx="12.5" cy="12.5" r="12.5" fill="var(--happy-color)" mask="url(#happy-mask)" />
        </svg>
    );
};

export default HappyIcon;