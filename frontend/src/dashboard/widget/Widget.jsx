import Card from "../card";


import { MdArrowDropUp, MdArrowDropDown } from "react-icons/md";

const Widget = ({ icon, title, subtitle, trend = "up", trendValue = "+2.45%" }) => {
  return (
    <Card extra="!flex-row flex-grow items-center rounded-[20px]">
      <div className="ml-[18px] flex h-[90px] w-auto flex-row items-center">
        <div className="rounded-full bg-lightPrimary p-3">
          <span className="flex items-center text-brand-500 dark:text-white">
            {icon}
          </span>
        </div>
      </div>

      <div className="h-50 ml-4 flex w-auto flex-col justify-center">
        <p className="font-dm text-sm font-medium text-gray-600">{title}</p>
        <div className="flex flex-row items-center">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white mr-2">
            {subtitle}
          </h4>
          <div className="flex flex-row items-center ml-3">
            {trend === "up" ? (
              <MdArrowDropUp className="font-medium text-green-500" />
            ) : (
              <MdArrowDropDown className="font-medium text-red-500" />
            )}
            <p className={`text-sm font-bold ${trend === "up" ? "text-green-500" : "text-red-500"}`}>{trendValue}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default Widget;
