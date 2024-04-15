import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import Navbar from './GeneralPage/Navbar';
import Home from './GeneralPage/Home';
import Footer from './GeneralPage/Footer';
import Condo from './GeneralPage/Condo';
import Commercial from './GeneralPage/Commercial';
import SignIn from './RegisterAcc/SignIn';
import ShowNavbar from './ShowNavbarFooter/ShowNavbar';
import ShowFooter from './ShowNavbarFooter/ShowFooter';
import RegisterLandlordAcc from './RegisterAcc/RegisterLandlordAcc';
import RegisterTenantAcc from './RegisterAcc/RegisterTenantAcc';
import LogIn from './LogIn/LogIn';
import ForgotPassword from './LogIn/ForgotPassword';
import LandlordHome from './LandlordPOV/LandlordHome';
import LandlordNavbar from './LandlordPOV/LandlordNavbar';
import TenantNavbar from './TenantPOV/TenantNavbar';
import TenantHome from './TenantPOV/TenantHome';
import EditLandlordProfile from './LandlordPOV/EditLandlordProfile';
import EditTenantProfile from './TenantPOV/EditTenantProfile';
import TenantViewProperty from './TenantPOV/ViewProperty';

function App() {
  return (
    <>
      <Router>
          <ShowNavbar>
            <CustomNavbar />
          </ShowNavbar>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/rent" element={<Home />} /> 
            <Route path="/condo" element={<Condo />} />
            <Route path="/commercial" element={<Commercial />} />
            <Route path="/signIn" element={<SignIn />} />
            <Route path="/registerLandlordAcc" element={<RegisterLandlordAcc />} />
            <Route path="/registerTenantAcc" element={<RegisterTenantAcc />} />
            <Route path="/logIn" element={<LogIn />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />
            <Route path="/landlordHome" element={<LandlordHome />}/>
            <Route path="/tenantHome" element={<TenantHome />}/>
            <Route path="/landlordProfileEdit" element={<EditLandlordProfile />}/>
            <Route path="/tenantProfileEdit" element={<EditTenantProfile />}/>
            <Route path="/tenantViewProperty" element={< TenantViewProperty/>}/>
          </Routes>
          <ShowFooter>
            <Footer /> 
          </ShowFooter>
      </Router>
    </>
  );
}
function CustomNavbar() {
  const location = useLocation();

  // Check if the current location is related to landlord or tenant pages
  const isLandlordPage = location.pathname.startsWith('/landlord');
  const isTenantPage = location.pathname.startsWith('/tenant');

  // Render the appropriate navbar based on the route
  if (isLandlordPage) {
    return <LandlordNavbar />;
  } else if (isTenantPage) {
    return <TenantNavbar />;
  } else {
    return <Navbar />;
  }
}

export default App;
