import { useState } from "react";
import { Info, LockKeyhole } from "lucide-react";
import { type PassportStep, STEP_PROGRESS, getPillStatus } from "../../../pages/settings/passport/TenantPassport";
import styles from "./incomeStep.module.css";
import PrimaryButton from "../../buttons/PrimaryButton";
import StepPill from "../StepPill";
import MethodCard from "../identity/cards/MethodCard";
import InputField from "../identity/wrapperComponents/InputField";
import UploadZone from "../identity/uploadFiles/UploadZone";
import SecondaryButton from "../../buttons/SecondaryButton";

type IncomeMethod = "stripe" | "upload";
type EmploymentType = "full-time" | "part-time" | "self-employed" | "contract" | "other";
type IncomeSource = "salary" | "hourly" | "freelance" | "benefits" | "other";

interface ManualIncomeFormState {
  employerName: string;
  employmentType: EmploymentType;
  annualIncome: string;
  incomeSource: IncomeSource;
  documentFile: File | null;
}

interface IncomeStepProps {
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

const IncomeStep = ({ currentStep, onComplete, onBack }: IncomeStepProps) => {
  const [method, setMethod] = useState<IncomeMethod>("stripe");
  const [stripeConnected, setStripeConnected] = useState(false);
  const [docDragging, setDocDragging] = useState(false);
  const [manualForm, setManualForm] = useState<ManualIncomeFormState>({
    employerName: "",
    employmentType: "full-time",
    annualIncome: "",
    incomeSource: "salary",
    documentFile: null,
  });

  const handleManualField = (field: keyof ManualIncomeFormState, value: string) => {
    setManualForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDocFile = (file: File | null) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) return;
    if (file.size > 10 * 1024 * 1024) return;
    setManualForm(prev => ({ ...prev, documentFile: file }));
  };

  const handleDocDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDocDragging(false);
    handleDocFile(e.dataTransfer.files[0] ?? null);
  };

  // Stripe path: complete once bank is connected
  // Upload path: employer name, income amount, and at least one document required
  const isComplete =
    method === "stripe"
      ? stripeConnected
      : Boolean(
        manualForm.employerName.trim() &&
        manualForm.annualIncome.trim() &&
        manualForm.documentFile !== null
      );

  const currentStepIndex = STEPS.indexOf(currentStep);

  // Simulate launching Stripe Financial Connections
  const handleStripeConnect = () => {
    // TODO: call backend to create a Stripe Financial Connections session,
    // then open the Stripe.js modal with the returned client_secret.
    // On success callback, set stripeConnected to true and store the account id.
    setStripeConnected(true);
  };

  return (
    <div className={styles.wrapper}>
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
      {/* Verification method */}
      <section className={styles.card}>
        <p className={styles.sectionLabel}>Income verification</p>
        <div className={styles.methodGrid}>
          <MethodCard
            selected={method === "stripe"}
            onClick={() => { setMethod("stripe"); setStripeConnected(false); }}
            badge="Recommended"
            title="Connect bank via Stripe"
            description="Instantly verifies income from direct deposits"
          />
          <MethodCard
            selected={method === "upload"}
            onClick={() => setMethod("upload")}
            title="Upload documents"
            description="Paystubs, W-2, or tax return for manual review"
          />
        </div>
        <div className={styles.infoBanner}>
          <Info size={24} />
          <p className={styles.infoText}>
            Landlords will only see your verified income amount, <strong>not your bank account or transaction history.</strong>
          </p>
        </div>
        {/* Stripe path */}
        {method === "stripe" && (
          <div className={styles.stripePanel}>
            {stripeConnected ? (
              <div className={styles.connectedBanner}>
                <span className={styles.connectedDot} />
                <div>
                  <p className={styles.connectedTitle}>Bank account connected</p>
                  <p className={styles.connectedSub}>Income verified via Stripe Financial Connections</p>
                </div>
                <button className={styles.reconnectBtn} onClick={() => setStripeConnected(false)}>
                  Disconnect
                </button>
              </div>
            ) : (
              <PrimaryButton
                icon={<LockKeyhole size={18} />}
                title="Connect your bank securely"
                onClick={handleStripeConnect}
              />
            )}
          </div>
        )}
        {/* Upload path — manual fields only shown here */}
        {method === "upload" && (
          <div className={styles.uploadPanel}>
            <div className={styles.fieldRow}>
              <InputField label="Employer name">
                <input
                  className={styles.input}
                  type="text"
                  placeholder="PlacePin"
                  value={manualForm.employerName}
                  onChange={e => handleManualField("employerName", e.target.value)}
                />
              </InputField>
              <InputField label="Employment type">
                <select
                  className={styles.input}
                  value={manualForm.employmentType}
                  onChange={e => handleManualField("employmentType", e.target.value)}
                >
                  <option value="full-time">Full-time</option>
                  <option value="part-time">Part-time</option>
                  <option value="self-employed">Self-employed</option>
                  <option value="contract">Contract</option>
                  <option value="other">Other</option>
                </select>
              </InputField>
            </div>
            <div className={styles.fieldRow}>
              <InputField label="Annual income ($)">
                <input
                  className={styles.input}
                  type="number"
                  placeholder="64000"
                  value={manualForm.annualIncome}
                  onChange={e => handleManualField("annualIncome", e.target.value)}
                />
              </InputField>
              <InputField label="Income source">
                <select
                  className={styles.input}
                  value={manualForm.incomeSource}
                  onChange={e => handleManualField("incomeSource", e.target.value)}
                >
                  <option value="salary">Salary</option>
                  <option value="hourly">Hourly wages</option>
                  <option value="freelance">Freelance</option>
                  <option value="benefits">Benefits / assistance</option>
                  <option value="other">Other</option>
                </select>
              </InputField>
            </div>
            <InputField label="Supporting document">
              <UploadZone
                label="Paystub, W-2, or tax return"
                file={manualForm.documentFile}
                dragging={docDragging}
                onDragOver={e => { e.preventDefault(); setDocDragging(true); }}
                onDragLeave={() => setDocDragging(false)}
                onDrop={handleDocDrop}
                onClick={() => document.getElementById("doc-upload")?.click()}
              />
              <input
                id="doc-upload"
                type="file"
                accept=".jpg,.jpeg,.png,.pdf"
                style={{ display: "none" }}
                onChange={e => handleDocFile(e.target.files?.[0] ?? null)}
              />
            </InputField>
          </div>
        )}
      </section>
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

export default IncomeStep;