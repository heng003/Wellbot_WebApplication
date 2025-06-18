require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Guardian = require("../models/guardianModel");
const Device = require("../models/deviceModel");
const createError = require("../utils/appError");

// GET user profile with device info
exports.getUserProfile = async (req, res, next) => {
    try {
        // Extract token from the request headers
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Retrieve user data using the user ID from the decoded token
        let user = await User.findById(decoded.userId).lean();
        if (!user) {
            // If user not found, check if the user is a guardian
            user = await Guardian.findById(decoded.userId).lean();
        }

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        // Get device info if deviceId exists
        let serialNumber = null;
        if (user.deviceId) {
            const device = await Device.findById(user.deviceId).lean();
            if (device) {
                serialNumber = device.serialNumber;
            }
        }

        res.status(200).json({
            status: "success",
            data: {
                id: user._id,
                fullname: user.fullname,
                username: user.username,
                age: user.age,
                gender: user.gender,
                language: user.language,
                spiritualBeliefs: user.spiritualBeliefs,
                culturalBackground: user.culturalBackground,
                allowGuardian: user.allowGuardian,
                deviceId: user.deviceId || null,
                serialNumber: serialNumber || null
            }
        });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({ status: "error", message: "Invalid token" });
        } else if (error.name === "TokenExpiredError") {
            return res.status(401).json({ status: "error", message: "Token expired" });
        } else {
            next(new createError("Internal Server Error", 500));
        }
    }
};

// UPDATE user profile
exports.updateUserProfile = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findById(decoded.userId);
        if (!user) {
            // If user not found, check if the user is a guardian
            user = await Guardian.findById(decoded.userId);
        }

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        let usernameExists = await User.findOne({ username });
        if (!usernameExists) {
            usernameExists = await Guardian.findOne({ username });
        }

        if (usernameExists) {
            return next(new createError("Username already been registered", 400));
        }

        // Update fields (add or remove fields as needed)
        const {
            fullname,
            username,
            age,
            gender,
            language,
            culturalBackground,
            spiritualBeliefs
        } = req.body;

        if (fullname !== undefined) user.fullname = fullname;
        if (username !== undefined) user.username = username;
        if (age !== undefined) user.age = age;
        if (gender !== undefined) user.gender = gender;
        if (language !== undefined) user.language = language;
        if (culturalBackground !== undefined) user.culturalBackground = culturalBackground;
        if (spiritualBeliefs !== undefined) user.spiritualBeliefs = spiritualBeliefs;

        await user.save();

        res.status(200).json({
            status: "success",
            message: "Profile updated successfully",
            data: {
                id: user._id,
                fullname: user.fullname,
                username: user.username,
                age: user.age,
                gender: user.gender,
                language: user.language,
                culturalBackground: user.culturalBackground,
                spiritualBeliefs: user.spiritualBeliefs
            }
        });
    } catch (error) {
        console.error("Error updating user profile:", error);
        res.status(500).json({ status: "error", message: "Failed to update profile" });
    }
};

exports.changePassword = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            // Frontend should show Swal error
            return res.status(400).json({ status: "error", message: "Current password is incorrect" });
        }

        user.password = await bcrypt.hash(newPassword, 12);
        await user.save();

        // Frontend should show Swal success
        res.status(200).json({ status: "success", message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
};

exports.changeDevice = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { serialNumber } = req.body;
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const newDevice = await Device.findOne({ serialNumber, status: "inactive" });
        if (!newDevice) {
            // Frontend should show Swal error
            return res.status(400).json({ status: "error", message: "Device not found or already in use" });
        }

        // Set old device to inactive
        if (user.deviceId) {
            await Device.findByIdAndUpdate(user.deviceId, { status: "inactive" });
        }

        // Set new device to active
        newDevice.status = "active";
        await newDevice.save();

        // Update user
        user.deviceId = newDevice._id;
        await user.save();

        // Frontend should show Swal success
        res.status(200).json({ status: "success", message: "Device changed successfully" });
    } catch (error) {
        next(error);
    }
};

exports.updateGuardianPermission = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { allowGuardian } = req.body;
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        user.allowGuardian = !!allowGuardian;
        await user.save();

        res.status(200).json({ status: "success", message: "Guardian permission updated", allowGuardian: user.allowGuardian });
    } catch (error) {
        next(error);
    }
};