require("dotenv").config();
const createError = require("../utils/appError");
const Intervention = require("../models/interventionModel");

// GET Interventions by User ID
exports.getInterventionsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { startDate, endDate } = req.query;

        const interventions = await Intervention.findInterventionsByUserId(
            userId,
            startDate,
            endDate
        );

        return res.json({ data: interventions });
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};
