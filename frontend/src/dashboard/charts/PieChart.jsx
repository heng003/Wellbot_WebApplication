import Chart from "react-apexcharts";

const PieChart = (props) => {
	const { height, series, options } = props;

	return (
		<Chart
			options={options}
			type="pie"
			width="100%"
			height={height || "100%"}
			series={series}
		/>
	);
};

export default PieChart;