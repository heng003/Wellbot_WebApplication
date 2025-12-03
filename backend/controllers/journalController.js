require("dotenv").config();
const createError = require("../utils/appError");
const Journal = require('../models/journalModel');

// GET /api/journal/:userId
exports.getJournalsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const journals = await Journal.getJournalsByUser(userId);
        const filtered = journals.map(j => ({
            id: j.id,
            title: j.title,
            body: j.body,
            mood: j.mood,
            created_at: j.created_at,
            fav: j.fav
        }));

        return res.json(filtered);
    } catch (err) {
        console.error('Error fetching journals:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateJournalFav = async (req, res) => {
    try {
        const { id } = req.params;
        const { fav } = req.body;
        const updated = await Journal.toggleFav(id, fav);
        return(res.json(updated));
    } catch (err) {
        console.error('Error toggling fav:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateJournal = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body; // title, body, mood, topics, created_at, fav
        const updated = await journalModel.updateJournal(id, payload);
        return(res.json(updated));
    } catch (err) {
        console.error('Error updating journal:', err);
        res.status(500).json({ error: err.message });
    }
};
