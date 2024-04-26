import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ShowFooter = ({ children }) => {
  const location = useLocation();
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    console.log("this is location", location);
    if (
      location.pathname === "/signIn" ||
      location.pathname === "/registerLandlordAcc" ||
      location.pathname === "/registerTenantAcc" ||
      location.pathname === "/logIn" ||
      location.pathname === "/forgotPassword" ||
      location.pathname === "/verifyEmail" ||
      location.pathname === "/fullAgreement"
    ) {
      setShowFooter(false);
    } else {
      setShowFooter(true);
    }
  }, [location]);

  return <div>{showFooter && children}</div>;
};
export default ShowFooter;
