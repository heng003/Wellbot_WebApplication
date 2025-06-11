require("dotenv").config();
const createError = require("../utils/appError");
const Guardian = require("../models/guardianModel");
const Permission = require("../models/permissionModel");
const User = require("../models/userModel");

// GET Get Monitored List
exports.getMonitoredList = async (req, res, next) => {
    const { guardianId } = req.params;

    try {
        // validate guardian
        const guardian = await Guardian.findById(guardianId);
        if (!guardian) {
            return next(new createError("Guardian not existed.", 404));
        }

        // get all permissions for this guardian
        const permissions = await Permission.find({ guardianId }).lean();
        if (!permissions.length) {
            return res.json([]); // no monitored users
        }

        // build a map userId → permission object
        const permissionByUser = permissions.reduce((map, perm) => {
            map[perm.userId.toString()] = perm;
            return map;
        }, {});

        // fetch all those users
        const userIds = permissions.map(p => p.userId);
        const users = await User.find({ _id: { $in: userIds } })
            .lean()
            .exec();

        // merge in `status`, `updatedAt`, and `requestedAt` fields on each user object
        const monitoredList = users.map(u => {
            const perm = permissionByUser[u._id.toString()];
            return {
                ...u,
                id: u._id.toString(),
                status: perm?.status || null,
                updatedAt: perm?.updatedAt || null,
                requestedAt: perm?.requestedAt || null
            };
        });

        // return monitored list
        if (!monitoredList.length) {
            return res.json([]);
        }
        return res.json(monitoredList);

    } catch (err) {
        console.error(err);
        return next(new createError("Server Error", 500));
    }
};


// POST Send Request
exports.createPermission = async (req, res, next) => {
    const { guardianId, userIdentification } = req.body;

    try {
        // Validate that the user exist
        const user = await User.findOne({
            $or: [
                { email: userIdentification },
                { username: userIdentification }
            ]
        });

        const guardian = await Guardian.findById(guardianId);

        if (!user) {
            return next(new createError("User not existed.", 404));
        }

        if (!guardian) {
            return next(new createError("Guardian not existed.", 404));
        }

        const userId = user._id;

        // Check if a permission already exists for this user and guardian 
        const existingPermission = await Permission.findOne({
            guardianId,
            userId
        });
        if (existingPermission) {
            console.log("Existing permission found:", existingPermission);
            return res.status(200).json(existingPermission);
        }

        // Create a new pending permission
        const newPermission = new Permission({
            guardianId,
            userId,
            status: 'pending',
            requestedAt: new Date(),
        });

        // Save the application to the database
        const savedApplication = await newPermission.save();

        console.log("New permission created:", savedApplication);
        return res.status(201).json(savedApplication);
    } catch (error) {
        console.error("Error creating pending permission:", error);
        return res.status(500).json({ error: error.message });
    }
};

// DELETE delete permission
exports.deletePermission = async (req, res, next) => {
    const { guardianId, userId } = req.body;

    try {
        const permission = await Permission.findOne({ guardianId, userId });
        if (!permission) {
            return next(new createError("Permission not found.", 404));
        }

        await Permission.deleteOne({ guardianId, userId });

        res.json({ message: 'Request / Permission deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
