import { cn } from "@/lib/utils";
import React from "react";

interface CheckoutStepsProps {
  currentStep?: number;
}

const steps = [
  "User login",
  "Shipping address",
  "Payment method",
  "Place order",
];

function CheckoutSteps({ currentStep = 0 }: CheckoutStepsProps) {
  return (
    <div className="flex-between flex-col md:flex-row gap-2 mb-10">
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div
            className={cn(
              "p-2 w-56 rounded-full text-center text-sm",
              currentStep === index && "bg-secondary",
            )}
          >
            {step}
          </div>
          {/*if we were in all steps except not in last step */}
          {step !== "Place order" && (
            <hr className="w-16 border-t border-gray-300 mx-2" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default CheckoutSteps;
