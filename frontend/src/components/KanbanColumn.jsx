import { useState } from "react";
import { Plus, MoreVertical } from "lucide-react";

export default function KanbanColumn({ title, cards = [], onAddCard }) {
    const [showInput, setShowInput] = useState(false);
    const [newTitle, setNewTitle] = useState("");

    const handleAdd = () => {
        if (newTitle.trim() === "") return;
        onAddCard?.(newTitle);
        setNewTitle("");
        setShowInput(false);
    };

    return (
        <div className="bg-white rounded-xl w-full max-w-sm p-4 shadow-sm border">
            {/* Column header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">{title}</h2>
                <div className="flex items-center gap-2">
                    <button
                        className="p-1 rounded-md hover:bg-gray-100 transition"
                        onClick={() => setShowInput(true)}
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button className="p-1 rounded-md hover:bg-gray-100 transition">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Add input */}
            {showInput && (
                <div className="flex items-center gap-2 mb-4">
                    <input
                        className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 outline-none"
                        placeholder="Card title..."
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <button
                        onClick={handleAdd}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Add
                    </button>
                </div>
            )}

            {/* Cards */}
            <div className="flex flex-col gap-3">
                {cards.map((card, i) => (
                    <div key={i} className="p-4 border rounded-xl bg-gray-50 shadow-sm">
                        <h3 className="font-medium mb-2">{card.title}</h3>
                        {card.description && (
                            <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                        )}

                        {/* Extra slot data */}
                        {card.footer && (
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                {card.footer}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}