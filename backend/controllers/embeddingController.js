require("dotenv").config();
const createError = require("../utils/appError");
const Embeddings = require("../models/embeddingModel.js");

// GET Embeddings by User ID
exports.getEmbeddingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        const embeddings = await Embeddings.findEmbeddingsByUserId(
            userId,
            startDate,
            endDate
        );

        return res.json({ data: embeddings });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
