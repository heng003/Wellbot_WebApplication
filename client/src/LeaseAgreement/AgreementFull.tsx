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
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTimeout } from "usehooks-ts";

const AgreementFull = () => {
  const pdfExportComponent = useRef<PDFExport | null>(null);
  const exportPDFWithMethod = () => {
    let element = document.body;
    savePDF(element, {
      paperSize: "A4",
    });
  };
  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };
  const localStorageLessorFormValues = JSON.parse(
    localStorage.getItem("lessorFormValues") || ""
  );
  const localStorageLessorSignUrl = JSON.parse(
    localStorage.getItem("lessorSignatureUrl") || ""
  );

  const localStorageLesseeFormValues = JSON.parse(
    localStorage.getItem("lesseeFormValues") || ""
  );
  const localStorageLesseeSignUrl = JSON.parse(
    localStorage.getItem("lesseeSignatureUrl") || ""
  );

  const navigate = useNavigate();
  useTimeout(() => {
    exportPDFWithMethod();
    navigate("/tenantLeaseAgreementHome");
  }, 100);
  return (
    <>
      <PDFExport ref={pdfExportComponent} paperSize="A4">
        <AgreementWrapper title="Lease Agreement">
          {LeaseIntro(
            localStorageLessorFormValues.day,
            localStorageLessorFormValues.month,
            localStorageLessorFormValues.year,
            localStorageLessorFormValues.lessorName,
            localStorageLessorFormValues.lessorIc,
            localStorageLessorFormValues.lesseeName,
            localStorageLessorFormValues.lesseIc
          )}
          {PropertyInfo(localStorageLessorFormValues.address)}
          <AgreementTerm number="1" title="term">
            {TermOne(
              localStorageLessorFormValues.effectiveDate,
              localStorageLessorFormValues.expireDate
            )}
          </AgreementTerm>
          <AgreementTerm number="2" title="rent">
            {TermTwo(
              localStorageLessorFormValues.rentRmWord,
              localStorageLessorFormValues.rentRmNum,
              localStorageLessorFormValues.advanceDay
            )}
          </AgreementTerm>
          <AgreementTerm number="3" title="deposit">
            {TermThree(
              localStorageLessorFormValues.depositRmWord,
              localStorageLessorFormValues.depositRmNum
            )}
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
              localStorageLessorFormValues.lessorAdd,
              localStorageLessorFormValues.lessorTel,
              localStorageLessorFormValues.lessorFax,
              localStorageLessorFormValues.lesseeAdd,
              localStorageLessorFormValues.lesseeTel,
              localStorageLessorFormValues.lesseeFax
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
              localStorageLessorSignUrl,
              localStorageLessorFormValues.lessorDesignation,
              localStorageLessorFormValues.lessorIc,
              localStorageLesseeSignUrl,
              localStorageLesseeFormValues.lesseeDesignation,
              localStorageLesseeFormValues.lesseeIc
            )}
          </AgreementTerm>
        </AgreementWrapper>
      </PDFExport>
    </>
  );
};

export default AgreementFull;
