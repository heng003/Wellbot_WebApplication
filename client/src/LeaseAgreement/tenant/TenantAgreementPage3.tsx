import axios from "axios";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import { TermEighteen, TermSeventeen } from "LeaseAgreement/AgreementText";

const parseLocalStorage = (key: string): any => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error(`Error parsing ${key} from localStorage:`, err);
    return null;
  }
};

const TenantAgreementPage3 = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/leaseAgreement/getLeaseAgreement"
  );
  const data = response.data;

  return (
    <>
      <AgreementWrapper
        title="Lease Agreement"
        nextButtonText="Sign Now"
        nextButtonHref="/tenantLeaseAgreementForm"
      >
        <AgreementTerm number="17" title="no partnership">
          {TermSeventeen()}
        </AgreementTerm>
        <AgreementTerm number="18" title="SUCCESSORS BOUND">
          {TermEighteen(
            data.lessorSignature,
            data.lessorDesignation,
            data.lessorIc
          )}
        </AgreementTerm>
      </AgreementWrapper>
    </>
  );
};

export default TenantAgreementPage3;
