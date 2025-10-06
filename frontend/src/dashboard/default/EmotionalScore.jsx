import React from "react";
import {
	MdArrowDropUp,
	MdOutlineCalendarToday,
	MdBarChart,
} from "react-icons/md";
import Card from "../card";
import {
	lineChartDataTotalSpent,
	lineChartOptionsTotalSpent,
} from "../variables/charts";
import LineChart from "../charts/LineChart";

const EmotionalScore = ({ timeSeries }) => {
	const categories = timeSeries.map((d) =>
		new Date(d.timestamp).toLocaleDateString("en-GB", {
			day: "2-digit",
			month: "short",
		})
	);

	const series = [
		{
			name: "Score",
			data: timeSeries.map((d) => d.emotion_score), // replace with your score field
			color: "#4318FF",
		},
		{
			name: "Confidence",
			data: timeSeries.map((d) => d.confidence_score),
			color: "#6AD2FF",
		},
	];

	const options = {
		chart: { type: "line", toolbar: { show: false } },
		stroke: { curve: "smooth" },
		tooltip: { theme: "dark", x: { format: "dd/MM/yy HH:mm" } },
		xaxis: {
			type: "category",
			categories: categories,
			labels: { style: { colors: "#A3AED0", fontSize: "12px" } },
		},
		yaxis: { show: true },
	};


	return (
		<Card extra="!p-[20px] text-center">
			<div className="flex justify-between">
				<button className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200">
					<MdOutlineCalendarToday />
					<span className="text-sm font-medium text-gray-600">This month</span>
				</button>
				<button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200">
					<MdBarChart className="h-6 w-6" />
				</button>
			</div>

			<div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
				<div className="flex flex-col">
					<p className="mt-[20px] text-3xl font-bold text-navy-700 dark:text-white">
						89%
					</p>
					<div className="flex flex-col items-start">
						<p className="mt-2 text-sm text-gray-600">Emotional Score</p>
						<div className="flex flex-row items-center justify-center">
							<MdArrowDropUp className="font-medium text-green-500" />
							<p className="text-sm font-bold text-green-500"> +2.45% </p>
						</div>
					</div>
				</div>
				<div className="h-full w-full">
					<LineChart
						options={lineChartOptionsTotalSpent}
						series={lineChartDataTotalSpent}
					/>
				</div>
			</div>
		</Card>
	);
};

export default EmotionalScore;
