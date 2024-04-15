import React from "react";
import "./commentbox.css";

const CommentBox = ({username, date}) => {
  
    const profilePic = [
        "Images/commentProfilePic.png",
        "Images/propertyImg4.png",
        "Images/propertyImg2.png",
        "Images/propertyImg5.png"
    ];
    
  return (
    <div className="row-one">
      <div className="row-two">
        <div className="user-images">
          <img
            className="user-img"
            loading="lazy"
            alt=""
            src="/user-06c@2x.png"
          />
          <div className="user-names">
            <div className="joyce-lim-parent">
              <div className="joyce-lim" style={joyceLimStyle}>
                {joyceLim}
              </div>
              <div className="testimonial-dates">
                <div className="days-ago" style={daysAgoStyle}>
                  {daysAgo}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="testimonial-row-two-inner">
          <div className="choose-your-account-type-2-1-parent">
            <img
              className="choose-your-account-type-2-1"
              loading="lazy"
              alt=""
              src="/choose-your-account-type-2-1@2x.png"
            />
            <img
              className="choose-your-account-type-2-4"
              loading="lazy"
              alt=""
              src="/choose-your-account-type-2-1@2x.png"
            />
            <img
              className="choose-your-account-type-2-2"
              loading="lazy"
              alt=""
              src="/choose-your-account-type-2-1@2x.png"
            />
            <img
              className="choose-your-account-type-2-3"
              loading="lazy"
              alt=""
              src="/choose-your-account-type-2-1@2x.png"
            />
            <img
              className="choose-your-account-type-6-3"
              loading="lazy"
              alt=""
              src="/choose-your-account-type-6-3@2x.png"
            />
          </div>
        </div>
      </div>
      <div className="exceptional-tenant-always">
        Exceptional tenant! Always punctual with rent, maintained the property
        immaculately, and communicated effectively. Demonstrated respect for
        property rules and neighbors. I highly recommend this applicant for any
        future tenancy without reservation.
      </div>
    </div>
  )
}

export default CommentBox;