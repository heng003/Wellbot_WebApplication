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

    const formattedDate = formatDate(created_at);

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
                        {isFav ? <IoHeart className="text-[#3E9389]" /> : <IoHeartOutline />}
                    </button>
                </div>

                <p className="font-bold text-navy-700">{title}</p>

                <div className="flex-1" />

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CalendarIcon size={16} />
                    <span>{formattedDate}</span>
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