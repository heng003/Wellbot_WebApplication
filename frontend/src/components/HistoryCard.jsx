import React from "react";
import J1 from "../assets/journals/J1.png";
import J2 from "../assets/journals/J2.png";
import J3 from "../assets/journals/J3.png";
import J4 from "../assets/journals/J4.png";
import J5 from "../assets/journals/J5.png";
import J6 from "../assets/journals/J6.png";

import { FaEthereum } from "react-icons/fa";
import Card from "../dashboard/card";

const MyFavCard = () => {

    const MyFavData = [
        {
            image: J1,
            title: "Colorful Heaven",
            date: "Mark Benjamin",
            time: "30s",
        },
        {
            image: J2,
            title: "Abstract Colors",
            date: "Esthera Jackson",
            time: "50m",
        },
        {
            image: J3,
            title: "ETH AI Brain",
            date: "Nick Wilson",
            time: "20s",
        },
        {
            image: J4,
            title: "Swipe Circles",
            date: " Peter Will",
            time: "4h",
        },
        {
            image: J5,
            title: "Mesh Gradients",
            date: "Will Smith",
            time: "30s",
        },
        {
            image: J6,
            title: "3D Cubes Art",
            date: " Manny Gates",
            time: "2m",
        },
    ];

    return (
        <Card>
            {/* MyFavCard Header */}
            <div className="flex items-center justify-between rounded-t-3xl p-3">
                <div className="text-kolg font-bold text-navy-700">
                    My Favourite
                </div>
            </div>

            {/* MyFav CardData */}

            {MyFavData.map((data, index) => (
                <div className="flex items-start justify-between bg-white px-3 py-[20px] transition-all duration-200 hover:shadow-2xl hover:opacity-90">
                    <div className="flex items-center gap-3">
                        <div className="flex h-16 w-16 items-center justify-center">
                            <img
                                className="h-full w-full rounded-xl"
                                src={data.image}
                                alt=""
                            />
                        </div>
                        <div className="flex flex-col">
                            <h5 className="text-base font-bold text-navy-700">
                                {" "}
                                {data.title}
                            </h5>
                            <p className="mt-1 text-sm font-normal text-gray-600">
                                {" "}
                                {data.date}{" "}
                            </p>
                        </div>
                    </div>

                    <div className="mt-1 flex items-center justify-center text-navy-700">
                        <div className="ml-2 flex items-center text-sm font-normal text-gray-600">
                            <p>{data.time}</p>
                            <p className="ml-1">ago</p>
                        </div>
                    </div>
                </div>
            ))}
        </Card>
    );
};

export default MyFavCard;