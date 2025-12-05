require("dotenv").config();
const createError = require("../utils/appError");
const Gratitude = require('../models/gratitudeModel.js');

// GET /api/gratitude/:userId
exports.getGratitudesByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const gratitudes = await Gratitude.getGratitudesByUser(userId);
        const filtered = gratitudes.map(j => ({
            id: j.id,
            text: j.text,
            created_at: j.created_at,
            fav: j.fav
        }));

        return res.json(filtered);
    } catch (err) {
        console.error('Error fetching gratitudes:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateGratitudeFav = async (req, res) => {
    try {
        const { id } = req.params;
        const { fav } = req.body;
        const updated = await Gratitude.toggleFav(id, fav);
        return (res.json(updated));
    } catch (err) {
        console.error('Error toggling fav:', err);
        res.status(500).json({ error: err.message });
    }
};

exports.updateGratitude = async (req, res) => {
    try {
        const { id } = req.params;
        const payload = req.body;
        const updated = await Gratitude.updateGratitude(id, payload);
        return res.json(updated);
    } catch (err) {
        console.error("Update Error:", err);
        res.status(500).json({ error: err.message });
    }
};

exports.createGratitude = async (req, res) => {
    try {
        const payload = req.body;
        const newGratitude = await Gratitude.createGratitude(payload);
        return res.status(201).json({ data: newGratitude });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

exports.deleteGratitude = async (req, res) => {
    // FIX: Ensure you extract the ID correctly based on how you send it (body or params)
    const { gratitudeId } = req.body; 
    try {
        await Gratitude.deleteGratitude(gratitudeId); // FIX Here
        res.json({ message: 'Gratitude deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};