import { useState } from "react";
import Card from "../dashboard/card";
import JournalModal from "./JournalModal";
import J1 from "../assets/journals/J1.png";
import J2 from "../assets/journals/J2.png";
import J3 from "../assets/journals/J3.png";
import J4 from "../assets/journals/J4.png";
import J5 from "../assets/journals/J5.png";
import J6 from "../assets/journals/J6.png";
import { CalendarIcon } from "lucide-react";

const MyFavCard = ({ favs, onEdit }) => {
    const [openJournal, setOpenJournal] = useState(null);

    const journalImages = [J1, J2, J3, J4, J5, J6];

    const timeSince = (iso) => {
        if (!iso) return '';
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
                <div className="text-kolg font-bold text-navy-700">
                    My Favourite
                </div>
            </div>

            {favs.map((item, idx) => (
                <div
                    key={item.id}
                    className="flex justify-between px-3 py-4 hover:shadow-2xl hover:opacity-90 cursor-pointer"
                    onClick={() => setOpenJournal({ ...item, image: journalImages[idx % 6] })}
                >
                    <div className="flex items-center gap-3">
                        <img
                            className="w-16 h-16 rounded-xl"
                            src={journalImages[idx % 6]}
                            alt=""
                        />
                        <div>
                            <h5 className="text-base font-bold text-navy-700">{item.title}</h5>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <CalendarIcon size={16} />
                                <span>{item.created_at.split("T")[0]} · {item.created_at.split("T")[1].substring(0, 5)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-sm text-gray-600">
                        {timeSince(item.created_at)}
                    </div>
                </div>
            ))}

            {openJournal && (
                <JournalModal
                    {...openJournal}
                    fav={openJournal.fav}
                    onEdit={onEdit}
                    onClose={() => setOpenJournal(null)}
                    openInitially={true}
                />
            )}
        </Card>
    );
};

export default MyFavCard;