require("dotenv").config();
const createError = require("../utils/appError");

const Intervention = require("../models/interventionModel");

// GET Interventions by User ID
exports.getInterventionsByUser = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const interventions = await Intervention.findInterventionsByUserId(userId);
        // respond in a consistent shape
        return res.json({ data: interventions });
    } catch (err) {
        return next(new createError("Server Error", 500));
    }
};