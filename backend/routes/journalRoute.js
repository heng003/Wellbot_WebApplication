const express = require('express');
const router = express.Router();

const journalController = require("../controllers/journalController");

router.get("/:userId", journalController.getJournalsByUser);
router.patch("/:id/fav", journalController.updateJournalFav);
router.patch("/:id", journalController.updateJournal);

module.exports = router;