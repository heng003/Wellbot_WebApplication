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
import axios from "axios";
import { useParams } from "react-router-dom";

const TenantAgreementPage1 = async () => {
  const { leaseAgreementId } = useParams();
  const response = await axios.get(
    `http://localhost:5000/api/leaseAgreement/getLeaseAgreement/${leaseAgreementId}`
  );
  const data = response.data;

  // Check if data is empty or invalid
  if (!data) {
    // Handle the case when data is empty or invalid
    return <div>No data available.</div>;
  }

  return (
    <>
      <AgreementWrapper
        title="Lease Agreement"
        nextButtonText="Next"
        nextButtonHref={`/tenantLeaseAgreementPg2/${leaseAgreementId}`}
      >
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
      </AgreementWrapper>
    </>
  );
};

export default TenantAgreementPage1;
