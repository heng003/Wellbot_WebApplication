import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

function App() {
  return (
    <>
      <Router>
          <ShowNavbar>
            <Navbar /> 
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
          </Routes>
          <ShowFooter>
            <Footer /> 
          </ShowFooter>
      </Router>
    </>
  );
}

export default App;
