const SadIcon = () => {
    return (
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <mask id="sad-mask">
                <rect width="25" height="25" fill="white" />
                <g transform="translate(5,5)" fill="black">
                    <circle cx="5" cy="5" r="1.25" />
                    <circle cx="10" cy="5" r="1.25" />
                    <path d="M5 11.25C6.25 9.375 8.75 9.375 10 11.25" stroke="black" strokeWidth="1.5" fill="none" />
                </g>
            </mask>
            <circle cx="12.5" cy="12.5" r="12.5" fill="var(--sad-color)" mask="url(#sad-mask)" />
        </svg>
    );
};

export default SadIcon;