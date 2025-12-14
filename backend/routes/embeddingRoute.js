const express = require('express');
const router = express.Router();

const embeddingController = require("../controllers/embeddingController.js");

router.get('/:userId', embeddingController.getEmbeddingsByUser);

module.exports = router;