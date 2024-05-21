const CommentByLandlord = require('../models/commentByLandlordModel');

async function getTenantOverallRating(tenantId) {
    const result = await CommentByLandlord.aggregate([
        { $match: { tenantId: mongoose.Types.ObjectId(tenantId) } },
        {
            $group: {
                _id: '$tenantId',
                totalRating: { $sum: '$tenantRating' },
                commentNumber: { $sum: 1 }
            }
        },
        {
            $project: {
                _id: 0,
                tenantId: '$_id',
                overallRating: { $cond: { if: { $eq: ['$commentNumber', 0] }, then: 0, else: { $divide: ['$totalRating', '$commentNumber'] } } },
                commentNumber: 1
            }
        }
    ]);

    if (result.length === 0) {
        return { tenantId, overallRating: 0, commentNumber: 0 };
    }

    return result[0];
}
