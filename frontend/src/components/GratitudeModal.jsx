import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { MdClose, MdCalendarToday } from "react-icons/md";
import { updateGratitude, createGratitude, deleteGratitude } from "../services/gratitudeService";
import { getIdFromToken } from "../utils/auth";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const GratitudeModal = ({
    initialData,
    onClose,
    onUpdate,
    openInitially = true
}) => {
    const { t } = useTranslation();
    const userId = getIdFromToken();
    const [show, setShow] = useState(openInitially);
    const [editMode, setEditMode] = useState(!initialData);
    const [loading, setLoading] = useState(false);

    // Form fields
    const [text, setText] = useState("");
    const [isFav, setIsFav] = useState(false);

    // Date + Time
    const [dateVal, setDateVal] = useState("");
    const [timeVal, setTimeVal] = useState("");

    const formatDisplayDate = (dVal, tVal) => {
        if (!dVal || !tVal) return "";
        const date = new Date(`${dVal}T${tVal}`);

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

    useEffect(() => {
        if (initialData) {
            setText(initialData.text || "");
            setIsFav(initialData.fav || false);

            const dt = new Date(initialData.created_at);
            if (!isNaN(dt)) {
                setDateVal(dt.toISOString().split("T")[0]);
                setTimeVal(dt.toTimeString().slice(0, 5));
            }
        } else {
            // Default for "New" gratitude
            const now = new Date();
            setDateVal(now.toISOString().split("T")[0]);
            setTimeVal(now.toTimeString().slice(0, 5));
        }
    }, [initialData]);

    // Close modal
    const close = () => {
        setShow(false);
        setEditMode(false);
        if (onClose) onClose();
    };

    // ESC key to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") close();
        };
        if (show) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [show, close]);

    // Toggle Favorite
    const handleFavToggle = async () => {
        if (!initialData) {
            setIsFav(!isFav);
            return;
        }

        try {
            const newFav = !isFav;
            setIsFav(newFav);
            await updateGratitude(initialData.id, { fav: newFav });
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error(err);
        }
    };

    // Save
    // Save
    const handleSave = async () => {
        if (!text.trim()) return;

        setLoading(true);

        const combinedDate = new Date(`${dateVal}T${timeVal}:00`);

        try {
            if (initialData) {
                // UPDATE
                const payload = {
                    text,
                    fav: isFav,
                    created_at: combinedDate.toISOString(),
                };
                await updateGratitude(initialData.id, payload);
                Swal.fire(t('feature.gratitude.success_updated'), t('feature.gratitude.success_updated_msg'), "success");
            } else {
                // CREATE
                await createGratitude(userId, text, isFav);
                Swal.fire(t('feature.gratitude.success_created'), t('feature.gratitude.success_created_msg'), "success");
            }

            if (onUpdate) onUpdate();
            close();
        } catch (error) {
            console.error(error);
            Swal.fire(t('feature.journal.error_title'), "Failed to save gratitude item", "error");
        }

        setLoading(false);
    };

    // Delete
    // Delete
    const handleDelete = async () => {
        const res = await Swal.fire({
            title: t('feature.gratitude.confirm_delete_title'),
            text: t('feature.gratitude.confirm_delete_msg'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t('feature.gratitude.delete'),
            cancelButtonText: t('feature.gratitude.cancel'),
            confirmButtonColor: "#d33",
            customClass: {
                title: 'swal-title',
            }
        });

        if (res.isConfirmed) {
            try {
                await deleteGratitude(initialData.id);
                if (onUpdate) onUpdate();
                close();
                Swal.fire(t('feature.gratitude.success_deleted'), t('feature.gratitude.success_deleted_msg'), "success");
            } catch (err) {
                console.error(err);
                Swal.fire(t('feature.journal.error_title'), "Failed to delete item", "error");
            }
        }
    };

    if (!show) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-container overflow-hidden">

                {/* HEADER */}
                <div className="modal-header">
                    <h3 className="modal-title">
                        {initialData ? (editMode ? t('feature.gratitude.edit_title') : "Gratitude Moment") : t('feature.gratitude.new_title')}
                    </h3>

                    <button onClick={close} className="p-2 rounded-full bg-gray-100 hover:opacity-80 text-gray-500">
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <div className="max-h-[75vh] overflow-y-auto">
                    <div className="modal-form">
                        {/* CONTENT */}
                        <div>
                            <label className="form-label">{t('feature.gratitude.label_content')}</label>

                            {editMode ? (
                                <textarea
                                    className="form-input h-32"
                                    value={text}
                                    placeholder={t('feature.gratitude.placeholder_text')}
                                    onChange={(e) => setText(e.target.value)}
                                />
                            ) : (
                                <p className="form-display-box whitespace-pre-line">
                                    {text}
                                </p>
                            )}
                        </div>

                        {/* DATE & TIME */}
                        {initialData && (
                            <div>
                                <label className={`form-label ${editMode ? "" : "mt-4"}`}>{t('feature.gratitude.label_date')}</label>
                                {editMode ? (
                                    <div className="flex gap-3">
                                        <input
                                            type="date"
                                            value={dateVal}
                                            onChange={(e) => setDateVal(e.target.value)}
                                            className="form-input"
                                        />
                                        <input
                                            type="time"
                                            value={timeVal}
                                            onChange={(e) => setTimeVal(e.target.value)}
                                            className="form-input"
                                        />
                                    </div>
                                ) : (
                                    <p className="form-display-box flex items-center gap-1">
                                        <MdCalendarToday size={16} />
                                        {formatDisplayDate(dateVal, timeVal)}
                                    </p>
                                )}
                            </div>
                        )}

                        <div className="profile-form-actions mt-4 mb-4">
                            {/* ACTION BUTTONS */}
                            <div className="w-full flex justify-between items-center">
                                {editMode ? (
                                    <div className="flex gap-3">
                                        <button onClick={handleSave} className="green-button btn-primary">
                                            {loading ? t('feature.gratitude.saving') : t('feature.gratitude.save')}
                                        </button>

                                        <button onClick={close} className="white-button btn-outline">
                                            {t('feature.gratitude.cancel')}
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-3">
                                        <button
                                            className="green-button btn-primary"
                                            onClick={() => setEditMode(true)}
                                        >
                                            {t('feature.gratitude.edit')}
                                        </button>
                                        <button className="white-button btn-outline" onClick={handleDelete}>
                                            {t('feature.gratitude.delete')}
                                        </button>
                                    </div>
                                )}
                                {/* FAV BUTTON */}
                                <div>
                                    <button onClick={handleFavToggle} disabled={!editMode} className={`p-2 rounded-full bg-gray-100 ${editMode ? "hover:opacity-80 cursor-pointer" : ""}`}>
                                        {isFav ? <IoHeart className="text-[#3E9389]" /> : <IoHeartOutline />}
                                    </button>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default GratitudeModal;