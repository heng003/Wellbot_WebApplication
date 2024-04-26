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

const TenantAgreementPage1 = () => {
  // Retrieve data from localStorage
  const localStorageValue = JSON.parse(
    localStorage.getItem("lessorFormValues") || "{}"
  );

  // Check if localStorageValue is empty or invalid
  if (!localStorageValue || Object.keys(localStorageValue).length === 0) {
    // Handle the case when localStorageValue is empty or invalid
    return <div>No data available.</div>;
  }

  return (
    <>
      <AgreementWrapper
        title="Lease Agreement"
        nextButtonText="Next"
        nextButtonHref="/tenantLeaseAgreementPg2"
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

export default TenantAgreementPage1;
