import React from "react";
import { useNavigate } from "react-router-dom";

interface AgreementWrapperProps {
  title: string;
  nextButtonText: string;
  nextButtonHref: string;
  children: React.ReactNode;
}

export const AgreementWrapper = ({
  title,
  nextButtonText,
  nextButtonHref,
  children,
}: AgreementWrapperProps) => {
  const navigate = useNavigate();
  return (
    <>
      <main className="m-6 p-4">
        <h1 className="underline text-center mb-4">{title}</h1>
        {children}
        <div className="flex justify-end">
          <button
            onClick={() => {
              navigate(nextButtonHref);
            }}
            className="my-4 px-4 py-2 font-semibold rounded-md text-white bg-dark-orange"
          >
            {nextButtonText}
          </button>
        </div>
      </main>
    </>
  );
};
