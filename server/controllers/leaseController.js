const Lease = require('../models/leaseModel');
const User = require('../models/userModel');
const Property = require('../models/propertyModel')

exports.getLeasesByPropertyId = async (req, res) => {
    try {
        const { propertyId } = req.params;
        if (!propertyId) {
            return res.status(400).json({ message: "Property ID is required" });
        }
        const leases = await Lease.find({ propertyId }).populate('tenantId','username overallRating');
        res.json(leases);
    } catch (err) {
        console.error("Error fetching leases:", err); 
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getLeasesByTenantUsername = async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }
    const tenant = await User.findOne({ username });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }
    const leases = await Lease.find({ tenantId: tenant._id }).populate(
      "tenantId",
      "username"
    );
    res.json(leases);
  } catch (err) {
    console.error("Error fetching leases:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getLeasesAndPropertiesByTenantId = async (req, res) => {
    try {
        const { tenantId } = req.params;
        if (!tenantId) {
            return res.status(400).json({ message: "Tenant ID is required" });
        }
        const leases = await Lease.find({ tenantId }).populate('tenantId', 'username');
        const leaseWithPropertiesPromises = leases.map(async (lease) => {
            const property = await Property.findById(lease.propertyId);
            return {
                ...lease.toObject(),
                property,
            };
        });
        const leasesWithProperties = await Promise.all(leaseWithPropertiesPromises);
        res.json(leasesWithProperties);
    } catch (err) {
        console.error("Error fetching leases and properties by tenant ID:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.downloadLeasePDF = async (req, res) => {
  try {
      const { leaseId } = req.params;
      console.log("Lease ID received:", leaseId); // Debug log
      if (!leaseId) {
          return res.status(400).json({ message: "Lease ID is required" });
      }

      const lease = await Lease.findById(leaseId);
      if (!lease) {
          return res.status(404).json({ message: "Lease not found" });
      }

      // If PDF is stored as base64 string in the 'PDF' field
      if (lease.PDF) {
          const buffer = Buffer.from(lease.PDF, 'base64');
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', 'attachment; filename=LeaseAgreement.pdf');
          res.send(buffer);
      } else if (lease.pdfPath) {
          // If PDF is stored as a file path
          const pdfPath = path.resolve(__dirname, '..', 'path_to_your_pdfs', lease.pdfPath);
          console.log("PDF Path resolved:", pdfPath); // Debug log

          // Check if the file exists
          if (!fs.existsSync(pdfPath)) {
              console.error("File does not exist at path:", pdfPath); // Debug log
              return res.status(404).json({ message: "File not found" });
          }

          // Send the file to the client
          res.download(pdfPath, 'LeaseAgreement.pdf', (err) => {
              if (err) {
                  console.error("Error sending file:", err);
                  res.status(500).json({ message: "Error downloading file" });
              }
          });
      } else {
          return res.status(404).json({ message: "Lease or PDF not found" });
      }
  } catch (err) {
      console.error("Error downloading lease PDF:", err);
      res.status(500).json({ message: "Internal Server Error" });
  }
};