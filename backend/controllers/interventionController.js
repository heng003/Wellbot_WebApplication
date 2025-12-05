require("dotenv").config();
const createError = require("../utils/appError");
const Intervention = require("../models/interventionModel");

// GET Interventions by User ID
exports.getInterventionsByUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const interventions = await Intervention.findInterventionsByUserId(userId);
        return res.json({ data: interventions });
    } catch (err) {
        return res.status(500).json({ error: err.message, stack: err.stack });
    }
};