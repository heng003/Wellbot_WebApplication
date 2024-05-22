import { lessorSignatureUrl } from "@/component/AgreementComponents/agreement-signals";
import axios from "axios";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import { TermEighteen, TermSeventeen } from "LeaseAgreement/AgreementText";

const TenantAgreementLastPage = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/leaseAgreement/getLeaseAgreement"
  );
  const data = response.data;

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
            data.lessorSignature,
            data.lessorDesignation,
            data.lessorIc,
            data.lesseeSignature,
            data.lesseeDesignation,
            data.lesseeIc
          )}
        </AgreementTerm>
      </AgreementWrapper>
    </>
  );
};

export default TenantAgreementLastPage;
