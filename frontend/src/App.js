import "./App.css";
import {
	Route,
	Routes,
	useLocation,
} from "react-router-dom";
import { useShowSidebar } from "./hooks/useShowSidebar";
// Layouts
import NavBarGeneral from "./layout/NavBarGeneral";
import Sidebar from "./layout/sb";
import Footer from "./layout/Footer.jsx";
// General Pages
import LandingPage from "./pages/auth/LandingPage";
import RegisterRolePage from "./pages/auth/RegisterRolePage";
import RegisterUserPage from "./pages/auth/RegisterUserPage";
import RegisterGuardianPage from "./pages/auth/RegisterGuardianPage";
import ResetPasswordPage from "./pages/auth/ResetPasswordPage.jsx";
import LoginPage from "./pages/auth/LoginPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
// User Pages
import AccessManagePage from "./pages/user/AccessManagePage";
import UserProfilePage from "./pages/user/UserProfilePage";
import DashboardPage from "./pages/user/DashboardPage.jsx";
import JournalPage from "./pages/user/JournalPage.jsx";
// Guardian Pages
import MonitoredUserPage from "./pages/guardian/MonitoredUserPage";
import GuardianProfilePage from "./pages/guardian/GuardianProfilePage.jsx";
// import FitbitCallback from "./RegisterAcc/FitbitCallback";

function App() {

	const showSidebar = useShowSidebar();
	const location = useLocation();

	return (
		<>
			{showSidebar && <Sidebar />}
			<div className={showSidebar ? "app-with-sidebar" : ""}>
				<CustomNavbar location={location} />
				<Routes>
					<Route path="/" element={<LandingPage />} />
					<Route path="/registerRole" element={<RegisterRolePage />} />
					<Route path="/registerUser" element={<RegisterUserPage />} />
					<Route path="/registerGuardian" element={<RegisterGuardianPage />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/forgotPassword" element={<ForgotPasswordPage />} />
					<Route path="/user/accessManage" element={<AccessManagePage />} />
					<Route path="/user/profile" element={<UserProfilePage />} />
					<Route path="/user/dashboard" element={<DashboardPage />} />
					<Route path="/user/activities/journal" element={<JournalPage />} />
					<Route path="/guardian/monitoredUser" element={<MonitoredUserPage />} />
					<Route path="/guardian/profile" element={<GuardianProfilePage />} />
					<Route path="/resetPassword/:id/:token/:role" element={<ResetPasswordPage />} />
					{/* <Route path="/callback" element={<FitbitCallback />} /> */}
				</Routes>
			</div>
			<CustomFooter location={location} />
		</>
	);
}

function CustomNavbar({ location }) {
	if (location.pathname === "/") return null;

	if (
		location.pathname.startsWith("/guardian") ||
		location.pathname.startsWith("/user")
	) {
		return null;
	}

	return <NavBarGeneral />;
}

function CustomFooter({ location }) {
	const showFooter =
		location.pathname.includes("login") ||
		location.pathname.includes("register");

	return showFooter ? <Footer /> : null;
}

export default App;
