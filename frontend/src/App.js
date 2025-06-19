import "./App.css";
import {
	BrowserRouter as Router,
	Route,
	Routes,
	useLocation,
} from "react-router-dom";
import NavBarGeneral from "./layout/NavBarGeneral";
import NavBarGuardian from "./layout/NavBarGuardian";
import NavBarUser from "./layout/NavBarUser";
import Footer from "./layout/Footer.jsx";
import LandingPage from "./pages/auth/LandingPage";
import RegisterRolePage from "./pages/auth/RegisterRolePage";
import RegisterUserPage from "./pages/auth/RegisterUserPage";
import RegisterGuardianPage from "./pages/auth/RegisterGuardianPage";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import MonitoredUserPage from "./pages/guardian/MonitoredUserPage";
import AccessManagePage from "./pages/user/AccessManagePage";
import UserProfilePage from "./pages/user/UserProfilePage";
import GuardianProfilePage from "./pages/guardian/GuardianProfilePage.jsx";
import DashboardPage from "./pages/user/DashboardPage.jsx";
import ShowNavbar from "./ShowNavbarFooter/ShowNavbar";
import ShowFooter from "./ShowNavbarFooter/ShowFooter";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
// import FitbitCallback from "./RegisterAcc/FitbitCallback";

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
					<Route path="/user/accessManage" element={<AccessManagePage />} />
					<Route path="/user/profile" element={<UserProfilePage />} />
					<Route path="/guardian/profile" element={<GuardianProfilePage />} />
					<Route path="/user/dashboard" element={<DashboardPage />} />
					<Route path="/resetPassword/:id/:token/:role" element={<ResetPasswordPage />} />
					{/* <Route path="/callback" element={<FitbitCallback />} /> */}
				</Routes>
				<ShowFooter>
					<Footer />
				</ShowFooter>
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
