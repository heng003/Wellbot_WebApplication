const User = require("../models/userModel");

exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id).select('username');
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.status(200).json({ status: 'success', data: user });
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        next(new createError("Internal Server Error", 500));
    }
};

