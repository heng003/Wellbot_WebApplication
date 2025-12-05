import Chart from "react-apexcharts";

const LineChart = ({ options, series }) => {
	return (
		<div className="w-full">
			<Chart
				options={options}
				series={series}
				type="line"
				height={220}
				width="100%"
			/>
		</div>
	);
};

export default LineChart;
