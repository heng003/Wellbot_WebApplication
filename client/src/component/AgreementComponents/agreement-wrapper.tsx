import { Button } from "components/ui/button";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AgreementDialog } from "./agreement-dialog";

interface AgreementWrapperProps {
  title: string;
  nextButtonText?: string;
  nextButtonHref?: string;
  dialogTriggerText?: string;
  dialogTitle?: string;
  dialogCloseText?: string;
  dialogDescription?: string;
  children: React.ReactNode;
}

export const AgreementWrapper = ({
  title,
  nextButtonText,
  nextButtonHref,
  dialogTriggerText,
  dialogTitle,
  dialogCloseText,
  dialogDescription,

  children,
}: AgreementWrapperProps) => {
  const navigate = useNavigate();
  return (
    <>
      <main className="m-6 p-4">
        <h1 className="underline text-center mb-4">{title}</h1>
        {children}
        <div className="flex justify-end">
          {nextButtonText && nextButtonHref && (
            <Button
              onClick={() => {
                navigate(nextButtonHref);
              }}
              className="my-4 px-4 py-2 font-semibold rounded-lg text-white bg-dark-orange"
            >
              {nextButtonText}
            </Button>
          )}
          {dialogTitle && dialogTriggerText && dialogCloseText && (
            <AgreementDialog
              aboveTitleChildren={
                <img
                  className=" bg-cover max-h-12 max-w-12"
                  src="Images/logoText.png"
                  alt="Tick"
                />
              }
              title={dialogTitle}
              triggerText={dialogTriggerText}
              closeText={dialogCloseText}
              description={dialogDescription}
              closeHref="/"
            ></AgreementDialog>
          )}
        </div>
      </main>
    </>
  );
};
