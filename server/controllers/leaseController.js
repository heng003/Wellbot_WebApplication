const Lease = require('../models/leaseModel');

exports.getLeasesByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        if (!propertyId) {
            return res.status(400).json({ message: "Property ID is required" });
        }
        const leases = await Lease.find({ propertyId }).populate('tenantId','username');
        res.json(leases);
    } catch (err) {
        console.error("Error fetching leases:", err); 
        res.status(500).json({ message: "Internal Server Error" });
    }
};