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
import RegisterGuardianPage from "./pages/auth/RegisterGuardianPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import MonitoredUserPage from "./pages/guardian/MonitoredUserPage";
import TrackingManagePage from "./pages/user/TrackingManagePage";
import ShowNavbar from "./ShowNavbarFooter/ShowNavbar";
import ShowFooter from "./ShowNavbarFooter/ShowFooter";
import RegisterLandlordAcc from "./RegisterAcc/RegisterLandlordAcc";
import RegisterTenantAcc from "./RegisterAcc/RegisterTenantAcc";
import LogIn from "./LogIn/LogIn";
import ForgotPassword from "./LogIn/ForgotPassword";
import ResetPassword from "./LogIn/ResetPassword";
import FitbitCallback from "./RegisterAcc/FitbitCallback";
import Dashboard from "./RegisterAcc/Dashboard";
import NavBarGuardian from "./layout/NavBarGuardian";
import NavBarUser from "./layout/NavBarUser";

function App() {
	return (
		<>
			<Router>
				<CustomNavbar />
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/registerRole" element={<RegisterRolePage />} />
					<Route path="/registerUser" element={<RegisterUserPage />} />
					<Route path="/registerGuardian" element={<RegisterGuardianPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/forgotPassword" element={<ForgotPasswordPage />} />
					<Route path="/guardian/monitoredUser" element={<MonitoredUserPage />} />
					<Route path="/user/trackingManage" element={<TrackingManagePage />} />
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

// helper function to determine navbar to render
function CustomNavbar() {
	const location = useLocation();

	const isGuardianPage = location.pathname.startsWith("/guardian");
	const isUserPage = location.pathname.startsWith("/user");

	if (isGuardianPage) {
		return <NavBarGuardian />;
	} else if (isUserPage) {
		return <NavBarUser />;
	} else {
		return <NavBarGeneral />;
	}
}

export default App;
