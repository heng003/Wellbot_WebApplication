import { useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { CalendarIcon } from "lucide-react";
import JournalModal from "../../components/JournalModal";
import Card from ".";
import { toggleFav } from "../../services/journalService";

const JournalCard = ({ id, title, content, created_at, fav, image, onEdit }) => {
    const [isFav, setIsFav] = useState(fav || false);
    const [openModal, setOpenModal] = useState(false);

    const handleFavClick = async () => {
        const newFav = !isFav;
        setIsFav(newFav);
        await toggleFav(id, newFav);
        if (onEdit) onEdit();
    };

    const dateObj = new Date(created_at);
    const dateStr = dateObj.toLocaleDateString("en-US", {
        month: 'short', day: 'numeric', year: 'numeric'
    });
    const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: '2-digit', minute: '2-digit'
    });

    return (
        <>
            <Card extra="flex flex-col w-full !p-4 bg-white hover:shadow-lg cursor-pointer gap-1" onClick={() => setOpenModal(true)}>
                <div className="relative">
                    <img src={image} className="rounded-xl w-full" alt="" />
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFavClick();
                        }}
                        className="absolute top-3 right-3 bg-white p-2 rounded-full hover:opacity-80"
                    >
                        {isFav ? <IoHeart className="text-brand-500" /> : <IoHeartOutline />}
                    </button>
                </div>

                <p className="font-bold text-navy-700">{title}</p>

                <div className="flex-1" />

                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <CalendarIcon size={16} />
                    <span>{dateStr} • {timeStr}</span>
                </div>
            </Card>

            {openModal && (
                <JournalModal
                    initialData={{
                        id,
                        title,
                        body: content,
                        created_at,
                        fav: isFav
                    }}
                    image={image}
                    onUpdate={onEdit}
                    onClose={() => setOpenModal(false)}
                    openInitially={true}
                />
            )}
        </>
    );
};

export default JournalCard;