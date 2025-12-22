import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { CalendarIcon } from "lucide-react";
import Swal from "sweetalert2";
import { updateJournal, createJournal, deleteJournal } from "../services/journalService";
import { getIdFromToken } from "../utils/auth";

const JournalModal = ({ initialData, image, onClose, onUpdate, openInitially = false }) => {
    const userId = getIdFromToken();
    const isEditingExisting = !!initialData;

    const [show, setShow] = useState(openInitially);
    const [editMode, setEditMode] = useState(!initialData);
    const [loading, setLoading] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isFav, setIsFav] = useState(false);

    const [dateVal, setDateVal] = useState("");
    const [timeVal, setTimeVal] = useState("");

    // Load Initial Data
    useEffect(() => {
        if (initialData) {
            setTitle(initialData.title);
            setContent(initialData.body);
            setIsFav(initialData.fav);

            const dt = new Date(initialData.created_at);
            setDateVal(dt.toISOString().split("T")[0]);
            setTimeVal(dt.toTimeString().slice(0, 5));
        } else {
            const now = new Date();
            setDateVal(now.toISOString().split("T")[0]);
            setTimeVal(now.toTimeString().slice(0, 5));
        }
    }, [initialData]);

    const close = () => {
        setShow(false);
        if (onClose) onClose();
    };

    useEffect(() => {
        const esc = (e) => e.key === "Escape" && close();
        window.addEventListener("keydown", esc);
        return () => window.removeEventListener("keydown", esc);
    }, [close]);

    // Save/Add
    const handleSave = async () => {
        if (!title.trim() || !content.trim()) return;

        setLoading(true);
        const combined = new Date(`${dateVal}T${timeVal}:00`);

        try {
            if (initialData) {
                await updateJournal(initialData.id, {
                    title,
                    body: content,
                    fav: isFav,
                    created_at: combined.toISOString(),
                });

                Swal.fire("Updated!", "Your journal entry has been updated.", "success");
            } else {
                await createJournal({
                    user_id: userId,
                    title,
                    body: content,
                    fav: isFav
                });
                Swal.fire("Created!", "Your new journal entry has been added.", "success");
            }

            if (onUpdate) onUpdate();
            close();
        } catch (error) {
            Swal.fire("Error", "Failed to save journal entry.", "error");
        }

        setLoading(false);
    };

    // Delete
    const handleDelete = async () => {
        const res = await Swal.fire({
            title: "Delete journal?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Delete",
            confirmButtonColor: "#d33",
        });

        if (!res.isConfirmed) return;

        try {
            await deleteJournal(initialData.id);
            Swal.fire("Deleted", "Your journal entry has been removed.", "success");

            if (onUpdate) onUpdate();
            close();
        } catch (err) {
            Swal.fire("Error", "Failed to delete entry.", "error");
        }
    };

    return !show ? null : ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-container overflow-hidden" style={{ padding: "2em" }}>

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="modal-title">
                        {isEditingExisting ? (editMode ? "Edit Journal" : title) : "New Journal"}
                    </h3>
                    <button onClick={close} className="p-2 rounded-full bg-gray-100 hover:opacity-80 text-gray-500">
                        <MdClose className="text-xl" />
                    </button>
                </div>

                <div className="max-h-[75vh] overflow-y-auto">
                    <div className="relative mb-4">
                        <img src={image} className="rounded-xl w-full" alt="" />
                        <button
                            className={`absolute top-3 right-3 bg-white p-2 rounded-full ${editMode ? "hover:opacity-80 cursor-pointer" : ""}`}
                            onClick={() => setIsFav(!isFav)}
                            disabled={!editMode}
                        >
                            {isFav ? <IoHeart className="text-brand-500" /> : <IoHeartOutline />}
                        </button>
                    </div>

                    <div className="profile-form-vertical">
                        {/* Title */}
                        {editMode && (
                            <div>
                                <label className="form-label">Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={title}
                                    disabled={!editMode}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                        )}

                        {/* Date + Time */}
                        {(editMode && !show) ? (
                            <div>
                                <label className="form-label">Date & Time</label>
                                <div className="flex gap-3">
                                    <input type="date" className="form-input" value={dateVal} onChange={(e) => setDateVal(e.target.value)} />
                                    <input type="time" className="form-input" value={timeVal} onChange={(e) => setTimeVal(e.target.value)} />
                                </div>
                            </div>
                        ) : !show && (
                            <p className="form-display-box flex items-center gap-1">
                                <CalendarIcon size={16} />
                                {dateVal} · {timeVal}
                            </p>
                        )}


                        {/* Content */}
                        {editMode ? (
                            <div>
                                <label className="form-label">Content</label>
                                <textarea className="form-input h-32" value={content} onChange={(e) => setContent(e.target.value)} />
                            </div>
                        ) : (
                            <p className="form-display-box whitespace-pre-line">{content}</p>
                        )}

                        {/* ACTION BUTTONS */}
                        <div className="profile-form-actions pb-1">
                            {editMode ? (
                                <>
                                    <button className="green-button btn-primary" onClick={handleSave}>
                                        {loading ? "Saving..." : "Save"}
                                    </button>
                                    <button className="white-button btn-outline" onClick={close}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button className="green-button btn-primary" onClick={() => setEditMode(true)}>Edit</button>
                                    {initialData && (
                                        <button className="white-button btn-outline" onClick={handleDelete}>Delete</button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
};

export default JournalModal;