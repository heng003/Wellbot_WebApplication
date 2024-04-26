import { lessorSignatureUrl } from "@/component/AgreementComponents/agreement-signals";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import { TermEighteen, TermSeventeen } from "LeaseAgreement/AgreementText";

// const localStorageLessorSignUrl = localStorage.getItem("lessorSignatureUrl");

const LandlordAgreementPage3 = () => {
  const localStorageLessorSignUrl = JSON.parse(
    localStorage.getItem("lessorSignatureUrl") || ""
  );
  console.log(localStorageLessorSignUrl);
  const localStorageLessorValue = JSON.parse(
    localStorage.getItem("lessorFormValues") || ""
  );

  const dialogLandlordText = `Your Lease Agreement had been submitted to the system and sent to your tenant, please be patient to wait for him/her to check and sign for this lease agreement, you might track your lease agreement status at ${(
    <a href="/landlordApplicant">applicant page</a>
  )}.`;

  return (
    <>
      <AgreementWrapper
        title="Lease Agreement"
        dialogCloseText="OK"
        dialogDescription={dialogLandlordText}
        dialogTitle="Submitted Successfully"
        dialogTriggerText="Save and Submit"
        landlordLastPage={true}
      >
        <AgreementTerm number="17" title="no partnership">
          {TermSeventeen()}
        </AgreementTerm>
        <AgreementTerm number="18" title="SUCCESSORS BOUND ">
          {TermEighteen(
            localStorageLessorSignUrl,
            localStorageLessorValue.lessorDesignation,
            localStorageLessorValue.lessorIc
          )}
        </AgreementTerm>
      </AgreementWrapper>
    </>
  );
};

export default LandlordAgreementPage3;
