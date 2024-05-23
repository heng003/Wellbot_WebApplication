import Swal from "sweetalert2";
import contactIcon from "./Rental_Icon/contact.png";
import CardComment from "./CardComment";
import AverageRating from "../TenantPOV/component/AverageRating";
import "./landlordApplicantFeedback.css";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const LandlordApplicantFeedback = () => {

  const location = useLocation();
  const nav = useNavigate();
  const { username, leaseId, applicationId } = location.state || {};
  const [effectiveLeasesCount, setEffectiveLeasesCount] = useState(0);

  console.log('Received in LandlordApplicantFeedback:', { username, leaseId, applicationId });
  
  useEffect(() => {
    async function fetchLeases() {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error("No token found");
        }

        const response = await axios.get(`/api/leases/tenant/${username}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const effectiveLeases = response.data.filter(lease => lease.leaseStatus === 'Effective');
        setEffectiveLeasesCount(effectiveLeases.length);
      } catch (err) {
        console.error("Error fetching leases:", err);
        Swal.fire({
          text: "Error fetching leases. Please try again later.",
          icon: "error",
          confirmButtonColor: "#FF8C22",
        });
      }
    }
    fetchLeases();
  }, [username]);

  const handleSendLease = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    nav("/landlordLeaseAgreementForm");
  };

  const handleRejectApplicant = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => {
          Swal.fire({
              text: "Reject Successfully",
              icon: "success",
              confirmButtonColor: "#FF8C22",
          }).then((result) => {
              if (result.isConfirmed) {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  nav("/landlordApplicant");
              }
          });
      }, 100); // Delay to ensure the scroll completes before showing the dialog
  };


  return (
    <>
      <div className="rental-history applicantReviewDetails">
        <h1 className="EditTitle">Applicant's Review</h1>
        <div className="applicantInfoContainer">
          <div className="applicantInfoSection">
            <div className="profileSection">
              <div className="pictureLeft_Section">
                <img
                  src="Images/Edit_Property_TenantProfile.png"
                  alt="Logo"
                  width="100"
                  height="100"
                />
              </div>

              <div className="accountRight_Section">
                <h5 className="usernameText">{username}</h5>
                <p className="accountDetail" id="accDetails">
                  Current Rent Properties: {effectiveLeasesCount}
                </p>
              </div>
            </div>

            <div className="applicantContactSection">
              <div className="contactTop_Section">
                <img
                  src={contactIcon}
                  alt="Contact Icon"
                  height={55}
                  width={55}
                  className="contactIcon"
                />
                <p className="contactText">
                  Contact me <span className="contactLink">HERE</span>
                </p>
              </div>

              <div className="contactBottom_Section">
                <div className="avgRatingGroup">
                  <AverageRating numOfReview="3" avg="4.0" />
                </div>
              </div>
            </div>
          </div>

          <div className="landlordAction_Section">
            <button id="rejectApplicant" onClick={handleRejectApplicant}>
              Reject
            </button>
            <button id="sendLeaseAgreement" onClick={handleSendLease}>
              Send Lease Agreement
            </button>
          </div>
        </div>
        <h2 className="applicantCommentTitle">3 Comments</h2>
        <div id="lineWrapper">
          <hr></hr>
        </div>
        <div className="applicantCommentContainer">
          <CardComment
            userImgSrc="Images/commentProfilePic.png"
            username="Joyce Lim"
            date="2 days ago"
            comment="Exceptional tenant! Always punctual with rent, maintained the property immaculately, and communicated effectively. Demonstrated respect for property rules and neighbors. I highly recommend this applicant for any future tenancy without reservation."
          />
          <CardComment
            userImgSrc="Images/commentProfilePic.png"
            username="JASON Tan"
            date="3 MARCH 2024"
            comment="Reliable rent payer and generally maintained the property well. Had a few instances requiring reminders about property rules and noise levels. With improved communication, would be a good tenant."
          />
          <CardComment
            userImgSrc="Images/commentProfilePic.png"
            username="Muhammad Hakim bin ali Joyce Lim"
            date="1 JANUARY 2024"
            comment="The tenant was mostly timely with rent payments, with a couple of late instances quickly rectified after follow-up. Property condition was satisfactory upon move-out. Open to discussion for resolving minor issues during tenancy."
          />
        </div>
      </div>
    </>
  );
};

export default LandlordApplicantFeedback;
