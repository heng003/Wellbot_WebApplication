import React, { useCallback } from 'react';
import WordCloud from 'react-d3-cloud';

const data = [
	{ text: "happy", value: 30 },
	{ text: "excited", value: 20 },
	{ text: "calm", value: 18 },
	{ text: "sad", value: 15 },
	{ text: "angry", value: 12 },
	{ text: "fear", value: 10 },
	{ text: "relaxed", value: 8 },
	{ text: "tired", value: 7 },
	{ text: "anxious", value: 6 },
	{ text: "joy", value: 5 },
];

const rotate = word => 0;

const TodayEmotionWordCloud = () => {
	const fontSize = useCallback((word) => Math.log2(word.value) * 5, []);

	return (
		<div className="dashboard-wordcloud">
			<WordCloud
				data={data}
				height={300}
				width={200}
				fontSize={fontSize}
			/>
		</div>
	);
};

export default TodayEmotionWordCloud;
