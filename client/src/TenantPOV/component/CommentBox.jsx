import React from "react";
import "./commentbox.css";

const CommentBox = ({ username, date }) => {
  const profilePic = "Images/commentProfilePic.png";

  return (
    <div className="comment-card">
      <div className="row-one">
        <div className="left-content">
          <img className="user-img" alt="" src={profilePic} />
          <div className="user-info-container">
            <div className="username">{username}</div>
            <div className="date">{date}</div>
          </div>
        </div>
        <div className="comment-star">
          <img
            className="star"
            loading="lazy"
            alt=""
            src="/Images/commentStar.png"
          />
        </div>
      </div>

      <div className="row-2">
        Exceptional tenant! Always punctual with rent, maintained the property
        immaculately, and communicated effectively. Demonstrated respect for
        property rules and neighbors. I highly recommend this applicant for any
        future tenancy without reservation.
      </div>
    </div>
  );
};

export default CommentBox;