const express = require('express');
const router = express.Router();

const emotionController = require("../controllers/emotionController");

router.get("/getEmotionsByDate/:userId", emotionController.getEmotionsByDate);
router.get("/getTrend/:userId", emotionController.getEmotionalScoreTrend);
router.get('/getCountsByDate/:userId', emotionController.getEmotionCountsByDate);

module.exports = router;