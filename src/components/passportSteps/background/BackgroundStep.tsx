import { useState } from "react";
import { Info } from "lucide-react";
import { type PassportStep, STEP_PROGRESS } from "../../../pages/settings/passport/TenantPassport";
import { getPillStatus } from "../../../utils/getPillStatus";
import styles from "./backgroundStep.module.css";
import PrimaryButton from "../../buttons/PrimaryButton";
import StepPill from "../StepPill";
import MethodCard from "../identity/cards/MethodCard";
import SecondaryButton from "../../buttons/SecondaryButton";

type BackgroundChoice = "run" | "skip";

interface BackgroundFormState {
  choice: BackgroundChoice | null;
  authorizeCriminal: boolean;
  allowRequests: boolean;
}

interface BackgroundStepProps {
  currentStep: PassportStep;
  onComplete: () => void;
  onBack: () => void;
}

const STEPS: PassportStep[] = ["identity", "income", "background", "rentHistory", "documents"];

const STEP_LABELS: Record<PassportStep, string> = {
  identity: "Identity",
  income: "Income",
  background: "Background",
  rentHistory: "Rent history",
  documents: "Documents",
};

const BackgroundStep = ({ currentStep, onComplete, onBack }: BackgroundStepProps) => {
  const [form, setForm] = useState<BackgroundFormState>({
    choice: null,
    authorizeCriminal: false,
    allowRequests: false,
  });

  // Complete if they skip, OR if they run and authorize the check
  const isComplete =
    form.choice === "skip" ||
    (form.choice === "run" && form.authorizeCriminal);

  const currentStepIndex = STEPS.indexOf(currentStep);

  return (
    <div className={styles.wrapper}>
      {/* Info banner */}
      <div className={styles.infoBanner}>
        <Info size={18} style={{ flexShrink: 0, marginTop: 2 }} />
        <p className={styles.infoText}>
          A background check is optional but increases landlord confidence. Results are run once and stored — you control who can see them.
        </p>
      </div>
      {/* Progress */}
      <div className={styles.progressWrapper}>
        <div className={styles.progressBarTrack}>
          <div
            className={styles.progressBarFill}
            style={{ width: `${STEP_PROGRESS[currentStep]}%` }}
          />
        </div>
        <div className={styles.stepRow}>
          {STEPS.map(step => (
            <StepPill
              key={step}
              label={STEP_LABELS[step]}
              status={getPillStatus(step, currentStep)}
            />
          ))}
        </div>
      </div>
      {/* Background Check Choice */}
      <section className={styles.card}>
        <p className={styles.sectionLabel}>Background Check</p>
        <div className={styles.methodGrid}>
          <MethodCard
            selected={form.choice === "run"}
            onClick={() => setForm(prev => ({ ...prev, choice: "run" }))}
            title="Run a check now"
            description="Takes ~2 minutes. Results appear on your passport within 24 hours."
          />
          <MethodCard
            selected={form.choice === "skip"}
            onClick={() => setForm(prev => ({ ...prev, choice: "skip" }))}
            title="Skip for now"
            description="You can add this later. Your passport will note it as not yet run."
          />
        </div>
      </section>
      {/* Consent Section - only shows if "Run" is selected */}
      {form.choice === "run" && (
        <section className={styles.card}>
          <p className={styles.sectionLabel}>Consent</p>
          <div className={styles.consentList}>
            <label className={styles.consentItem}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={form.authorizeCriminal}
                onChange={e => setForm(prev => ({ ...prev, authorizeCriminal: e.target.checked }))}
              />
              <div className={styles.consentText}>
                <p className={styles.consentTitle}>
                  I authorize <strong>PlacePin</strong> to run a criminal background check on my behalf.
                </p>
                <p className={styles.consentSub}>
                  One-time check · stored securely · visible only when you choose to share
                </p>
              </div>
            </label>
            <label className={styles.consentItem}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={form.allowRequests}
                onChange={e => setForm(prev => ({ ...prev, allowRequests: e.target.checked }))}
              />
              <div className={styles.consentText}>
                <p className={styles.consentTitle}>
                  Allow landlords to request a fresh check during an application.
                </p>
                <p className={styles.consentSub}>
                  You will be notified and must approve each individual request
                </p>
              </div>
            </label>
          </div>
        </section>
      )}
      {/* Action row */}
      <div className={styles.actionRow}>
        <SecondaryButton
          onClick={onBack}
          title="← Back"
        />
        <p className={styles.stepIndicator}>Step {currentStepIndex + 1} of {STEPS.length}</p>
        <PrimaryButton
          title="Save & continue →"
          disabled={!isComplete}
          onClick={onComplete}
        />
      </div>
    </div>
  );
};

export default BackgroundStep;
