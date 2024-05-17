const CommentByLandlord = require('../models/commentByLandlordModel')

exports.createComment = async (req, res) => {
    const { tenantId, tenantRating, commentTenant, commentDate } = req.body;
    const landlordId = req.user._id;

    try {
        const newComment = new CommentByLandlord({
            tenantId,
            landlordId,
            tenantRating,
            commentTenant,
            commentDate
        });

        await newComment.save();
        res.status(201).json({ message: "Comment created successfully", commentId: newComment._id });
    } catch (error) {
        console.error("Failed to create comment:", error);
        res.status(500).json({ message: "Failed to create comment", error: error.message });
    }
};