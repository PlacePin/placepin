import { useState, useRef } from "react";
import { ShieldCheck } from "lucide-react";
import { type PassportStep, STEP_PROGRESS } from "../../../pages/settings/passport/TenantPassport";
import { getPillStatus } from "../../../utils/getPillStatus";
import styles from "./identityStep.module.css";
import MethodCard from "./cards/MethodCard";
import UploadZone from "./uploadFiles/UploadZone";
import InputField from "./wrapperComponents/InputField";
import PrimaryButton from "../../buttons/PrimaryButton";
import StepPill from "../StepPill";

type VerificationMethod = "id" | "ssn";

interface IdentityFormState {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  lastFourSSN: string;
  verificationMethod: VerificationMethod;
  idFrontFile: File | null;
  idBackFile: File | null;
  fullSSN: string;
}

interface IdentityStepProps {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  currentStep: PassportStep;
  onComplete: () => void;
}

const STEPS: PassportStep[] = ["identity", "income", "background", "rentHistory", "documents"];

const STEP_LABELS: Record<PassportStep, string> = {
  identity: "Identity",
  income: "Income",
  background: "Background",
  rentHistory: "Rent history",
  documents: "Documents",
};

const IdentityStep = ({
  firstName,
  lastName,
  dateOfBirth,
  currentStep,
  onComplete,
}: IdentityStepProps) => {
  const [form, setForm] = useState<IdentityFormState>({
    firstName,
    lastName,
    dateOfBirth,
    lastFourSSN: "",
    verificationMethod: "id",
    idFrontFile: null,
    idBackFile: null,
    fullSSN: '',
  });

  const [frontDragging, setFrontDragging] = useState(false);
  const [backDragging, setBackDragging] = useState(false);
  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleField = (field: keyof IdentityFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleFile = (side: "front" | "back", file: File | null) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "application/pdf"];
    if (!allowed.includes(file.type)) return;
    if (file.size > 10 * 1024 * 1024) return;
    if (side === "front") setForm(prev => ({ ...prev, idFrontFile: file }));
    else setForm(prev => ({ ...prev, idBackFile: file }));
  };

  const handleDrop = (side: "front" | "back", e: React.DragEvent) => {
    e.preventDefault();
    if (side === "front") setFrontDragging(false);
    else setBackDragging(false);
    const file = e.dataTransfer.files[0] ?? null;
    handleFile(side, file);
  };

  const isComplete = Boolean(
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.dateOfBirth &&
    (form.verificationMethod === "ssn"
      ? /^(\d{9}|\d{3}-\d{2}-\d{4})$/.test(form.fullSSN) // Validates the full SSN format
      : form.idFrontFile !== null && form.idBackFile !== null)
  );

  const currentStepIndex = STEPS.indexOf(currentStep);

  return (
    <div className={styles.wrapper}>
      {/* Info banner */}
      <div className={styles.infoBanner}>
        <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: 1 }} />
        <p className={styles.infoText}>
          We use your information to verify your identity. Landlords only see your name and verification status—not{" "}
          <strong>sensitive details like your date of birth or SSN</strong>.
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
      {/* Personal details */}
      <section className={styles.card}>
        <p className={styles.sectionLabel}>Personal details</p>
        <div className={styles.fieldRow}>
          <InputField
            label="Legal first name"
            htmlFor="firstName"
          >
            <input
              id="firstName"
              className={styles.input}
              type="text"
              placeholder="Dinah"
              value={form.firstName}
              onChange={e => handleField("firstName", e.target.value)}
            />
          </InputField>
          <InputField
            label="Legal last name"
            htmlFor="lastName"
          >
            <input
              id="lastName"
              className={styles.input}
              type="text"
              placeholder="Augustin"
              value={form.lastName}
              onChange={e => handleField("lastName", e.target.value)}
            />
          </InputField>
        </div>
        <div className={styles.fieldRow}>
          <InputField
            label="Date of birth"
            htmlFor="dateOfBirth"
          >
            <input
              id="dateOfBirth"
              className={styles.input}
              type="date"
              value={form.dateOfBirth}
              onChange={e => handleField("dateOfBirth", e.target.value)}
            />
          </InputField>
          {/* Hidden when SSN verification is selected — redundant in that flow */}
          {form.verificationMethod === "id" && (
            <InputField
              label="Last 4 of SSN"
              hint="Used for identity matching only"
              htmlFor="lastFourSSN"
            >
              <input
                id="lastFourSSN"
                className={styles.input}
                type="text"
                placeholder="••••"
                maxLength={4}
                inputMode="numeric"
                value={form.lastFourSSN}
                onChange={e =>
                  handleField("lastFourSSN", e.target.value.replace(/\D/g, ""))
                }
              />
            </InputField>
          )}
        </div>
      </section>
      {/* Verification method */}
      <section className={styles.card}>
        <p className={styles.sectionLabel}>Verification method</p>
        <div className={styles.methodGrid}>
          <MethodCard
            selected={form.verificationMethod === "id"}
            onClick={() => handleField("verificationMethod", "id")}
            badge="Recommended"
            title="Government ID"
            description="Upload a photo of your driver's license or passport"
          />
          <MethodCard
            selected={form.verificationMethod === "ssn"}
            onClick={() => handleField("verificationMethod", "ssn")}
            title="SSN verification"
            description="Verify using your full Social Security Number"
          />
        </div>
        {form.verificationMethod === "id" && (
          <div className={styles.uploadGrid}>
            <UploadZone
              label="Front of ID"
              file={form.idFrontFile}
              dragging={frontDragging}
              onDragOver={e => { e.preventDefault(); setFrontDragging(true); }}
              onDragLeave={() => setFrontDragging(false)}
              onDrop={e => handleDrop("front", e)}
              onClick={() => frontInputRef.current?.click()}
            />
            <UploadZone
              label="Back of ID"
              file={form.idBackFile}
              dragging={backDragging}
              onDragOver={e => { e.preventDefault(); setBackDragging(true); }}
              onDragLeave={() => setBackDragging(false)}
              onDrop={e => handleDrop("back", e)}
              onClick={() => backInputRef.current?.click()}
            />
            <input
              ref={frontInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: "none" }}
              onChange={e => handleFile("front", e.target.files?.[0] ?? null)}
            />
            <input
              ref={backInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              style={{ display: "none" }}
              onChange={e => handleFile("back", e.target.files?.[0] ?? null)}
            />
          </div>
        )}
        {form.verificationMethod === "ssn" && (
          <div className={styles.ssnField}>
            <InputField
              label="Full Social Security Number"
              htmlFor="fullSSN"
            >
              <input
                id="fullSSN"
                className={styles.input}
                type="text"
                placeholder="XXX-XX-XXXX"
                maxLength={11}
                value={form.fullSSN}
                onChange={(e) => {
                  // Allow only numbers and hyphens while typing
                  const val = e.target.value.replace(/[^\d-]/g, "");
                  handleField("fullSSN", val);
                }}
              />
            </InputField>
          </div>
        )}
      </section>
      {/* Action row */}
      <div className={styles.actionRow}>
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

export default IdentityStep;