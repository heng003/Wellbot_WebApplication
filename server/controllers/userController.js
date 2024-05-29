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

exports.getLandlordIdByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ landlordId: user._id });
    } catch (err) {
        console.error('Error fetching landlord ID:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getTenantIdByUsername = async (req, res) => {
    try {
        const { username } = req.params;
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ tenantId: user._id });
    } catch (err) {
        console.error('Error fetching tenant ID:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


