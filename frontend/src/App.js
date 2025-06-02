import "./App.css";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from "react-router-dom";
import SignIn from "./RegisterAcc/SignIn";
import NavBarGeneral from "./layout/NavBarGeneral";
import LandingPage from "./pages/auth/LandingPage";
import RegisterRolePage from "./pages/auth/RegisterRolePage";
import RegisterUserPage from "./pages/auth/RegisterUserPage";
import RegisterAdminPage from "./pages/auth/RegisterAdminPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import ShowNavbar from "./ShowNavbarFooter/ShowNavbar";
import ShowFooter from "./ShowNavbarFooter/ShowFooter";
import RegisterLandlordAcc from "./RegisterAcc/RegisterLandlordAcc";
import RegisterTenantAcc from "./RegisterAcc/RegisterTenantAcc";
import LogIn from "./LogIn/LogIn";
import ForgotPassword from "./LogIn/ForgotPassword";
import ResetPassword from "./LogIn/ResetPassword";
import FitbitCallback from "./RegisterAcc/FitbitCallback";
import Dashboard from "./RegisterAcc/Dashboard";

function App() {
	return (
		<>
			<Router>
				{/* <ShowNavbar>
          <CustomNavbar />
        </ShowNavbar> */}
				<NavBarGeneral />
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/registerRole" element={<RegisterRolePage />} />
					<Route path="/registerUser" element={<RegisterUserPage />} />
					<Route path="/registerAdmin" element={<RegisterAdminPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/forgotPassword" element={<ForgotPasswordPage />} />
					<Route path="/signIn" element={<SignIn />} />
					<Route path="/registerLandlordAcc" element={<RegisterLandlordAcc role="landlord" />} />
					<Route path="/registerTenantAcc" element={<RegisterTenantAcc role="tenant" />} />
					<Route path="/logIn" element={<LogIn />} />
					{/* <Route path="/forgotPassword" element={<ForgotPassword />} /> */}
					<Route path="/resetPassword/:id/:token" element={<ResetPassword />} />
					<Route path="/callback" element={<FitbitCallback />} />
					<Route path="/dashboard" element={<Dashboard />} />
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
