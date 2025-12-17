function Card(props) {
	const { variant, extra, children, ...rest } = props;
	return (
		<div
			className={`card-animation !z-5 relative flex flex-col rounded-[20px] bg-white bg-clip-border shadow-3xl shadow-shadow-500 overflow-visible hover:z-[50] transition-all duration-200 ${extra}`}
			{...rest}
		>
			{children}
		</div>
	);
}

export default Card;
