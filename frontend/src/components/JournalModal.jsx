import { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { CalendarIcon } from "lucide-react";
import Swal from "sweetalert2";
import { updateJournal, createJournal, deleteJournal } from "../services/journalService";
import { getIdFromToken } from "../utils/auth";

import { useTranslation } from "react-i18next";

const JournalModal = ({ initialData, image, onClose, onUpdate, openInitially = false }) => {
    const { t } = useTranslation();
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
                Swal.fire(t('feature.journal.success_updated'), t('feature.journal.success_updated_msg'), "success");
            } else {
                await createJournal({
                    user_id: userId,
                    title,
                    body: content,
                    fav: isFav
                });
                Swal.fire(t('feature.journal.success_created'), t('feature.journal.success_created_msg'), "success");
            }

            if (onUpdate) onUpdate();
            close();
        } catch (error) {
            Swal.fire(t('feature.journal.error_title'), t('feature.journal.error_msg'), "error");
        }

        setLoading(false);
    };

    // Delete
    const handleDelete = async () => {
        const res = await Swal.fire({
            title: t('feature.journal.confirm_delete_title'),
            text: t('feature.journal.confirm_delete_msg'),
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: t('feature.journal.delete'),
            cancelButtonText: t('feature.journal.cancel'),
            confirmButtonColor: "#d33",
        });

        if (!res.isConfirmed) return;

        try {
            await deleteJournal(initialData.id);
            Swal.fire(t('feature.journal.success_deleted'), t('feature.journal.success_deleted_msg'), "success");

            if (onUpdate) onUpdate();
            close();
        } catch (err) {
            Swal.fire(t('feature.journal.error_title'), "Failed to delete entry.", "error");
        }
    };

    return !show ? null : ReactDOM.createPortal(
        <div className="modal-overlay">
            <div className="modal-container overflow-hidden" style={{ padding: "2em" }}>

                {/* HEADER */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="modal-title">
                        {isEditingExisting ? (editMode ? t('feature.journal.edit_title') : title) : t('feature.journal.new_title')}
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
                            {isFav ? <IoHeart className="text-[#3E9389]" /> : <IoHeartOutline />}
                        </button>
                    </div>

                    <div className="profile-form-vertical">
                        {/* Title */}
                        {editMode && (
                            <div>
                                <label className="form-label">{t('feature.journal.label_title')}</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={title}
                                    disabled={!editMode}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder={t('feature.journal.placeholder_title')}
                                />
                            </div>
                        )}

                        {/* Date + Time */}
                        {(editMode && !show) ? (
                            <div>
                                <label className="form-label">{t('feature.journal.label_date')}</label>
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
                                <label className="form-label">{t('feature.journal.label_content')}</label>
                                <textarea
                                    className="form-input h-32"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    placeholder={t('feature.journal.placeholder_body')}
                                />
                            </div>
                        ) : (
                            <p className="form-display-box whitespace-pre-line">{content}</p>
                        )}

                        {/* ACTION BUTTONS */}
                        <div className="profile-form-actions pb-1">
                            {editMode ? (
                                <>
                                    <button className="green-button btn-primary" onClick={handleSave}>
                                        {loading ? t('feature.journal.saving') : t('feature.journal.save')}
                                    </button>
                                    <button className="white-button btn-outline" onClick={close}>{t('feature.journal.cancel')}</button>
                                </>
                            ) : (
                                <>
                                    <button className="green-button btn-primary" onClick={() => setEditMode(true)}>{t('feature.journal.edit')}</button>
                                    {initialData && (
                                        <button className="white-button btn-outline" onClick={handleDelete}>{t('feature.journal.delete')}</button>
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