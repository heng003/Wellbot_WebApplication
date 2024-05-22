import { Button } from "components/ui/button";
import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import {
  LeaseIntro,
  PropertyInfo,
  TermOne,
  TermTwo,
  TermThree,
  TermFour,
  TermFive,
  TermSix,
  TermSeven,
  TermSevenA,
  TermEight,
  TermNine,
  TermTen,
  TermEleven,
  TermTwelve,
  TermThirteen,
  TermFourteen,
  TermFifteen,
  TermSixteen,
  TermSeventeen,
  TermEighteen,
} from "./AgreementText";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AgreementFullView = async () => {
  const response = await axios.get(
    "http://localhost:5000/api/leaseAgreement/getLeaseAgreement"
  );
  const data = response.data;
  const navigate = useNavigate();

  return (
    <>
      <AgreementWrapper title="Lease Agreement">
        {LeaseIntro(
          data.day,
          data.month,
          data.year,
          data.lessorName,
          data.lessorIc,
          data.lesseeName,
          data.lesseIc
        )}
        {PropertyInfo(data.address)}
        <AgreementTerm number="1" title="term">
          {TermOne(data.effectiveDate, data.expireDate)}
        </AgreementTerm>
        <AgreementTerm number="2" title="rent">
          {TermTwo(data.rentRmWord, data.rentRmNum, data.advanceDay)}
        </AgreementTerm>
        <AgreementTerm number="3" title="deposit">
          {TermThree(data.depositRmWord, data.depositRmNum)}
        </AgreementTerm>
        <AgreementTerm number="4" title="COVENANTS BY THE LESSEE">
          {TermFour()}
        </AgreementTerm>
        <AgreementTerm number="5" title="ASSIGNMENT AND SUB-LETTING">
          {TermFive()}
        </AgreementTerm>
        <AgreementTerm
          number="6"
          title="COVENANTS BY THE LESSOR The Lessor covenants and undertakes with the Lessee that: "
        >
          {TermSix()}
        </AgreementTerm>
        <AgreementTerm number="7" title="termination">
          {TermSeven()}
        </AgreementTerm>
        <AgreementTerm number="7A" title="CONSEQUENCES OF TERMINATION ">
          {TermSevenA()}
        </AgreementTerm>
        <AgreementTerm number="8" title="waiver">
          {TermEight()}
        </AgreementTerm>
        <AgreementTerm number="9" title="entire agreement">
          {TermNine()}
        </AgreementTerm>
        <AgreementTerm number="10" title="severability">
          {TermTen()}
        </AgreementTerm>
        <AgreementTerm number="11" title="law">
          {TermEleven()}
        </AgreementTerm>
        <AgreementTerm number="12" title="notice">
          {TermTwelve(
            data.lessorAdd,
            data.lessorTel,
            data.lessorFax,
            data.lesseeAdd,
            data.lesseeTel,
            data.lesseeFax
          )}
        </AgreementTerm>
        <AgreementTerm number="13" title="modification">
          {TermThirteen()}
        </AgreementTerm>
        <AgreementTerm number="14" title="costs">
          {TermFourteen()}
        </AgreementTerm>
        <AgreementTerm number="15" title="time">
          {TermFifteen()}
        </AgreementTerm>
        <AgreementTerm number="16" title="survival of clauses">
          {TermSixteen()}
        </AgreementTerm>
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
      <div className="flex justify-end">
        <Button
          onClick={() => {
            navigate("/fullAgreement");
          }}
          className="my-4 px-4 py-2 font-semibold rounded-lg text-white bg-dark-orange hover:shadow-standardisedHoverShadow hover:opacity-70"
        >
          Download as PDF
        </Button>
      </div>
    </>
  );
};

export default AgreementFullView;
