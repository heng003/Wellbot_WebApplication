import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AiOutlineLoading } from "react-icons/ai";
import { MdOutlineCalendarToday } from "react-icons/md";
import { computePCA } from "../utils/reportUtils";
import Card from "../dashboard/card";
import InfoTooltip from "./InfoTooltip";

const Points = ({ data, onHover }) => {
    const ref = useRef();

    // Animate rotation slowly
    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.0005;
        }
    });

    const getColor = (item) => {
        const label = getEmotionLabel(item.text_content);
        switch (label) {
            case 'Happy': return '#FFD56B';
            case 'Angry': return '#EA5E8F';
            case 'Sad': return '#69D5C5';
            case 'Fear': return '#519AF6';
            default: return '#A3AED0';
        }
    };

    return (
        <group ref={ref}>
            {data.map((point, i) => (
                <mesh
                    key={i}
                    position={[point.x * 8, point.y * 8, point.z * 8]} // Scale up for visibility
                    onPointerOver={(e) => {
                        e.stopPropagation();
                        onHover(point); // Pass full point data to parent
                    }}
                    onPointerOut={(e) => {
                        e.stopPropagation();
                        onHover(null);
                    }}
                >
                    <sphereGeometry args={[0.15, 16, 16]} />
                    <meshStandardMaterial
                        color={getColor(point)}
                        emissive={getColor(point)}
                        emissiveIntensity={0.5}
                    />
                </mesh>
            ))}
        </group>
    );
};

// Color logic: "Emotion Classification"
// Using the specific hex codes provided
const getEmotionLabel = (text = "") => {
    const t = (text || "").toLowerCase();
    if (t.match(/happy|joy|joyful|delighted|great|love|good|excited|wonderful|glad|cheerful|laugh|pleased|content|grateful|awesome|amazing|开心|快乐|喜悦|高兴|棒|美好|喜欢|gembira|bahagia|seronok|suka|teruja|hebat|bagus|ceria|puas|syukur/)) return 'Happy';
    if (t.match(/angry|mad|furious|rage|annoyed|irritated|frustrated|upset|offended|hostile|生气|愤怒|讨厌|恼火|烦|不爽|marah|geram|bengang|panas|menyampah|tak puas hati/)) return 'Angry';
    if (t.match(/sad|cry|crying|down|bad|lonely|grief|upset|disappointed|unhappy|heartbroken|low|moody|hurt|伤心|难过|哭|悲伤|孤独|失落|沮丧|sedih|kecewa|muram|sepi|sunyı|tersentuh|terluka|rasa down/)) return 'Sad';
    if (t.match(/fear|scared|afraid|anxious|worry|worried|nervous|uneasy|uncertain|tense|shaken|concerned|害怕|恐惧|担心|焦虑|紧张|不安|takut|risau|cemas|gugup|gelisah|bimbang|was-was/)) return 'Fear';
    return 'Neutral';
};

