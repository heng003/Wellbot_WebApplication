import React, { useState, useEffect } from "react";
import "./tenantapplication.css";
import CardApplication from "./component/CardApplication";
import { jwtDecode } from 'jwt-decode'; 
import axios from 'axios';
import Swal from "sweetalert2";

const TenantApplication = () => {
  const [applicationList, setApplicationList] = useState([]);
  const [propertyActionListingInfo, setPropertyActionListingInfo] = useState([]);
  const [propertyOtherListingInfo, setPropertyOtherListingInfo] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      async function fetchApplication() {
        try {
          const response = await axios.get(`/api/applications/tenantApplication/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setApplicationList(response.data);
        } catch (err) {
          console.error("Error fetching applications data:", err);
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Failed to load application data!',
            confirmButtonColor: "#FF8C22"
          });
        }
      }
      fetchApplication();
    }
  }, []);

  useEffect(() => {
    async function fetchPropertyInfo() {
      try {
        const promises = applicationList.map(async (application) => {
          const response = await axios.get(`/api/ViewProperty/${application.propertyId}`);
          return { property: response.data, application };
        });
        
        const propertyData = await Promise.all(promises);
        
        const actionListings = [];
        const otherListings = [];

        propertyData.forEach(({ property, application }) => {
          const listing = {
            title: property.name,
            locationOwner: `${property.location} | ${property.type} by ${property.owner}`,
            imageUrl: property.coverPhoto,
            isViewLease: application.status === "Approved",
            isPending: application.status === "Pending",
            isRejected: application.status === "Rejected",
            bedroom: property.bedroom,
            bathroom: property.bathroom,
            sqft: `${property.buildUpSize} Sqft`,
            price: `RM ${property.price}`
          };

          if (application.status === "Approved") {
            actionListings.push(listing);
          } else {
            otherListings.push(listing);
          }
        });

        setPropertyActionListingInfo(actionListings);
        setPropertyOtherListingInfo(otherListings);

      } catch (err) {
        console.error("Error fetching property data:", err);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to load property data!',
          confirmButtonColor: "#FF8C22",
          customClass: {
              confirmButton: 'my-confirm-button-class'
          }
        });
      }
    }

    if (applicationList.length > 0) {
      fetchPropertyInfo();
    }
  }, [applicationList]);

  return (
    <main>
      <div className="pageMainContainer">
        <h1 className="pageMainTitle">Application History</h1>
        {propertyActionListingInfo.length > 0 && (
          <>
            <h2 className="applicationSubTitle">Action Needed</h2>
            {propertyActionListingInfo.map((listing, index) => (
              <CardApplication key={index} listing={listing} />
            ))}
          </>
        )}
        {propertyOtherListingInfo.length > 0 && (
          <>
            <h2 className="applicationSubTitle">Other Application/s</h2>
            {propertyOtherListingInfo.map((listing, index) => (
              <CardApplication key={index} listing={listing} />
            ))}
          </>
        )}
        {propertyActionListingInfo.length === 0 && propertyOtherListingInfo.length === 0 && (
          <p className="applicationPromptTitle">You have not submitted any application yet! Grab one now!</p>
        )}
      </div>
    </main>
  );
};

export default TenantApplication;