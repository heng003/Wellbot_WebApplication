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
        const updated = await Journal.updateJournal(id, payload);
        return(res.json(updated));
    } catch (err) {
        console.error('Error updating journal:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.createJournal = async (req, res) => {
    try {
        const payload = req.body;
        const newJournal = await Journal.createJournal(payload);
        return res.status(201).json({ data: newJournal });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteJournal = async (req, res) => {
    // FIX: Ensure you extract the ID correctly based on how you send it (body or params)
    const { journalId } = req.body; 
    try {
        await Journal.deleteJournal(journalId); // FIX Here
        res.json({ message: 'Journal deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};