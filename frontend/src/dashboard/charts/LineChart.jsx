import Chart from "react-apexcharts";

const LineChart = ({ options, series, height }) => {
	return (
		<div className="w-full">
			<Chart
				options={options}
				series={series}
				type="line"
				height={height || 300}
				width="100%"
			/>
		</div>
	);
};

export default LineChart;
