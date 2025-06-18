require("dotenv").config();
const createError = require("../utils/appError");
const Guardian = require("../models/guardianModel");
const Permission = require("../models/permissionModel");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

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
    const { guardianId, userIdentification, requestMessage } = req.body;

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

        // Check if user allows guardian requests
        if (!user.allowGuardian) {
            return res.status(403).json({
                status: "error",
                message: "This user is not accepting guardian requests at the moment."
            });
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
            requestMessage: requestMessage || null,
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

// GET /api/permission/user/getPendingRequests/:userId
exports.getPendingRequests = async (req, res, next) => {
    const { userId } = req.params;
    try {
        // Find all permissions for this user with status 'pending'
        const permissions = await Permission.find({ userId, status: 'pending' }).lean();
        if (!permissions.length) return res.json([]);
        // Optionally, populate guardian info
        const guardianIds = permissions.map(p => p.guardianId);
        const guardians = await Guardian.find({ _id: { $in: guardianIds } }).lean();
        const guardianMap = guardians.reduce((map, g) => {
            map[g._id.toString()] = g;
            return map;
        }, {});
        // Combine permission and guardian info
        const pendingRequests = permissions.map(p => ({
            id: p._id.toString(),
            guardianId: p.guardianId,
            guardianName: guardianMap[p.guardianId.toString()]?.fullname || '',
            guardianUsername: guardianMap[p.guardianId.toString()]?.username || '',
            guardianEmail: guardianMap[p.guardianId.toString()]?.email || '',
            requestedAt: p.requestedAt,
            message: p.requestMessage,
            status: p.status
        }));
        return res.json(pendingRequests);
    } catch (err) {
        console.error(err);
        return next(new createError("Server Error", 500));
    }
};

// GET /api/permission/user/getActiveGuardians/:userId
exports.getActiveGuardians = async (req, res, next) => {
    const { userId } = req.params;
    try {
        // Find all permissions for this user with status 'active'
        const permissions = await Permission.find({ userId, status: 'active' }).lean();
        if (!permissions.length) return res.json([]);
        // Optionally, populate guardian info
        const guardianIds = permissions.map(p => p.guardianId);
        const guardians = await Guardian.find({ _id: { $in: guardianIds } }).lean();
        const guardianMap = guardians.reduce((map, g) => {
            map[g._id.toString()] = g;
            return map;
        }, {});
        // Combine permission and guardian info
        const activeGuardians = permissions.map(p => ({
            id: p._id.toString(),
            guardianId: p.guardianId,
            guardianName: guardianMap[p.guardianId.toString()]?.fullname || '',
            guardianEmail: guardianMap[p.guardianId.toString()]?.email || '',
            guardianUsername: guardianMap[p.guardianId.toString()]?.username || '',
            accessGrantedDate: p.updatedAt,
            // Optionally add more fields as needed
        }));
        return res.json(activeGuardians);
    } catch (err) {
        console.error(err);
        return next(new createError("Server Error", 500));
    }
};

// POST /api/permission/user/createActivePermission (for adding a guardian as active)
exports.createActivePermission = async (req, res, next) => {
    const { userId, guardianIdentification } = req.body;
    try {
        // Find guardian by email or username
        const guardian = await Guardian.findOne({
            $or: [
                { email: guardianIdentification },
                { username: guardianIdentification }
            ]
        });
        if (!guardian) return next(new createError("Guardian not existed.", 404));
        // Check if permission already exists
        const existing = await Permission.findOne({ userId, guardianId: guardian._id });
        if (existing) return res.status(200).json(existing);
        // Create new permission with status 'active'
        const newPermission = new Permission({
            userId,
            guardianId: guardian._id,
            status: 'active',
            updatedAt: new Date(),
        });
        const saved = await newPermission.save();
        return res.status(201).json(saved);
    } catch (err) {
        console.error(err);
        return next(new createError("Server Error", 500));
    }
};

// DELETE /api/permission/user/revokePermission (for revoking)
exports.deleteUserPermission = async (req, res, next) => {
    const { permissionId } = req.body;
    try {
        const permission = await Permission.findById(permissionId);
        if (!permission) return next(new createError("Permission not found.", 404));
        await Permission.deleteOne({ _id: permissionId });
        res.json({ message: 'Permission deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/permission/user/updateRequestStatus
exports.updateRequestStatus = async (req, res, next) => {
    const { permissionId, status } = req.body;
    try {
        const updated = await Permission.findByIdAndUpdate(
            permissionId,
            { status, updatedAt: new Date() },
            { new: true }
        );
        if (!updated) return res.status(404).json({ message: 'Permission not found' });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.getActiveGuardianCount = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const count = await Permission.countDocuments({ userId: decoded.userId, status: "active" });
        res.status(200).json({ status: "success", count });
    } catch (error) {
        next(error);
    }
};