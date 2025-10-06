const express = require('express');
const router = express.Router();

const emotionController = require("../controllers/emotionController");

router.get("/getEmotionsByDate/:userId", emotionController.getEmotionsByDate);

module.exports = router;