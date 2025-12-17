import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { computePCA } from "../utils/reportUtils";
import Card from "../dashboard/card";
import InfoTooltip from "./InfoTooltip";
import DropdownIcon from "../icons/DropdownIcon";

const Points = ({ data, onHover }) => {
    const ref = useRef();

    // Animate rotation slowly
    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.001;
        }
    });

    const getColor = (item) => {
        const label = getEmotionLabel(item.text_content);
        switch (label) {
            case 'Happy': return '#519AF6';
            case 'Sad': return '#69D5C5';
            case 'Angry': return '#7E6FEE';
            case 'Fear': return '#EA5E8F';
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
    if (t.match(/sad|cry|crying|down|bad|lonely|grief|upset|disappointed|unhappy|heartbroken|low|moody|hurt|伤心|难过|哭|悲伤|孤独|失落|沮丧|sedih|kecewa|muram|sepi|sunyı|tersentuh|terluka|rasa down/)) return 'Sad';
    if (t.match(/angry|mad|furious|rage|annoyed|irritated|frustrated|upset|offended|hostile|生气|愤怒|讨厌|恼火|烦|不爽|marah|geram|bengang|panas|menyampah|tak puas hati/)) return 'Angry';
    if (t.match(/fear|scared|afraid|anxious|worry|worried|nervous|uneasy|uncertain|tense|shaken|concerned|害怕|恐惧|担心|焦虑|紧张|不安|takut|risau|cemas|gugup|gelisah|bimbang|was-was/)) return 'Fear';
    return 'Neutral';
};

const EmbeddingVisualizer = ({ rawEmbeddings }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);
    const [insExpanded, setInsExpanded] = useState(false);

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

    // Compute quick insights from points
    const insights = useMemo(() => {
        if (!points || points.length === 0) return null;

        const counts = points.reduce((acc, p) => {
            const label = getEmotionLabel(p.text_content);
            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {});

        const total = points.length;
        const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0] || [null, 0];

        // most recent
        const sortedByDate = [...points].filter(p => p.created_at).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        const mostRecent = sortedByDate[0] || null;

        // centroid and outlier detection (distance-based)
        const centroid = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y, z: acc.z + p.z }), { x: 0, y: 0, z: 0 });
        centroid.x /= total; centroid.y /= total; centroid.z /= total;
        const distances = points.map(p => Math.sqrt((p.x - centroid.x) ** 2 + (p.y - centroid.y) ** 2 + (p.z - centroid.z) ** 2));
        const meanDist = distances.reduce((a, b) => a + b, 0) / distances.length;
        const std = Math.sqrt(distances.reduce((a, b) => a + (b - meanDist) ** 2, 0) / distances.length);
        const outlierThreshold = meanDist + 2 * std;
        const outliers = distances.filter(d => d > outlierThreshold).length;

        return {
            counts,
            total,
            dominant: { label: dominant[0], count: dominant[1] },
            mostRecent,
            outliers,
            centroid,
            meanDist
        };
    }, [points]);

    if (points.length === 0) return (
        <div className="flex h-[220px] w-full items-center justify-center mt-4">
            <p className="text-sm text-gray-500">No message data available for visualization</p>
        </div>
    );

    return (
        <Card extra="p-4 pb-5">
            <div className="flex w-full items-center justify-between p-2 pb-3">
                <div className="flex flex-col gap-2">
                    <p className="text-lg font-bold">Emotional Clusters</p>
                    <p className="card-subtitle text-sm">Messages clustered by semantic embeddings; points colored by inferred emotion.</p>
                </div>
                <div>
                    <InfoTooltip content={<> 
                        <p className="font-bold">About this chart:</p>
                        <ul className="list-disc pl-4">
                            <li>Each point represents a message.</li>
                            <li>Colors show an inferred emotion based on message text.</li>
                        </ul>
                        <p className="font-bold">How to interpret this chart:</p>
                        <ul className="list-disc pl-4">
                            <li>Rotate & zoom to inspect different emotion clusters.</li>
                            <li>Hover points to read messages.</li>
                        </ul>
                    </>} placement="bottom-right" iconSize="w-5 h-5" />
                </div>
            </div>
            <div className="h-[500px] w-full bg-[#111c44] rounded-xl overflow-hidden relative">
                {/* Legend */}
                <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md p-3 rounded-lg text-white text-xs border border-white/10">
                    <p className="font-bold mb-2 uppercase tracking-wider opacity-70">Emotion Clusters</p>
                    <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#519AF6]"></span> Happy</div>
                    <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#69D5C5]"></span> Sad</div>
                    <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#7E6FEE]"></span> Angry</div>
                    <div className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full bg-[#EA5E8F]"></span> Fear</div>
                    <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#A3AED0]"></span> Neutral</div>
                </div>

                {/* Tooltip Overlay */}
                {hoveredPoint && (
                    <div
                        className="absolute z-20 bg-white/95 backdrop-blur shadow-2xl p-4 rounded-xl text-xs max-w-[250px] pointer-events-none transform transition-all duration-200"
                        style={{
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)', // Center it for better UX in 3D space
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
                        autoRotateSpeed={0.8}
                        enableZoom={true}
                        maxDistance={20}
                        minDistance={2}
                    />
                    <gridHelper args={[30, 30, 0x222222, 0x111111]} position={[0, -2, 0]} />
                </Canvas>
            </div>

            {/* Expandable Quick Insights under chart */}
            {insights && (
                <></>
                // <div>
                //     <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 shadow-sm">
                //         <button
                //             onClick={() => setInsExpanded(!insExpanded)}
                //             className="w-full flex items-center justify-between hover:opacity-90 transition-opacity"
                //         >
                //             <div className="flex items-center gap-2">
                //                 <span className="text-lg">💡</span>
                //                 <p className="text-md font-bold text-gray-800">Quick Insights</p>
                //             </div>
                //             <span className={`text-gray-600 transform transition-transform ${insExpanded ? 'rotate-180' : ''} scale-75`}>
                //                 <DropdownIcon />
                //             </span>
                //         </button>

                //         {insExpanded && (
                //             <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-slate-200">
                //                 <div className="p-2 bg-white bg-opacity-60 rounded">
                //                     <p className="text-sm text-gray-800 font-semibold mb-1">Overview</p>
                //                     <p className="text-sm text-gray-700">Total messages: <span className="font-bold">{insights.total}</span></p>
                //                     <p className="text-sm text-gray-700">Dominant emotion: <span className="font-bold">{insights.dominant.label}</span> ({insights.dominant.count})</p>
                //                 </div>

                //                 <div className="p-2 bg-white bg-opacity-60 rounded">
                //                     <p className="text-sm text-gray-800 font-semibold mb-1">Distribution</p>
                //                     <div className="flex flex-wrap gap-2">
                //                         {Object.entries(insights.counts).map(([k, v]) => (
                //                             <span key={k} className="text-xs px-2 py-1 rounded" style={{ background: '#f1f5f9' }}>
                //                                 {k}: <strong>{v}</strong>
                //                             </span>
                //                         ))}
                //                     </div>
                //                 </div>

                //                 {insights.mostRecent && (
                //                     <div className="p-2 bg-white bg-opacity-60 rounded">
                //                         <p className="text-sm text-gray-800 font-semibold mb-1">Most recent message</p>
                //                         <p className="text-sm text-gray-700 italic">"{insights.mostRecent.text_content?.substring(0, 140)}{insights.mostRecent.text_content?.length > 140 ? '...' : ''}"</p>
                //                         <p className="text-xs text-gray-500 mt-1">{new Date(insights.mostRecent.created_at).toLocaleString()}</p>
                //                     </div>
                //                 )}

                //                 <div className="p-2 bg-white bg-opacity-60 rounded">
                //                     <p className="text-sm text-gray-800 font-semibold mb-1">Outliers</p>
                //                     <p className="text-sm text-gray-700">Detected outliers: <span className="font-bold">{insights.outliers}</span>. High outlier count may indicate unique or strongly different messages.</p>
                //                 </div>

                //                 {/* <div className="flex flex-col gap-1 text-md text-gray-500 mt-2 p-2 bg-white rounded border border-slate-100">
                //                     <p className="font-semibold text-gray-800">💭 Tip:</p>
                //                     <p className="text-sm">Use rotation and zoom to inspect clusters; hover points to preview messages. Consider exporting messages in a cluster for deeper review.</p>
                //                 </div> */}
                //             </div>
                //         )}
                //     </div>
                // </div>
            )}
        </Card>

    );
};

export default EmbeddingVisualizer;