/**
 * Emotion Classification Utility
 * 
 * Provides a lightweight, scoring-based mechanism to classify text into
 * basic emotions: Happy, Angry, Sad, Fear, or Neutral.
 * 
 * Features:
 * - Keyword matching with word boundaries for English.
 * - Substring matching for Chinese/Malay.
 * - Basic negation handling (e.g. "not happy").
 * - Scoring system to determine dominant emotion.
 */

const EMOTIONS = {
    Happy: {
        keywords: [
            // English
            'happy', 'joy', 'joyful', 'delighted', 'great', 'love', 'good', 'excited',
            'wonderful', 'glad', 'cheerful', 'laugh', 'pleased', 'content', 'grateful',
            'awesome', 'amazing', 'satisfied', 'relaxed', 'smile', 'hopeful',
            'positive', 'proud', 'thankful',

            // Malay
            'gembira', 'bahagia', 'seronok', 'suka', 'teruja', 'hebat', 'bagus',
            'ceria', 'puas', 'syukur', 'lega', 'tenang', 'senang'
        ],
        literals: ['开心', '快乐', '喜悦', '高兴', '棒', '美好', '喜欢', '满意', '轻松', '感恩']
    },

    Angry: {
        keywords: [
            // English
            'angry', 'mad', 'furious', 'rage', 'annoyed', 'irritated', 'frustrated',
            'upset', 'offended', 'hostile', 'pissed', 'fed up', 'resentful',
            'impatient', 'outraged',

            // Malay
            'marah', 'geram', 'bengang', 'panas', 'menyampah', 'meluat', 'naik angin',
            'tak sabar'
        ],
        literals: ['生气', '愤怒', '讨厌', '恼火', '烦', '不爽', '暴躁', '气死'],
        phrases: ['tak puas hati', 'naik darah']
    },

    Sad: {
        keywords: [
            // English
            'sad', 'cry', 'crying', 'down', 'bad', 'lonely', 'grief', 'upset',
            'disappointed', 'unhappy', 'heartbroken', 'low', 'moody', 'hurt',
            'depressed', 'empty', 'hopeless', 'tired', 'exhausted',

            // Malay
            'sedih', 'kecewa', 'muram', 'sepi', 'sunyi', 'tersentuh', 'terluka',
            'letih', 'penat', 'putus asa'
        ],
        literals: ['伤心', '难过', '哭', '悲伤', '孤独', '失落', '沮丧', '心累'],
        phrases: ['rasa down', 'tak bermaya']
    },

    Fear: {
        keywords: [
            // English
            'fear', 'scared', 'afraid', 'anxious', 'worry', 'worried', 'nervous',
            'uneasy', 'uncertain', 'tense', 'shaken', 'concerned', 'panic',
            'panicked', 'overthinking', 'stress', 'stressed',

            // Malay
            'takut', 'risau', 'cemas', 'gugup', 'gelisah', 'bimbang', 'was-was',
            'panik', 'tertekan'
        ],
        literals: ['害怕', '恐惧', '担心', '焦虑', '紧张', '不安', '慌', '压力']
    }
};

const NEGATORS = [
    'not', 'no', 'never', "don't", "dont", "doesn't", "doesnt", "didn't", "didnt",
    "isn't", "isnt", "aren't", "arent", "wasn't", "wasnt", "weren't", "werent",
    "won't", "wont", "wouldn't", "wouldnt", "can't", "cant", "cannot", "couldn't", "couldnt",
    'tak', 'tidak', 'bukan', 'jangan',
    '不', '没', '非'
];

/**
 * Classifies the emotion of the provided text.
 * @param {string} text - The input text to analyze.
 * @returns {string} - The detected emotion label ('Happy', 'Angry', 'Sad', 'Fear', 'Neutral').
 */
export const getEmotionLabel = (text = "") => {
    if (!text || typeof text !== 'string') return 'Neutral';

    // Normalize text
    const lowerText = text.toLowerCase();

    const scores = {
        Happy: 0,
        Angry: 0,
        Sad: 0,
        Fear: 0
    };

    // Helper to check negation within a window *before* the match index
    const isNegated = (matchIndex, inputText) => {
        // Look back up to ~15 characters or 3 words
        const start = Math.max(0, matchIndex - 20);
        const prefix = inputText.substring(start, matchIndex);

        // Check if any negator ends the prefix (allowing for spaces)
        // We use a simple regex for finding negators in the prefix
        // This splits by space and checks the last few tokens
        const tokens = prefix.split(/[\s,.]+/).filter(Boolean);
        if (tokens.length === 0) return false;

        // Check last 1-2 tokens for negators
        const lastToken = tokens[tokens.length - 1];
        const secondLastToken = tokens.length > 1 ? tokens[tokens.length - 2] : null;

        return NEGATORS.includes(lastToken) || (secondLastToken && NEGATORS.includes(secondLastToken));
    };

    // 1. Check Phrases First (Exact match in normalized text)
    Object.keys(EMOTIONS).forEach(emotion => {
        const { phrases } = EMOTIONS[emotion];
        if (phrases) {
            phrases.forEach(phrase => {
                const phraseIndex = lowerText.indexOf(phrase);
                if (phraseIndex !== -1) {
                    // Phrases usually capture the full meaning, so we trust them highly
                    // But we still check loose negation just in case (though unlikely for specific phrases like "tak puas hati")
                    // For "tak puas hati", "tak" is inside it. 
                    // We should be careful. If the phrase itself contains a negator, do not flip it.
                    // But "rasa down" does not.
                    // Simple heuristic: If matched, +2 score.
                    scores[emotion] += 2;
                }
            });
        }
    });

    // 2. Check Keywords (English/Malay alphabetic) -> Use Word Boundaries
    // 3. Check Literals (Chinese/Non-boundary matches) -> Use Substring
    Object.keys(EMOTIONS).forEach(emotion => {
        const { keywords, literals } = EMOTIONS[emotion];

        // Keywords with boundaries
        if (keywords) {
            keywords.forEach(word => {
                // Regex for word boundary: \bWORD\b
                // We construct regex dynamically. 
                // Escape special characters if any (keywords here are safe usually)
                const regex = new RegExp(`\\b${word}\\b`, 'g');
                let match;
                while ((match = regex.exec(lowerText)) !== null) {
                    if (isNegated(match.index, lowerText)) {
                        scores[emotion] -= 1; // It was negated
                    } else {
                        scores[emotion] += 1;
                    }
                }
            });
        }

        // Literals (Substring)
        if (literals) {
            literals.forEach(lit => {
                let pos = lowerText.indexOf(lit);
                while (pos !== -1) {
                    if (isNegated(pos, lowerText)) {
                        scores[emotion] -= 1;
                    } else {
                        scores[emotion] += 1;
                    }
                    pos = lowerText.indexOf(lit, pos + 1);
                }
            });
        }
    });

    // Determine Winner
    let maxScore = 0;
    let winner = 'Neutral';

    // Priority Check: Angry > Sad > Fear > Happy (mimicking original ordering somewhat for tie breaks)
    // Or just strictly by score.
    // Original: Happy matched first. Code: returns 'Happy' immediately.
    // So priority was Happy > Angry > Sad > Fear.

    const candidateOrder = ['Happy', 'Angry', 'Sad', 'Fear'];

    candidateOrder.forEach(emotion => {
        if (scores[emotion] > maxScore) {
            maxScore = scores[emotion];
            winner = emotion;
        }
    });

    return winner;
};
