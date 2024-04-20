import React from "react";
import { AgreementWrapper } from "../component/AgreementComponents/agreement-wrapper";
import {
  LeaseIntro,
  PropertyInfo,
  TermFour,
  TermOne,
  TermThree,
  TermTwo,
} from "./AgreementText";
import { AgreementTerm } from "../component/AgreementComponents/agreeement-term";

const AgreementPage1 = () => {
  return (
    <>
      <AgreementWrapper
        title="Lease Agreement"
        nextButtonText="Next"
        nextButtonHref="/leaseAgreement/page2"
      >
        {LeaseIntro(
          "1",
          "May",
          "24",
          "Lye Xin Tian",
          "000000000",
          "Joshua Lim",
          "111111111"
        )}
        {PropertyInfo("775 House")}
        <AgreementTerm number="1" title="term">
          {TermOne("1 May 2024", "1 May 2025")}
        </AgreementTerm>
        <AgreementTerm number="2" title="rent">
          {TermTwo("Five Hundred", "500", "10")}
        </AgreementTerm>
        <AgreementTerm number="3" title="deposit">
          {TermThree("Five Hundred", "500")}
        </AgreementTerm>
        <AgreementTerm number="4" title="COVENANTS BY THE LESSEE">
          {TermFour()}
        </AgreementTerm>
      </AgreementWrapper>
    </>
  );
};

export default AgreementPage1;
