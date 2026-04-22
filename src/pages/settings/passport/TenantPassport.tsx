import { useState } from "react";
import { useGetAxios } from "../../../hooks/useGetAxios";
import styles from './tenantPassport.module.css';
import IdentityStep from "../../../components/passportSteps/identity/IdentityStep";
import IncomeStep from "../../../components/passportSteps/income/IncomeStep";

export type PassportStep = "identity" | "income" | "background" | "rentHistory" | "documents";

const STEPS: PassportStep[] = ["identity", "income", "background", "rentHistory", "documents"];

export const STEP_PROGRESS: Record<PassportStep, number> = {
  identity: 20,
  income: 40,
  background: 60,
  rentHistory: 80,
  documents: 100,
};

export function getPillStatus(
  pillStep: PassportStep,
  currentStep: PassportStep
): "complete" | "current" | "upcoming" {
  const pillIdx = STEPS.indexOf(pillStep);
  const currentIdx = STEPS.indexOf(currentStep);
  if (pillIdx < currentIdx) return "complete";
  if (pillIdx === currentIdx) return "current";
  return "upcoming";
}

const TenantPassport = () => {
  const [currentStep, setCurrentStep] = useState<PassportStep>("identity");

  const { data, error } = useGetAxios('/api/users/');

  const advanceStep = () => {
    const currentIdx = STEPS.indexOf(currentStep);
    if (currentIdx < STEPS.length - 1) {
      setCurrentStep(STEPS[currentIdx + 1]);
    }
  };

  const goBack = () => {
    const currentIdx = STEPS.indexOf(currentStep);
    if (currentIdx > 0) {
      setCurrentStep(STEPS[currentIdx - 1]);
    }
  };

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>;
  }

  // Todo: Fix this to skeleton loading or cache so null doesn't render on each re-render
  if (!data) {
    return <div></div>;
  }

  const tenant = data.user;
  const nameParts = tenant.fullName.split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts[nameParts.length - 1];
  const DoB = String(tenant.dateOfBirth);
  const formattedDoB = `${DoB.slice(0, 4)}-${DoB.slice(4, 6)}-${DoB.slice(6, 8)}`;

  return (
    <div className={styles.passportContainer}>
      <div className={styles.title}>
        <h2>Set up your passport</h2>
        <p>Complete each section to build your verified rental identity.</p>
      </div>
      {currentStep === "identity" && (
        <IdentityStep
          firstName={firstName}
          lastName={lastName}
          dateOfBirth={formattedDoB}
          currentStep={currentStep}
          onComplete={advanceStep}
        />
      )}
      {currentStep === "income" && (
        <IncomeStep
          currentStep={currentStep}
          onBack={goBack}
          onComplete={advanceStep}
        />
      )}
      {/* Add steps here as you build them:
          currentStep === "background"  && <BackgroundStep ... />
          currentStep === "rentHistory" && <RentHistoryStep ... />
          currentStep === "documents"   && <DocumentsStep ... />
      */}
    </div>
  );
};

export default TenantPassport;