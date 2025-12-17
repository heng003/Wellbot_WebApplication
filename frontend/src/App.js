import "./App.css";
import { useEffect } from "react";
import {
	Route,
	Routes,
	useLocation,
} from "react-router-dom";
import { useShowSidebar } from "./hooks/useShowSidebar";
// Layouts
import NavBarGeneral from "./layout/NavBarGeneral";
import Sidebar from "./layout/Sidebar.jsx";
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
import MainDashboardPage from "./pages/user/MainDashboardPage.jsx";
import EmotionDashboardPage from "./pages/user/EmotionDashboardPage.jsx";
import ActivityDashboardPage from "./pages/user/ActivityDashboardPage.jsx";
import ChatMapDashboardPage from "./pages/user/ChatMapDashboardPage.jsx";
import JournalPage from "./pages/user/JournalPage.jsx";
import GratitudePage from "./pages/user/GratitudePage.jsx";
import ReportPage from "./pages/user/ReportPage.jsx";
// Guardian Pages
import MonitoredUserPage from "./pages/guardian/MonitoredUserPage";
import GuardianProfilePage from "./pages/guardian/GuardianProfilePage.jsx";
import GuardianMainDashboardPage from "./pages/guardian/MainDashboardPage.jsx";
import GuardianEmotionDashboardPage from "./pages/guardian/EmotionDashboardPage.jsx";
import GuardianActivityDashboardPage from "./pages/guardian/ActivityDashboardPage.jsx";
import GuardianChatMapDashboardPage from "./pages/guardian/ChatMapDashboardPage.jsx";
import GuardianReportPage from "./pages/guardian/ReportPage.jsx";
// import FitbitCallback from "./RegisterAcc/FitbitCallback";

function App() {

	const showSidebar = useShowSidebar();
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location.pathname]);

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
					<Route path="/user/dashboard/main" element={<MainDashboardPage />} />
					<Route path="/user/dashboard/emotion" element={<EmotionDashboardPage />} />
					<Route path="/user/dashboard/activity" element={<ActivityDashboardPage />} />
					<Route path="/user/dashboard/chatMap" element={<ChatMapDashboardPage />} />
					<Route path="/user/activities/journal" element={<JournalPage />} />
					<Route path="/user/activities/gratitude" element={<GratitudePage />} />
					<Route path="/user/report" element={<ReportPage />} />
					<Route path="/guardian/monitoredUser" element={<MonitoredUserPage />} />
					<Route path="/guardian/dashboard/main" element={<GuardianMainDashboardPage />} />
					<Route path="/guardian/dashboard/emotion" element={<GuardianEmotionDashboardPage />} />
					<Route path="/guardian/dashboard/activity" element={<GuardianActivityDashboardPage />} />
					<Route path="/guardian/dashboard/chatMap" element={<GuardianChatMapDashboardPage />} />
					<Route path="/guardian/report" element={<GuardianReportPage />} />
					<Route path="/guardian/profile" element={<GuardianProfilePage />} />
					<Route path="/resetPassword/:id/:token/:role" element={<ResetPasswordPage />} />
					{/* <Route path="/callback" element={<FitbitCallback />} /> */}s
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
