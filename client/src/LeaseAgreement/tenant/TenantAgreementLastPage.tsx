import { lessorSignatureUrl } from "@/component/AgreementComponents/agreement-signals";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import { TermEighteen, TermSeventeen } from "LeaseAgreement/AgreementText";

const TenantAgreementLastPage = () => {
  const localStorageLessorSignUrl = JSON.parse(
    localStorage.getItem("lessorSignatureUrl") || ""
  );
  const localStorageLesseeSignUrl = JSON.parse(
    localStorage.getItem("lesseeSignatureUrl") || ""
  );
  console.log(localStorageLesseeSignUrl);
  const localStorageLessorValue = JSON.parse(
    localStorage.getItem("lessorFormValues") || ""
  );
  const localStorageLesseeValue = JSON.parse(
    localStorage.getItem("lesseeFormValues") || ""
  );

  return (
    <>
      <AgreementWrapper
        title="Lease Agreement"
        dialogCloseText="OK"
        dialogDescription="You have agreed and submitted the lease agreement to the landlord."
        dialogTitle="Submitted Successfully"
        dialogTriggerText="Save and Submit"
      >
        <AgreementTerm number="17" title="no partnership">
          {TermSeventeen()}
        </AgreementTerm>
        <AgreementTerm number="18" title="SUCCESSORS BOUND ">
          {TermEighteen(
            localStorageLessorSignUrl,
            localStorageLessorValue.lessorDesignation,
            localStorageLessorValue.lessorIc,
            localStorageLesseeSignUrl,
            localStorageLesseeValue.lesseeDesignation,
            localStorageLesseeValue.lesseeIc
          )}
        </AgreementTerm>
      </AgreementWrapper>
    </>
  );
};

export default TenantAgreementLastPage;
