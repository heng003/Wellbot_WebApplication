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
        const guardian = await Guardian.findGuardianById(guardianId);
        if (!guardian) {
            return next(new createError("Guardian not existed.", 404));
        }
        const permissions = await Permission.findPermissionsByGuardianId(guardianId);
        if (!permissions.length) return res.json([]);
        const userIds = permissions.map(p => p.user_id);
        const users = await User.findUsersByIds(userIds);
        const permissionByUser = {};
        permissions.forEach(perm => { permissionByUser[perm.user_id] = perm; });
        const monitoredList = users.map(u => {
            const perm = permissionByUser[u.id];
            return {
                ...u,
                id: u.id,
                status: perm?.status || null,
                updatedAt: perm?.updated_at || null,
                requestedAt: perm?.requested_at || null
            };
        });
        return res.json(monitoredList);
    } catch (err) {
        return next(new createError("Server Error", 500));
    }
};

// POST Send Request
exports.createPermission = async (req, res, next) => {
    const { guardianId, userIdentification, requestMessage } = req.body;
    try {
        const user = await User.findUserByEmail(userIdentification) || await User.findUserByUsername(userIdentification);
        const guardian = await Guardian.findGuardianById(guardianId);
        if (!user) return next(new createError("User not existed.", 404));
        if (!guardian) return next(new createError("Guardian not existed.", 404));
        if (!user.allow_guardian) {
            return res.status(403).json({
                status: "error",
                message: "This user is not accepting guardian requests at the moment."
            });
        }
        const existingPermission = await Permission.findPermissionByGuardianAndUser(guardianId, user.id);
        if (existingPermission) return res.status(200).json(existingPermission);
        const newPermission = await Permission.createPermission({
            guardian_id: guardianId,
            user_id: user.id,
            status: 'pending',
            requested_at: new Date(),
            request_message: requestMessage || null,
        });
        return res.status(201).json(newPermission);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// DELETE delete permission
exports.deletePermission = async (req, res, next) => {
    const { guardianId, userId } = req.body;
    try {
        const permission = await Permission.findPermissionByGuardianAndUser(guardianId, userId);
        if (!permission) return next(new createError("Permission not found.", 404));
        await Permission.deletePermissionByGuardianAndUser(guardianId, userId);
        res.json({ message: 'Request / Permission deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// GET /api/permission/user/getPendingRequests/:userId
exports.getPendingRequests = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const permissions = await Permission.findPermissionsByUserIdAndStatus(userId, 'pending');
        if (!permissions.length) return res.json([]);
        const guardianIds = permissions.map(p => p.guardian_id);
        const guardians = await Guardian.findGuardiansByIds(guardianIds);
        const guardianMap = {};
        guardians.forEach(g => { guardianMap[g.id] = g; });
        const pendingRequests = permissions.map(p => ({
            id: p.id,
            guardianId: p.guardian_id,
            guardianName: guardianMap[p.guardian_id]?.fullname || '',
            guardianUsername: guardianMap[p.guardian_id]?.username || '',
            guardianEmail: guardianMap[p.guardian_id]?.email || '',
            requestedAt: p.requested_at,
            message: p.request_message,
            status: p.status
        }));
        return res.json(pendingRequests);
    } catch (err) {
        return next(new createError("Server Error", 500));
    }
};

// GET /api/permission/user/getActiveGuardians/:userId
exports.getActiveGuardians = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const permissions = await Permission.findPermissionsByUserIdAndStatus(userId, 'active');
        if (!permissions.length) return res.json([]);
        const guardianIds = permissions.map(p => p.guardian_id);
        const guardians = await Guardian.findGuardiansByIds(guardianIds);
        const guardianMap = {};
        guardians.forEach(g => { guardianMap[g.id] = g; });
        const activeGuardians = permissions.map(p => ({
            id: p.id,
            guardianId: p.guardian_id,
            guardianName: guardianMap[p.guardian_id]?.fullname || '',
            guardianEmail: guardianMap[p.guardian_id]?.email || '',
            guardianUsername: guardianMap[p.guardian_id]?.username || '',
            accessGrantedDate: p.updated_at,
        }));
        return res.json(activeGuardians);
    } catch (err) {
        return next(new createError("Server Error", 500));
    }
};

// POST /api/permission/user/createActivePermission (for adding a guardian as active)
exports.createActivePermission = async (req, res, next) => {
    const { userId, guardianIdentification } = req.body;
    try {
        const guardian = await Guardian.findGuardianByEmailOrUsername(guardianIdentification);
        if (!guardian) return next(new createError("Guardian not existed.", 404));
        const existing = await Permission.findPermissionByGuardianAndUser(guardian.id, userId);
        if (existing) return res.status(200).json(existing);
        const newPermission = await Permission.createPermission({
            user_id: userId,
            guardian_id: guardian.id,
            status: 'active',
            updated_at: new Date(),
        });
        return res.status(201).json(newPermission);
    } catch (err) {
        return next(new createError("Server Error", 500));
    }
};

// DELETE /api/permission/user/revokePermission (for revoking)
exports.deleteUserPermission = async (req, res, next) => {
    const { permissionId } = req.body;
    try {
        const permission = await Permission.findPermissionById(permissionId);
        if (!permission) return next(new createError("Permission not found.", 404));
        await Permission.deletePermissionById(permissionId);
        res.json({ message: 'Permission deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

// PATCH /api/permission/user/updateRequestStatus
exports.updateRequestStatus = async (req, res, next) => {
    const { permissionId, status } = req.body;
    try {
        const updated = await Permission.updatePermissionStatusById(permissionId, status);
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
        const count = await Permission.countActiveGuardians(decoded.userId);
        res.status(200).json({ status: "success", count });
    } catch (error) {
        next(error);
    }
};