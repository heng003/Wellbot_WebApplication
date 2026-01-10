import React, { useState } from 'react';
import Card from "../card";
import { CalendarIcon } from "lucide-react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import GratitudeModal from '../../components/GratitudeModal';
import { toggleFav } from "../../services/gratitudeService";

const GratitudeCard = ({ data, onEdit }) => {
    const { id, text, fav, created_at } = data;
    const [isFav, setIsFav] = useState(fav || false);
    const [showModal, setShowModal] = useState(false);

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

    const handleFavClick = async () => {
        const newFav = !isFav;
        setIsFav(newFav);
        await toggleFav(id, newFav);
        if (onEdit) onEdit();
    };


    return (
        <>
            <Card extra="flex flex-col justify-between w-full h-full !p-4 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => setShowModal(true)}>
                <div>
                    <p className="text-base font-medium text-navy-700">
                        {text}
                    </p>
                </div>

                <div className="flex justify-between items-center mt-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CalendarIcon size={16} />
                        <span>{formattedDate}</span>
                    </div>

                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFavClick();
                        }}
                        className="bg-gray-100 p-2 rounded-full hover:opacity-80"
                    >
                        {isFav ? <IoHeart className="text-[#3E9389]" /> : <IoHeartOutline />}
                    </button>
                </div>
            </Card>

            {showModal && (
                <GratitudeModal
                    initialData={data}
                    onClose={() => setShowModal(false)}
                    onUpdate={onEdit}
                />
            )}
        </>
    );
};

export default GratitudeCard;