import React from "react";
import "./averagerating.css";

const AverageRating = ({ numOfReview, avg }) => {
  
    const reviewNumbers = "(" + numOfReview + " Reviews)";
    const avgRatingScore = avg + "/5";

    return (
        <div className="avg-rating-group">
            <div className="col">
                <img className="avg-star-img" alt="" src="Images/commentStar.png" />
            </div>

            <div className="col">
                <span className="review-score">{avgRatingScore}</span>
            </div>

            <div className="col">
                <span className="review-number">{reviewNumbers}</span>
            </div>
        </div>
    );
};

export default AverageRating;