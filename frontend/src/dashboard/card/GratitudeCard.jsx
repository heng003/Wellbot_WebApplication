import React, { useState } from 'react';
import Card from "../card";
import { CalendarIcon } from "lucide-react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import GratitudeModal from '../../components/GratitudeModal';
import { toggleFav } from "../../services/gratitudeService";

const GratitudeCard = ({ data, onEdit }) => {
    const { id, text, fav, created_at, updated_at } = data;
    const [isFav, setIsFav] = useState(fav || false);
    const [showModal, setShowModal] = useState(false);

    // Format date: "Oct 25, 2025"
    const dateObj = new Date(created_at);
    const dateStr = dateObj.toLocaleDateString("en-US", {
        month: 'short', day: 'numeric', year: 'numeric'
    });
    const timeStr = dateObj.toLocaleTimeString("en-US", {
        hour: '2-digit', minute: '2-digit'
    });

    const handleFavClick = async () => {
        const newFav = !isFav;
        setIsFav(newFav);
        await toggleFav(id, newFav);
        if (onEdit) onEdit();
    };


    return (
        <>
            <Card extra="flex flex-col w-full !p-4 min-h-[50px] hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={() => setShowModal(true)}>
                <div className="mb-2">
                    <p className="text-base font-medium text-navy-700 leading-relaxed">
                        {text}
                    </p>
                </div>
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-lg w-fit">
                        <CalendarIcon size={16} />
                        <span>{dateStr} • {timeStr}</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleFavClick();
                        }}
                        className="bg-gray-100 p-2 rounded-full hover:opacity-80"
                    >
                        {isFav ? <IoHeart className="text-brand-500" /> : <IoHeartOutline />}
                    </button>
                </div>

                {updated_at && (
                    <div className="mt-2 text-[10px] text-gray-400 text-right italic">
                        Edited
                    </div>
                )}
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