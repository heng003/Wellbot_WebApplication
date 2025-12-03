import BarChart from "../charts/BarChart";
import { barChartDataDailyTraffic } from "../variables/charts";
import { barChartOptionsDailyTraffic } from "../variables/charts";
import { MdArrowDropUp } from "react-icons/md";
import Card from "../card";
const DailyTraffic = () => {
	return (
		<Card extra="col-span-1 pb-7 p-[20px]">
			<div className="flex flex-row justify-between align-start ml-1 pt-2">
				<div>
					<p className="text-sm font-medium leading-4 text-gray-600">
						Daily Activity
					</p>
					<p className="text-[34px] font-bold text-navy-700">
						2.579{" "}
						<div className="text-sm font-medium leading-6 text-gray-600">
							Activity Frequency
						</div>
					</p>
				</div>
				<div className="mb-6 flex items-center justify-center">
					<select className="mb-3 mr-2 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer">
						<option value="monthly">Monthly</option>
						<option value="yearly">Yearly</option>
						<option value="weekly">Weekly</option>
					</select>
				</div>
			</div>

			<div className="h-[300px] w-full pt-10 pb-0">
				<BarChart
					chartData={barChartDataDailyTraffic}
					chartOptions={barChartOptionsDailyTraffic}
				/>
			</div>
		</Card>
	);
};

export default DailyTraffic;
