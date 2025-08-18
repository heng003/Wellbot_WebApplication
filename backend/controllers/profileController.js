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
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findUserById(decoded.userId);
        if (!user) {
            user = await Guardian.findGuardianById(decoded.userId);
        }
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        let serialNumber = null;
        if (user.device_id) {
            const device = await Device.findDeviceById(user.device_id);
            if (device) serialNumber = device.serial_number;
        }

        res.status(200).json({
            status: "success",
            data: {
                id: user.id,
                fullname: user.fullname,
                username: user.username,
                age: user.age,
                gender: user.gender,
                language: user.language,
                spiritualBeliefs: user.spiritual_beliefs,
                culturalBackground: user.cultural_background,
                allowGuardian: user.allow_guardian,
                deviceId: user.device_id || null,
                serialNumber: serialNumber || null
            }
        });
    } catch (error) {
        next(new createError("Internal Server Error", 500));
    }
};

// UPDATE user profile
exports.updateUserProfile = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        let user = await User.findUserById(decoded.userId);
        let table = 'users';
        if (!user) {
            user = await Guardian.findGuardianById(decoded.userId);
            table = 'guardians';
        }
        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const {
            fullname,
            username,
            age,
            gender,
            language,
            culturalBackground,
            spiritualBeliefs
        } = req.body;

        // Username uniqueness check (exclude current user)
        if (username !== undefined) {
            let usernameExists = await User.findUserByUsername(username);
            if (usernameExists && usernameExists.id !== user.id) {
                return next(new createError("Username already been registered", 400));
            }
            let guardianExists = await Guardian.findGuardianByUsernameExcludeId(username, user.id);
            if (guardianExists) {
                return next(new createError("Username already been registered", 400));
            }
        }

        const updateObj = {};
        if (fullname !== undefined) updateObj.fullname = fullname;
        if (username !== undefined) updateObj.username = username;
        if (age !== undefined) updateObj.age = age;
        if (gender !== undefined) updateObj.gender = gender;
        if (language !== undefined) updateObj.language = language;
        if (culturalBackground !== undefined) updateObj.cultural_background = culturalBackground;
        if (spiritualBeliefs !== undefined) updateObj.spiritual_beliefs = spiritualBeliefs;

        if (table === 'users') {
            await User.updateUserById(user.id, updateObj);
        } else {
            await Guardian.updateGuardianById(user.id, updateObj);
        }

        res.status(200).json({
            status: "success",
            message: "Profile updated successfully",
            data: {
                id: user.id,
                ...updateObj
            }
        });
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to update profile" });
    }
};

// CHANGE PASSWORD
exports.changePassword = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { currentPassword, newPassword } = req.body;
        const user = await User.findUserById(decoded.userId);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ status: "error", message: "Current password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await User.updateUserById(user.id, { password: hashedPassword });

        res.status(200).json({ status: "success", message: "Password updated successfully" });
    } catch (error) {
        next(error);
    }
};

// CHANGE DEVICE
exports.changeDevice = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { serialNumber } = req.body;
        const user = await User.findUserById(decoded.userId);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        const newDevice = await Device.findDeviceBySerialAndStatus(serialNumber, "inactive");
        if (!newDevice) {
            return res.status(400).json({ status: "error", message: "Device not found or already in use" });
        }

        // Set old device to inactive
        if (user.device_id) {
            await Device.updateDeviceById(user.device_id, { status: "inactive" });
        }

        // Set new device to active
        await Device.updateDeviceById(newDevice.id, { status: "active" });

        // Update user
        await User.updateUserById(user.id, { device_id: newDevice.id });

        res.status(200).json({ status: "success", message: "Device changed successfully" });
    } catch (error) {
        next(error);
    }
};

// UPDATE GUARDIAN PERMISSION
exports.updateGuardianPermission = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const { allowGuardian } = req.body;
        const user = await User.findUserById(decoded.userId);

        if (!user) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }

        await User.updateUserById(user.id, { allow_guardian: !!allowGuardian });

        res.status(200).json({ status: "success", message: "Guardian permission updated", allowGuardian: !!allowGuardian });
    } catch (error) {
        next(error);
    }
};