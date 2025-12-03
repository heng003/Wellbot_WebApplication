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

	const date = created_at ? new Date(created_at).toISOString().split('T')[0]: created_at;
	const time = created_at ? new Date(created_at).toTimeString().slice(0, 5) : '';

    return (
        <>
            <Card extra="flex flex-col w-full !p-4 bg-white">
                <div className="relative">
                    <img src={image} className="mb-3 rounded-xl w-full" alt="" />

                    <button
                        onClick={handleFavClick}
                        className="absolute top-3 right-3 bg-white p-2 rounded-full"
                    >
                        {isFav ? <IoHeart className="text-brand-500" /> : <IoHeartOutline />}
                    </button>
                </div>

                <p className="font-bold text-navy-700">{title}</p>

                <div className="flex items-center gap-2 text-sm text-gray-400 mt-1 mb-3">
                    <CalendarIcon size={16} />
                    <span>{date} · {time}</span>
                </div>

                <button
                    onClick={() => setOpenModal(true)}
                    className="linear bg-brand-900 text-white rounded-xl px-4 py-2"
                >
                    View
                </button>
            </Card>

            {openModal && (
                <JournalModal
                    id={id}
                    title={title}
                    content={content}
                    created_at={created_at}
                    fav={isFav}
                    image={image}
                    onEdit={onEdit}
                    onClose={() => setOpenModal(false)}
                    openInitially={true}
                />
            )}
        </>
    );
};

export default JournalCard;