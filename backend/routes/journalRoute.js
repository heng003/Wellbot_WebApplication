const express = require('express');
const router = express.Router();

const journalController = require("../controllers/journalController");

router.get("/:userId", journalController.getJournalsByUser);
router.patch("/:journalId/fav", journalController.updateJournalFav);
router.patch("/:journalId", journalController.updateJournal);
router.post("/create", journalController.createJournal);
router.delete('/delete/:journalId', journalController.deleteJournal);

module.exports = router;