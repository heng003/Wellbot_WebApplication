import HoverTooltip from "../../components/HoverTooltip";
import GaugeIcon from "../../icons/GuageIcon";
import Card from "../card";

const Widget = ({ icon, title, subtitle, percent, gaugeColors }) => {
	return (
		<Card extra="!flex-row flex-grow items-center rounded-[20px]">

			<div className="w-full flex justify-between items-center" style={{ paddingInline: "2em", paddingBlock: "0.5em" }}>
				<div className="flex items-center">
					<div className="flex h-[90px] w-auto flex-row items-center">
						<div className="rounded-full bg-lightPrimary p-3">
							<span className="flex items-center text-brand-500">
								{icon}
							</span>
						</div>
					</div>
					<div className="h-50 ml-4 flex w-auto flex-col justify-center">
						<p className="text-sm font-medium text-gray-600">{title}</p>
						<div className="flex flex-row items-center">
							<h4 className="text-xl font-bold text-navy-700 mr-2">
								{subtitle}
							</h4>
						</div>
					</div>
				</div>
				{percent !== undefined && (
					<HoverTooltip content="Percentage share of total emotions counted">
						<div className="ml-8 flex flex-col items-center justify-center gap-1">
							<p className="text-sm font-bold text-gray-700">{`${(Number(percent) || 0).toFixed(1)}%`}</p>
							<GaugeIcon
								percent={percent}
								color1={gaugeColors?.[0]}
								color2={gaugeColors?.[1]}
								color3={gaugeColors?.[2]}
							/>
						</div>
					</HoverTooltip>
				)}
			</div>
		</Card>
	);
};

export default Widget;