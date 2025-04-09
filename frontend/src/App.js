import "./App.css";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import SignIn from "./RegisterAcc/SignIn";
import ShowNavbar from "./ShowNavbarFooter/ShowNavbar";
import ShowFooter from "./ShowNavbarFooter/ShowFooter";
import RegisterLandlordAcc from "./RegisterAcc/RegisterLandlordAcc";
import RegisterTenantAcc from "./RegisterAcc/RegisterTenantAcc";
import LogIn from "./LogIn/LogIn";
import ForgotPassword from "./LogIn/ForgotPassword";
import ResetPassword from "./LogIn/ResetPassword";

function App() {
  return (
    <>
      <Router>
        {/* <ShowNavbar>
          <CustomNavbar />
        </ShowNavbar> */}
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signIn" element={<SignIn />} />
          <Route path="/registerLandlordAcc" element={<RegisterLandlordAcc role="landlord"/>}/>
          <Route path="/registerTenantAcc" element={<RegisterTenantAcc role="tenant"/>} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword/:id/:token" element={<ResetPassword />} />
        </Routes>
        {/* <ShowFooter>
          <Footer />
        </ShowFooter> */}
      </Router>
    </>
  );
}

// function CustomNavbar() {
//   const location = useLocation();

//   const isLandlordPage = location.pathname.startsWith("/landlord");
//   const isTenantPage = location.pathname.startsWith("/tenant");
//   const isFullAgreementPage = location.pathname.startsWith("/fullAgreement");

//   if (isLandlordPage) {
//     return <LandlordNavbar />;
//   } else if (isTenantPage) {
//     return <TenantNavbar />;
//   } else if (isFullAgreementPage) {
//     return <></>;
//   } else {
//     return <Navbar />;
//   }
// }

export default App;
