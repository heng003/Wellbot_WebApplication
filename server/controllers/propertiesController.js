const User = require('../models/userModel');

exports.getProperties = async (req, res) => {
  console.log("Request User ID:", req.userId); 

  try {
    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      console.log("User not found for ID:", userId); 
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.properties);
  } catch (error) {
    console.error('Server error:', error); 
    res.status(500).json({ message: 'Server error' });
  }
};