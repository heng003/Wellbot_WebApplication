import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import { TermEighteen, TermSeventeen } from "LeaseAgreement/AgreementText";

const AgreementPage3 = () => {
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
          {TermEighteen()}
        </AgreementTerm>
      </AgreementWrapper>
    </>
  );
};

export default AgreementPage3;
