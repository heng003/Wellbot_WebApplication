import React from "react";
import "./tenantapplication.css";
import CardApplication from "./component/CardApplication";

const TenantApplication = () => {
  const [applicationList, setApplicationList] = useState([]);
  const [propertyActionListingInfo, setPropertyActionListingInfo] = useState(
    []
  );
  const [propertyOtherListingInfo, setPropertyOtherListingInfo] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;

      async function fetchApplication() {
        try {
          const response = await axios.get(
            `/api/applications/tenantApplication/${userId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          console.log("Applications fetched:", response.data); // Log the applications
          setApplicationList(response.data);
        } catch (err) {
          console.error("Error fetching applications data:", err);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Failed to load application data!",
            confirmButtonColor: "#FF8C22",
          });
        }
      }

      fetchApplication();
    } else {
      setLoading(false); // If there's no token, stop loading
    }
  }, []);

  useEffect(() => {
    async function fetchPropertyInfo() {
      try {
        const promises = applicationList.map(async (application) => {
          const response = await axios.get(
            `/api/applications/ViewProperty/${application.propertyId}`
          );
          console.log(
            "Property fetched for application:",
            application,
            response.data
          );
          return { property: response.data, application };
        });

        const propertyData = await Promise.all(promises);
        console.log("Property Data List:", propertyData);
        const actionListings = [];
        const otherListings = [];

        propertyData.forEach(({ property, application }) => {
          const listing = {
            propertyId: application.propertyId,
            title: property.name,
            locationOwner: `${property.location} | ${property.type}`,
            imageUrl: property.coverPhoto,
            isViewLease: application.applicationStatus === "Approved",
            isPending: application.applicationStatus === "Pending",
            isRejected: application.applicationStatus === "Rejected",
            bedroom: property.bedroom,
            bathroom: property.bathroom,
            sqft: `${property.buildUpSize} Sqft`,
            price: `RM ${property.price}`,
          };

          console.log("Card Data: ", property, application, listing);

          if (application.applicationStatus === "Approved") {
            actionListings.push(listing);
          } else {
            otherListings.push(listing);
          }
        });

        setPropertyActionListingInfo(actionListings);
        setPropertyOtherListingInfo(otherListings);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error("Error fetching property data:", err);
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Failed to load property data!",
          confirmButtonColor: "#FF8C22",
          customClass: {
            confirmButton: "my-confirm-button-class",
          },
        });
      }
    }

    if (applicationList.length > 0) {
      fetchPropertyInfo();
    } else {
      setLoading(false); // End loading if there are no applications
    }
  }, [applicationList]);

  return (
    <main>
      <div className="pageMainContainer">
        <h1 className="pageMainTitle">Application History</h1>
        {loading ? (
          <p className="applicationPromptTitle">Loading...</p>
        ) : (
          <>
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
            {propertyActionListingInfo.length === 0 &&
              propertyOtherListingInfo.length === 0 && (
                <p className="applicationPromptTitle">
                  You have not submitted any application yet! Grab one now!
                </p>
              )}
          </>
        )}
      </div>
    </main>
  );
};

export default TenantApplication;
