import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import Card from ".";
import { HiX } from "react-icons/hi";
import { CalendarIcon } from "lucide-react";

const JournalCard = ({ title, date, time, image, content, onEdit, onDelete }) => {
	const [heart, setHeart] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [editMode, setEditMode] = useState(false);

	// Editable fields
	const [editTitle, setEditTitle] = useState(title);
	const [editDate, setEditDate] = useState(date);
	const [editTime, setEditTime] = useState(time);
	const [editContent, setEditContent] = useState(content);

	// close on ESC
	useEffect(() => {
		const onKey = (e) => {
			if (e.key === "Escape") {
				if (editMode) setEditMode(false);
				else setShowModal(false);
			}
		};
		if (showModal) window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [showModal, editMode]);

	const paragraphs = Array.isArray(content)
		? content
		: typeof content === "string"
			? content.split(/\n\n+/g)
			: [];

	// Save changes
	const saveChanges = () => {
		setEditMode(false);
		onEdit &&
			onEdit({
				title: editTitle,
				date: editDate,
				time: editTime,
				content: editContent,
			});
	};

	// Cancel editing
	const cancelEdit = () => {
		setEditMode(false);
		setEditTitle(title);
		setEditDate(date);
		setEditTime(time);
		setEditContent(content);
	};

	return (
		<>
			<Card extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white`}>
				<div className="h-full w-full">
					<div className="relative w-full">
						<img src={image} className="mb-3 h-full w-full rounded-xl object-cover" alt="" />
						<button
							onClick={() => setHeart(!heart)}
							className="absolute top-3 right-3 flex items-center justify-center rounded-full bg-white p-2 text-brand-500 hover:cursor-pointer"
						>
							<div className="text-xl">
								{heart ? <IoHeartOutline /> : <IoHeart className="text-brand-500" />}
							</div>
						</button>
					</div>

					<div className="mb-2">
						<p className="text-md font-bold text-navy-700">{title}</p>
					</div>

					<div className="flex gap-2 mt-1 text-sm text-gray-300 align-end mb-2">
						<CalendarIcon />
						<p>{date} {time ? `· ${time}` : ""}</p>
					</div>

					<button
						onClick={() => setShowModal(true)}
						className="linear rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white"
					>
						View
					</button>
				</div>
			</Card>

			{showModal && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/40" onClick={() => !editMode && setShowModal(false)} />

					<div className="relative z-10 max-w-3xl w-full mx-4 bg-white rounded-lg shadow-lg overflow-hidden">
						<div className="flex items-center justify-between p-4 border-b">
							{!editMode ? (
								<div className="flex items-center gap-3">
									<h3 className="text-md font-semibold">{title}</h3>
									<div className="text-sm text-gray-500"><CalendarIcon />{date} {time ? `· ${time}` : ""}</div>
								</div>
							) : (
								<div className="flex flex-col w-full gap-2">
									<input
										value={editTitle}
										onChange={(e) => setEditTitle(e.target.value)}
										className="border rounded px-2 py-1 w-full"
									/>
									<div className="flex gap-2">
										<input
											value={editDate}
											onChange={(e) => setEditDate(e.target.value)}
											className="border rounded px-2 py-1"
										/>
										<input
											value={editTime}
											onChange={(e) => setEditTime(e.target.value)}
											className="border rounded px-2 py-1"
										/>
									</div>
								</div>
							)}

							<div className="flex items-center gap-2">
								{!editMode ? (
									<>
										<button
											onClick={() => setEditMode(true)}
											className="rounded-md bg-yellow-500 px-3 py-1 text-white"
										>
											Edit
										</button>
										<button
											onClick={() => { setShowModal(false); onDelete && onDelete(); }}
											className="rounded-md bg-red-600 px-3 py-1 text-white"
										>
											Delete
										</button>
										<button onClick={() => setShowModal(false)} className="p-2 rounded hover:bg-gray-100">
											<HiX />
										</button>
									</>
								) : (
									<>
										<button
											onClick={saveChanges}
											className="rounded-md bg-green-600 px-3 py-1 text-white"
										>
											Save
										</button>
										<button
											onClick={cancelEdit}
											className="rounded-md bg-gray-400 px-3 py-1 text-white"
										>
											Cancel
										</button>
									</>
								)}
							</div>
						</div>

						{/* BODY */}
						<div className="p-4 max-h-[70vh] overflow-y-auto">
							{image && !editMode && (
								<div className="mb-4">
									<img src={image} alt="journal" className="w-full rounded-md object-cover" />
								</div>
							)}

							{/* CONTENT */}
							{!editMode ? (
								<div className="prose max-w-none">
									{paragraphs.length > 0
										? paragraphs.map((p, i) => (
											<p key={i} className="mb-4 text-gray-700">{p}</p>
										))
										: <p className="text-gray-700">(No content)</p>
									}
								</div>
							) : (
								<textarea
									value={editContent}
									onChange={(e) => setEditContent(e.target.value)}
									className="w-full border rounded p-3 min-h-[200px]"
								/>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};

export default JournalCard;