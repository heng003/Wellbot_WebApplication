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
import ViewProperty from './GeneralPage/ViewProperty';
import LandlordHome from './LandlordPOV/LandlordHome';
import LandlordNavbar from './LandlordPOV/LandlordNavbar';
import TenantNavbar from './TenantPOV/TenantNavbar';
import TenantHome from './TenantPOV/TenantHome';
import EditLandlordProfile from './LandlordPOV/EditLandlordProfile';
import EditTenantProfile from './TenantPOV/EditTenantProfile';
import TenantViewProperty from './TenantPOV/TenantViewProperty';
import TenantApplyForm from './TenantPOV/TenantApplyForm';
import TenantApplication from './TenantPOV/TenantApplication';
import LandlordHistory from './LandlordPOV/LandlordHistory';
import LandlordComment from './LandlordPOV/LandlordComment';
import TenantComment from './TenantPOV/TenantComment';
import RentTenant from './TenantPOV/RentTenant';
import TenantViewPropertyPending from './TenantPOV/ViewPropertyPending';
import TenantViewPropertyRejected from './TenantPOV/ViewPropertyRejected';
import TenantViewPropertyLease from './TenantPOV/ViewPropertyLease';
import LandlordViewProperty from './LandlordPOV/LandlordViewProperty';
import LandlordUpdateProperty from './LandlordPOV/UpdateProperty';
import LandlordUploadProperty from './LandlordPOV/UploadProperty';
import LandlordUploadPropertyPhoto from './LandlordPOV/UploadPropertyPhoto';
import LandlordArrangePhoto from './LandlordPOV/ArrangePhoto';
import LandlordEditPhoto from './LandlordPOV/EditPhoto';
import LandlordApplicant from './LandlordPOV/LandlordApplicant';
import LandlordApplicantFeedback from './LandlordPOV/LandlordApplicantFeedback';
import AgreementFullView from "./LeaseAgreement/AgreementFullView";
import AgreementFull from "./LeaseAgreement/AgreementFull";
import TenantAgreementFormPage from "./LeaseAgreement/tenant/TenantAgreementFormPage";
import TenantAgreementPage1 from "./LeaseAgreement/landlord/LandlordAgreementPage1";
import TenantAgreementPage2 from "./LeaseAgreement/tenant/TenantAgreementPage2";
import TenantAgreementPage3 from "./LeaseAgreement/tenant/TenantAgreementPage3";
import LandlordAgreementFormPage from "./LeaseAgreement/landlord/LandlordAgreementFormPage";
import LandlordAgreementPage1 from "./LeaseAgreement/tenant/TenantAgreementPage1";
import LandlordAgreementPage2 from "./LeaseAgreement/landlord/LandlordAgreementPage2";
import LandlordAgrementPage3 from "./LeaseAgreement/landlord/LandlordAgreementPage3"

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
          <Route path="/registerLandlordAcc"element={<RegisterLandlordAcc />}/>
          <Route path="/registerTenantAcc" element={<RegisterTenantAcc />} />
          <Route path="/logIn" element={<LogIn />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path='/ViewProperty' element={<ViewProperty/>}/>
          <Route path="/landlordHome" element={<LandlordHome />} />
          <Route path="/tenantHome" element={<TenantHome />} />
          <Route path="/landlordProfileEdit" element={<EditLandlordProfile />}/>
          <Route path="/tenantProfileEdit" element={<EditTenantProfile />} />
          <Route path="/tenantViewProperty" element={<TenantViewProperty />} />
          <Route path="/tenantApplyForm" element={<TenantApplyForm />} />
          <Route path="/tenantApplication" element={<TenantApplication />} />
          <Route path="/landlordHistory" element={<LandlordHistory />} />
          <Route path="/landlordComment" element={<LandlordComment />} />
          <Route path="/tenantComment" element={<TenantComment />} />
          <Route path="/tenantRent" element={<RentTenant />} />
          <Route path="/tenantViewPropertyPending" element={<TenantViewPropertyPending />}/>
          <Route path="/tenantViewPropertyRejected" element={<TenantViewPropertyRejected />}/>
          <Route path="/tenantViewPropertyLease" element={<TenantViewPropertyLease />}/>
          <Route path="/landlordViewProperty" element={<LandlordViewProperty />}/>
          <Route path="/landlordUpdateProperty" element={<LandlordUpdateProperty />}/>
          <Route path="/landlordUploadProperty" element={<LandlordUploadProperty />}/>
          <Route path="/landlordUploadPropertyPhoto" element={<LandlordUploadPropertyPhoto />}/>
          <Route path="/landlordArrangePhoto" element={<LandlordArrangePhoto />}/>
          <Route path="/landlordEditPhoto" element={<LandlordEditPhoto />} />
          <Route path="/landlordApplicant" element={<LandlordApplicant />} />
          <Route path="/landlordApplicantFeedback" element={<LandlordApplicantFeedback/>}/>
          <Route path="/landlordLeaseAgreementForm" element={<LandlordAgreementFormPage />}/>
          <Route path="/landlordLeaseAgreementPg1" element={<LandlordAgreementPage1 />}/>
          <Route path="/landlordLeaseAgreementPg2" element={<LandlordAgreementPage2 />}
          />
          <Route
            path="/landlordLeaseAgreementPg3"
            element={<LandlordAgrementPage3 />}
          />
          <Route
            path="/tenantLeaseAgreementForm"
            element={<TenantAgreementFormPage />}
          />
          <Route
            path="/tenantLeaseAgreementPg1"
            element={<TenantAgreementPage1 />}
          />
          <Route
            path="/tenantLeaseAgreementPg2"
            element={<TenantAgreementPage2 />}
          />
          <Route path="/tenantLeaseAgreementPg3" element={<TenantAgreementPage3 />}/>
          <Route path="/viewAgreement" element={<AgreementFullView />} />
          <Route path="/fullAgreement" element={<AgreementFull />} />
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

  const isLandlordPage = location.pathname.startsWith('/landlord');
  const isTenantPage = location.pathname.startsWith('/tenant');

  if (isLandlordPage) {
    return <LandlordNavbar />;
  } else if (isTenantPage) {
    return <TenantNavbar />;
  } else {
    return <Navbar />;
  }
}

export default App;
