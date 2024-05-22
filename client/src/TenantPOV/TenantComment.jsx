import React, { useState, useLocation, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../LandlordPOV/editlandlordprofile.css";
import "../LandlordPOV/landlord_history.css";
import Swal from "sweetalert2";
import starDefault from "../LandlordPOV/Rental_Icon/rating_star_default.svg";
import starOnClick from "../LandlordPOV/Rental_Icon/rating_star_onClick.svg";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const TenantComment = () => {
  const location = useLocation();
  const { landlordUsername } = location.state || {};
  const navigate = useNavigate();
  const [ratings, setRatings] = useState(Array(5).fill(false));
  const [uploadedPropertiesCount, setUploadedPropertiesCount] = useState(0);
  const [landlordId, setLandlordId] = useState(null);
  const [tenantId, setTenantId] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
      async function fetchPropertyData() {
          try {
              const token = localStorage.getItem('token');
              if (!token) throw new Error("No token found");

              const decodedToken = jwtDecode(token);
              setTenantId(decodedToken.userId);

              const landlordId = location.state?.landlordId;
              if (!landlordId) throw new Error("No landlord ID found");

              setLandlordId(landlordId);

              const propertyCountResponse = await axios.get(`/api/properties/landlord/${landlordId}/propertyCount`, {
                  headers: { Authorization: `Bearer ${token}` }
              });
              setUploadedPropertiesCount(propertyCountResponse.data.propertyCount);
          } catch (err) {
              console.error("Error fetching property data:", err);
              Swal.fire({
                  text: "Error fetching data. Please try again later.",
                  icon: "error",
                  confirmButtonColor: "#FF8C22",
              });
          }
      }
      fetchPropertyData();
  }, [location.state]);

  const handleStarClick = (index) => {
      const newRatings = new Array(ratings.length).fill(false);
      const fillUpTo = ratings[index] && !ratings.some((active, idx) => active && idx > index) ? index : index + 1;
      for (let i = 0; i < fillUpTo; i++) {
          newRatings[i] = true;
      }
      setRatings(newRatings);
  };

  const handleSaveAndSubmit = async () => {
      const token = localStorage.getItem('token');
      const tenantRating = ratings.filter(Boolean).length;

      if (!tenantId || !landlordId || tenantRating === undefined || !comment) {
          console.error("Missing required fields");
          return;
      }

      try {
          await axios.post('/api/reviewsLandlord/landlord', {
              tenantId,
              landlordId,
              landlordRating: tenantRating,
              commentLandlord: comment,
          }, {
              headers: { Authorization: `Bearer ${token}` }
          });

          Swal.fire({
              text: "Saved and Submitted!",
              icon: "success",
              confirmButtonColor: "#FF8C22",
          }).then((result) => {
              if (result.isConfirmed) {
                  navigate("/tenantRent");
              }
          });
      } catch (error) {
          console.error("Error saving review:", error);
      }
  };

  return (
      <div className="rental-history">
          <h1 className="rentalTitle">Rate & Comment Your Landlord</h1>
          <div className="profileSection">
              <div className="pictureLeft_Section">
                  <img src="Images/Edit_landlord_progile.png" alt="Logo" width="100" height="100" />
              </div>
              <div className="accountRight_Section">
                  <h5 className="usernameText">{landlordUsername}</h5>
                  <p className="accountDetail" id="accDetails">
                      Uploaded Properties: {uploadedPropertiesCount}
                  </p>
              </div>
          </div>
          <div className="commentForm">
              <h5 className="commenth5">
                  Your review is helpful to other tenants. Feel free to share your feedback with them based on below aspects.
              </h5>
              <div className="Rate">
                  <h3>Rate Your Overall Experience</h3>
                  <div className="starAlone">
                      {ratings.map((isActive, index) => (
                          <img
                              key={index}
                              className="RatingStar_row"
                              src={isActive ? starOnClick : starDefault}
                              alt="Rating Star"
                              width="85"
                              height="85"
                              onClick={() => handleStarClick(index)}
                          />
                      ))}
                  </div>
              </div>
              <div className="comment">
                  <div className="line"></div>
                  <h3>Additional Comment</h3>
                  <div className="additional-form">
                      <textarea
                          name="additionalComment"
                          id="additionalComment"
                          rows="5"
                          placeholder="Rate your experience with rent collection, property upkeep, landlord communication, lease compliance, and neighbor relations management."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          required
                      ></textarea>
                  </div>
              </div>
              <div className="mainCentreButton">
                  <button id="submitEdirProfileInfoBtn" onClick={handleSaveAndSubmit} type="submit">
                      Save & Submit
                  </button>
              </div>
          </div>
      </div>
  );
};


export default TenantComment;