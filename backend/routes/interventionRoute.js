const express = require('express');
const router = express.Router();

const interventionController = require("../controllers/interventionController.js");

router.get('/:userId', interventionController.getInterventionsByUser);

module.exports = router;