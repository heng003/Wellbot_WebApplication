const jwt = require('jsonwebtoken');
const ReviewLandlord = require('../models/reviewLandlordModel');
const User = require('../models/userModel')

exports.createReview = async (req, res) => {
    try {
      const { tenantId, landlordId, landlordRating, commentLandlord } = req.body;
  
      console.log('tenantId:', tenantId);
      console.log('landlordId:', landlordId);
      console.log('landlordRating:', landlordRating);
      console.log('commentLandlord:', commentLandlord);
  
      if (!tenantId || !landlordId || landlordRating === undefined || !commentLandlord) {
        return res.status(400).json({ message: "All fields are required" });
      }
  
      const newReview = new ReviewLandlord({
        tenantId,
        landlordId,
        landlordRating,
        commentLandlord
      });
  
      await newReview.save();
  
      const landlord = await User.findOne({ _id: landlordId, role: 'landlord' });
  
      if (!landlord) {
        return res.status(404).json({ message: 'Landlord not found' });
      }
  
      const newNumberReview = landlord.numberReview + 1;
  
      let newOverallRating;
      if (!landlord.overallRating) {
        newOverallRating = landlordRating;
      } else {
        newOverallRating = ((landlord.overallRating * landlord.numberReview) + landlordRating) / newNumberReview;
      }
  
      landlord.numberReview = newNumberReview;
      landlord.overallRating = newOverallRating;
  
      await landlord.save();
  
      res.status(201).json({ message: "Review created successfully", review: newReview });
    } catch (err) {
      console.error("Error creating review:", err);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  exports.getLandlordReviews = async (req, res) => {
    try {
      const { landlordId } = req.params;
  
      const reviews = await ReviewLandlord.find({ landlordId });
  
      if (!reviews.length) {
        return res.status(404).json({ message: 'No reviews found for this landlord.' });
      }
  
      const landlord = await User.findOne({ _id: landlordId, role: 'landlord' });
  
      if (!landlord) {
        return res.status(404).json({ message: 'Landlord not found' });
      }
  
      let averageRating = "N/A";
  
      if (landlord.numberReview !== 0 && landlord.overallRating !== null) {
        averageRating = landlord.overallRating;
      }
  
      res.status(200).json({
        totalReviews: landlord.numberReview,
        averageRating: averageRating,
        reviews
      });
    } catch (err) {
      console.error('Error fetching reviews:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  };