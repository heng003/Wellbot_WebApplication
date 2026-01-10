import { useState } from "react";
import Card from "../dashboard/card";
import GratitudeModal from "./GratitudeModal";
import J1 from "../assets/journals/J1.png";
import J2 from "../assets/journals/J2.png";
import J3 from "../assets/journals/J3.png";
import J4 from "../assets/journals/J4.png";
import J5 from "../assets/journals/J5.png";
import J6 from "../assets/journals/J6.png";
import { CalendarIcon } from "lucide-react";

const MyFavGratitudeList = ({ favs, onEdit }) => {
    const [openItem, setOpenItem] = useState(null);

    const images = [J1, J2, J3, J4, J5, J6];

    const formatDate = (isoString) => {
        if (!isoString) return "";
        const date = new Date(isoString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleString('en-US', { month: 'short' });
        const year = date.getFullYear();

        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12;

        const timePart = minutes > 0
            ? `${hours}:${minutes.toString().padStart(2, '0')}${ampm}`
            : `${hours}${ampm}`;

        return `${day} ${month} ${year}    ${timePart}`;
    };

    const timeSince = (iso) => {
        if (!iso) return "";
        const diff = Date.now() - new Date(iso).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) return `${minutes}m`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h`;
        const days = Math.floor(hours / 24);
        return `${days}d`;
    };

    return (
        <Card>
            <div className="flex items-center justify-between p-3">
                <div className="text-base font-bold text-navy-700">
                    My Favourite
                </div>
            </div>

            {favs.map((item, idx) => (
                <div
                    key={item.id}
                    className="flex justify-between p-3 hover:shadow-2xl hover:opacity-90 cursor-pointer"
                    onClick={() => setOpenItem({ ...item, image: images[idx % 6] })}
                >
                    <div className="flex items-center gap-3" style={{ maxWidth: "80%" }}>
                        <div>
                            <h5 className="text-sm text-navy-700">
                                {item.text}
                            </h5>

                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CalendarIcon size={16} />
                                <span>
                                    {formatDate(item.created_at)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-600">
                        {timeSince(item.created_at)}
                    </div>
                </div>
            ))}

            {openItem && (
                <GratitudeModal
                    initialData={openItem}
                    fav={openItem.fav}
                    onEdit={onEdit}
                    onClose={() => setOpenItem(null)}
                    openInitially={true}
                />
            )}
        </Card>
    );
};

export default MyFavGratitudeList;