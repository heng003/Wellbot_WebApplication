const jwt = require('jsonwebtoken');
const ReviewTenant = require('../models/reviewTenantModel');
const User = require('../models/userModel')

exports.createReview = async (req, res) => {
  try {
      const { tenantId, landlordId, tenantRating, commentTenant } = req.body;

      console.log('tenantId:', tenantId);
      console.log('landlordId:', landlordId);
      console.log('tenantRating:', tenantRating);
      console.log('commentTenant:', commentTenant);

      if (!tenantId || !landlordId || tenantRating === undefined || !commentTenant) {
          return res.status(400).json({ message: "All fields are required" });
      }

      const newReview = new ReviewTenant({
          tenantId,
          landlordId,
          tenantRating,
          commentTenant
      });

      await newReview.save();

      const tenant = await User.findOne({ _id: tenantId, role: 'tenant' });

      if (!tenant) {
        return res.status(404).json({ message: 'Tenant not found' });
      }

      const newNumberReview = tenant.numberReview + 1;

      let newOverallRating;
      if (!tenant.overallRating) {
        newOverallRating = tenantRating;
      } else {
        newOverallRating = ((tenant.overallRating * tenant.numberReview) + tenantRating) / newNumberReview;
      }

      tenant.numberReview = newNumberReview;
      tenant.overallRating = newOverallRating;

      await tenant.save();

    res.status(201).json({ message: "Review created successfully", review: newReview });
  } catch (err) {
    console.error("Error creating review:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getTenantReviews = async (req, res) => {
    try {
        const { tenantId } = req.params;

        const reviews = await ReviewTenant.find({ tenantId });

        if (!reviews.length) {
            return res.status(404).json({ message: 'No reviews found for this tenant.' });
        }

        const tenant = await User.findOne({ _id: tenantId, role: 'tenant' });

        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        let averageRating = "N/A"; 

        if (tenant.numberReview !== 0 && tenant.overallRating !== null) {
            averageRating = tenant.overallRating;
        }

        res.status(200).json({
            totalReviews: tenant.numberReview,
            averageRating: averageRating,
            reviews
        });
    } catch (err) {
        console.error('Error fetching reviews:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
