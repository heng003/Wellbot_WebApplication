import React from "react";
import { AgreementWrapper } from "component/AgreementComponents/agreement-wrapper";
import {
  LeaseIntro,
  PropertyInfo,
  TermFour,
  TermOne,
  TermThree,
  TermTwo,
} from "../AgreementText";
import { AgreementTerm } from "component/AgreementComponents/agreeement-term";

const LandlordAgreementPage1 = () => {
  const localStorageValue = JSON.parse(
    localStorage.getItem("lessorFormValues") || ""
  );

  return (
    <>
      <AgreementWrapper
        title="Lease Agreement"
        nextButtonText="Next"
        nextButtonHref="/landlordLeaseAgreementPg2"
      >
        {LeaseIntro(
          localStorageValue.day,
          localStorageValue.month,
          localStorageValue.year,
          localStorageValue.lessorName,
          localStorageValue.lessorIc,
          localStorageValue.lesseeName,
          localStorageValue.lesseIc
        )}
        {PropertyInfo(localStorageValue.address)}
        <AgreementTerm number="1" title="term">
          {TermOne(
            localStorageValue.effectiveDate,
            localStorageValue.expireDate
          )}
        </AgreementTerm>
        <AgreementTerm number="2" title="rent">
          {TermTwo(
            localStorageValue.rentRmWord,
            localStorageValue.rentRmNum,
            localStorageValue.advanceDay
          )}
        </AgreementTerm>
        <AgreementTerm number="3" title="deposit">
          {TermThree(
            localStorageValue.depositRmWord,
            localStorageValue.depositRmNum
          )}
        </AgreementTerm>
        <AgreementTerm number="4" title="COVENANTS BY THE LESSEE">
          {TermFour()}
        </AgreementTerm>
      </AgreementWrapper>
    </>
  );
};

export default LandlordAgreementPage1;
