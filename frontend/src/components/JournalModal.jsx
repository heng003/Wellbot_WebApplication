import { useState, useEffect } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { CalendarIcon } from "lucide-react";
import { toggleFav, updateJournal } from "../services/journalService";

const JournalModal = ({
    id,
    title,
    content,
    created_at,
    fav,
    image,
    onClose,
    onEdit, // callback to parent to refresh
    openInitially = false
}) => {

    const [show, setShow] = useState(openInitially);
    const [isFav, setIsFav] = useState(fav || false);
    const [editMode, setEditMode] = useState(false);

    // Editable fields
    const [editTitle, setEditTitle] = useState(title);
    const [editContent, setEditContent] = useState(content);

    const dateObj = new Date(created_at);
    const initialDate = dateObj.toISOString().split("T")[0];
    const initialTime = dateObj.toTimeString().slice(0, 5);
    const [editDate, setEditDate] = useState(initialDate);
    const [editTime, setEditTime] = useState(initialTime);

    useEffect(() => {
        setShow(openInitially);
    }, [openInitially]);

    const close = () => {
        setShow(false);
        setEditMode(false);
        if (onClose) onClose();
    };

    // ESC close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") close();
        };
        if (show) window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [show]);

    // Toggle favourite
    const handleFavClick = async () => {
        const newFav = !isFav;
        setIsFav(newFav);
        await toggleFav(id, newFav);
        if (onEdit) onEdit();
    };

    // Save journal edit
    const handleSave = async () => {
        const merged = new Date(`${editDate}T${editTime}:00`);
        const payload = {
            title: editTitle,
            body: editContent,
            created_at: merged.toISOString()
        };

        await updateJournal(id, payload);
        if (onEdit) onEdit();

        setEditMode(false);
        close();
    };

    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">

                {!editMode ? (
                    <>
                        {/* VIEW MODE */}
                        <h3 className="modal-title mb-4">{title}</h3>

                        <div className="relative w-full">
                            <img src={image} className="mb-3 rounded-xl w-full" alt="" />
                            <button
                                onClick={handleFavClick}
                                className="absolute top-3 right-3 bg-white p-2 rounded-full"
                            >
                                {isFav ? <IoHeart className="text-brand-500" /> : <IoHeartOutline />}
                            </button>
                        </div>

                        <div className="profile-form-vertical">
                            <div>
                                <label className="form-label">Date & Time</label>
                                <p className="form-display-box flex gap-1">
                                    <CalendarIcon size={16} />
                                    {initialDate} · {initialTime}
                                </p>
                            </div>

                            <div>
                                <label className="form-label">Content</label>
                                <p className="form-display-box whitespace-pre-line">{content}</p>
                            </div>

                            <div className="profile-form-actions">
                                <button
                                    className="green-button btn-primary"
                                    onClick={() => setEditMode(true)}
                                >
                                    Edit
                                </button>
                                <button className="white-button btn-outline" onClick={close}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* EDIT MODE */}
                        <h3 className="modal-title mb-4">Edit Journal</h3>

                        <div className="relative w-full">
                            <img src={image} className="mb-3 rounded-xl w-full" alt="" />
                        </div>

                        <div className="profile-form-vertical">
                            <div>
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="form-label">Time</label>
                                <input
                                    type="time"
                                    className="form-input"
                                    value={editTime}
                                    onChange={(e) => setEditTime(e.target.value)}
                                />
                            </div>

                            <div>
                                <label className="form-label">Content</label>
                                <textarea
                                    className="form-input h-32"
                                    value={editContent}
                                    onChange={(e) => setEditContent(e.target.value)}
                                />
                            </div>

                            <div className="profile-form-actions">
                                <button className="green-button btn-primary" onClick={handleSave}>
                                    Save
                                </button>
                                <button className="white-button btn-outline" onClick={close}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default JournalModal;