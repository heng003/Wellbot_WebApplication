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

const TenantAgreementPage3 = () => {
  const localStorageLessorSignUrl = parseLocalStorage("lessorSignatureUrl");
  const localStorageLessorValue = parseLocalStorage("lessorFormValues");

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
            localStorageLessorSignUrl,
            localStorageLessorValue?.lessorDesignation,
            localStorageLessorValue?.lessorIc
          )}
        </AgreementTerm>
      </AgreementWrapper>
    </>
  );
};

export default TenantAgreementPage3;