const EmbeddingVisualizer = ({ rawEmbeddings, height = "500px", loading = false, onDateChange }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [showDatePicker, setShowDatePicker] = useState(false);

    // Date Picker State
    const [customStart, setCustomStart] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [customEnd, setCustomEnd] = useState(new Date());

    const formatLocalDate = (d) => {
        if (!d || !(d instanceof Date)) return "";
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, "0");
        const dd = String(d.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    };

    const handleApplyCustomRange = () => {
        if (onDateChange && customStart && customEnd) {
            onDateChange(customStart, customEnd);
        }
        setShowDatePicker(false);
    };

    const points = useMemo(() => {
        if (!rawEmbeddings || rawEmbeddings.length === 0) return [];

        // Parse vector string if it comes as string from DB
        const vectors = rawEmbeddings.map(e =>
            typeof e.vector === 'string' ? JSON.parse(e.vector) : e.vector
        );

        const coords = computePCA(vectors);

        // Merge coordinates back with metadata (text_content)
        return coords.map((c, i) => ({
            ...c,
            kind: rawEmbeddings[i].kind,
            text_content: rawEmbeddings[i].text_content,
            created_at: rawEmbeddings[i].created_at
        }));
    }, [rawEmbeddings]);

    if (loading) return (
        <div className="flex w-full items-center justify-center mt-4 bg-white rounded-2xl shadow-sm border border-gray-100" style={{ height: "220px" }}>
            <div className="flex flex-col items-center gap-3">
                <AiOutlineLoading className="h-8 w-8 animate-spin text-[#3E9389]" />
                <p className="text-sm font-medium text-gray-500">Loading galaxy...</p>
            </div>
        </div>
    );

    return (
        <Card extra="p-4 pb-5">
            <div className="flex w-full items-center justify-between p-2 pb-3">
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold">Conversation Galaxy</p>
                    <p className="card-subtitle text-sm">Visualizing your conversation messages with Well-Bot, colored by their emotional label.</p>
                </div>
                <div className="flex items-center gap-3 px-2 justify-end">
                    {onDateChange && (
                        <div className="flex items-center gap-2 relative">
                            <div className="relative">
                                <button
                                    onClick={() => setShowDatePicker(!showDatePicker)}
                                    className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-[#3E9389] hover:bg-gray-100"
                                >
                                    <MdOutlineCalendarToday className="h-5 w-5" />
                                </button>

                                {showDatePicker && (
                                    <div className="absolute right-0 top-full mt-2 bg-white border rounded-lg shadow-lg p-3 z-30 text-black min-w-[200px] text-left">
                                        <p className="font-semibold mb-2 text-sm text-gray-700">Date Range</p>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex flex-col">
                                                <label className="text-xs text-gray-500 mb-1">From</label>
                                                <input
                                                    type="date"
                                                    value={customStart ? formatLocalDate(customStart) : ""}
                                                    onChange={(e) => setCustomStart(new Date(e.target.value))}
                                                    className="border rounded p-1 text-sm text-gray-700 w-full"
                                                />
                                            </div>
                                            <div className="flex flex-col">
                                                <label className="text-xs text-gray-500 mb-1">To</label>
                                                <input
                                                    type="date"
                                                    value={customEnd ? formatLocalDate(customEnd) : ""}
                                                    onChange={(e) => setCustomEnd(new Date(e.target.value))}
                                                    className="border rounded p-1 text-sm text-gray-700 w-full"
                                                />
                                            </div>
                                            <button
                                                onClick={handleApplyCustomRange}
                                                className="w-full bg-[#3E9389] text-white rounded py-1.5 mt-2 hover:bg-[#88BFB9] transition text-sm font-medium"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="flex justify-center">
                        <InfoTooltip content={<>
                            <p className="font-bold">What is this?</p>
                            <ul className="list-disc pl-4">
                                <li>This is a 3D map of your chat history.</li>
                                <li>Messages with similar feelings are grouped together.</li>
                            </ul>
                            <p className="font-bold">How to use:</p>
                            <ul className="list-disc pl-4">
                                <li>Each dot is a message you sent.</li>
                                <li>The color shows the emotion (e.g., Happy, Sad).</li>
                                <li>Rotate & zoom to explore your emotional landscape.</li>
                                <li>Hover over a dot to see what you wrote.</li>
                            </ul>
                        </>} placement="bottom-right" iconSize="w-5 h-5" />
                    </div>
                </div>
            </div>
            {points.length > 0 ? (
                <div className="w-full bg-[#111c44] rounded-xl overflow-hidden relative" style={{ height }}>
                    {/* Legend */}
                    <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md p-3 rounded-lg text-white text-xs border border-white/10">
                        <p className="font-bold mb-2 uppercase tracking-wider opacity-70">Emotions</p>
                        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#FFD56B]"></span> Happy</div>
                        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#EA5E8F]"></span> Angry</div>
                        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#69D5C5]"></span> Sad</div>
                        <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#519AF6]"></span> Fear</div>
                        <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#A3AED0]"></span> Neutral</div>
                    </div>

                    {/* Tooltip Overlay */}
                    {hoveredPoint && (
                        <div
                            className="absolute z-20 bg-white/95 backdrop-blur shadow-2xl p-4 rounded-xl text-xs max-w-[250px] pointer-events-none transform transition-all duration-200"
                            style={{
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                border: '1px solid rgba(0,0,0,0.1)'
                            }}
                        >
                            <p className="font-bold text-navy-700 mb-1">
                                {new Date(hoveredPoint.created_at).toLocaleDateString()}
                            </p>
                            <p className="text-gray-800 italic">
                                "{hoveredPoint.text_content?.substring(0, 100)}{hoveredPoint.text_content?.length > 100 ? '...' : ''}"
                            </p>
                        </div>
                    )}

                    <Canvas camera={{ position: [8, 8, 8], fov: 50 }}>
                        <ambientLight intensity={0.7} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <pointLight position={[-10, -10, -10]} intensity={0.5} />

                        <Points data={points} onHover={setHoveredPoint} />

                        <OrbitControls
                            autoRotate
                            autoRotateSpeed={0.5}
                            enableZoom={true}
                            maxDistance={20}
                            minDistance={2}
                        />
                        <gridHelper args={[30, 30, 0x222222, 0x111111]} position={[0, -2, 0]} />
                    </Canvas>
                </div>
            ) : (
                <div className="flex w-full items-center justify-center mt-4 text-gray-400 bg-white rounded-2xl shadow-sm border border-gray-100" style={{ height: "350px" }}>
                    <p className="text-sm text-gray-500">No conversation history found</p>
                </div>
            )}
        </Card>

    );
};

export default EmbeddingVisualizer;