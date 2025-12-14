import React, { useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { computePCA } from "../utils/reportUtils";

const Points = ({ data, onHover }) => {
    const ref = useRef();

    // Animate rotation slowly
    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.y += 0.001;
        }
    });

    // Color logic: "Emotion Classification"
    // Using the specific hex codes provided
    const getColor = (item) => {
        const text = (item.text_content || "").toLowerCase();

        // Simple keyword check acting as our classifier
        if (text.match(/happy|joy|joyful|delighted|great|love|good|excited|wonderful|glad|cheerful|laugh|pleased|content|grateful|awesome|amazing|开心|快乐|喜悦|高兴|棒|美好|喜欢|gembira|bahagia|seronok|suka|teruja|hebat|bagus|ceria|puas|syukur/))  return "#519AF6";
        if (text.match(/sad|cry|crying|down|bad|lonely|grief|upset|disappointed|unhappy|heartbroken|low|moody|hurt|伤心|难过|哭|悲伤|孤独|失落|沮丧|sedih|kecewa|muram|sepi|sunyı|tersentuh|terluka|rasa down/)) return "#69D5C5";
        if (text.match(/angry|mad|furious|rage|annoyed|irritated|frustrated|upset|offended|hostile|生气|愤怒|讨厌|恼火|烦|不爽|marah|geram|bengang|panas|menyampah|tak puas hati/)) return "#7E6FEE";
        if (text.match(/fear|scared|afraid|anxious|worry|worried|nervous|uneasy|uncertain|tense|shaken|concerned|害怕|恐惧|担心|焦虑|紧张|不安|takut|risau|cemas|gugup|gelisah|bimbang|was-was/)) return "#EA5E8F";


        return '#A3AED0'; // Neutral/Gray
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

const EmbeddingVisualizer = ({ rawEmbeddings }) => {
    const [hoveredPoint, setHoveredPoint] = useState(null);

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

    if (points.length === 0) return (
        <div className="flex h-full w-full items-center justify-center bg-gray-50 rounded-xl min-h-[300px]">
            <p className="text-gray-400">No message data available for visualization</p>
        </div>
    );

    return (
        <div className="h-[500px] w-full bg-[#111c44] rounded-xl overflow-hidden relative">
            {/* Legend */}
            <div className="absolute top-4 left-4 z-10 bg-black/40 backdrop-blur-md p-3 rounded-lg text-white text-xs border border-white/10">
                <p className="font-bold mb-2 uppercase tracking-wider opacity-70">Chat History Emotional Clusters</p>
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
                    <p className="text-gray-600 italic">
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
    );
};

export default EmbeddingVisualizer;