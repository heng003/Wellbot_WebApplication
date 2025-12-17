const express = require('express');
const router = express.Router();

const emotionController = require("../controllers/emotionController");

router.get("/getEmotionsByDate/:userId", emotionController.getEmotionsByDate);
router.get("/getTrend/:userId", emotionController.getEmotionalScoreTrend);
router.get('/getCountsByDate/:userId', emotionController.getEmotionCountsByDate);
router.get('/getLogs/:userId', emotionController.getEmotionalLogs);
router.get('/moodActivityCorrelation/:userId', emotionController.getMoodActivityCorrelation);

module.exports = router;