import { AgreementTerm } from "../component/AgreementComponents/agreeement-term";
import { AgreementWrapper } from "../component/AgreementComponents/agreement-wrapper";
import { TermEighteen, TermSeventeen } from "./AgreementText";

const AgreementPage3 = () => {
  return (
    <>
      <AgreementWrapper
        title="Lease Agreement"
        nextButtonText="Save And Submit"
        nextButtonHref="/"
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
