import { useState, useRef } from "react";
import { Info, Upload } from "lucide-react";
import { type PassportStep, STEP_PROGRESS } from "../../../pages/settings/passport/TenantPassport";
import { getPillStatus } from "../../../utils/getPillStatus";
import styles from "./documentsStep.module.css";
import PrimaryButton from "../../buttons/PrimaryButton";
import StepPill from "../StepPill";
import SecondaryButton from "../../buttons/SecondaryButton";

interface DocumentsState {
  paystubs: File[];
  leases: File[];
  others: File[];
}

interface DocumentsStepProps {
  currentStep: PassportStep;
  onComplete: () => void;
  onBack: () => void;
}

const STEPS: PassportStep[] = ["identity", "income", "background", "rentHistory", "documents"];

const DocumentsStep = ({ currentStep, onComplete, onBack }: DocumentsStepProps) => {
  const [docs, setDocs] = useState<DocumentsState>({
    paystubs: [],
    leases: [],
    others: [],
  });

  const paystubRef = useRef<HTMLInputElement>(null);
  const leaseRef = useRef<HTMLInputElement>(null);
  const otherRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (category: keyof DocumentsState, files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    setDocs(prev => ({
      ...prev,
      [category]: [...prev[category], ...newFiles]
    }));
  };

  const currentStepIndex = STEPS.indexOf(currentStep);

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
              label={step.charAt(0).toUpperCase() + step.slice(1)}
              status={getPillStatus(step, currentStep)}
            />
          ))}
        </div>
      </div>
      <section className={styles.card}>
        <p className={styles.sectionLabel}>Document Vault</p>
        <div className={styles.infoBanner}>
          <Info size={18} style={{ flexShrink: 0 }} />
          <p className={styles.infoText}>
            Documents are hidden from landlords by default. You control sharing in your passport visibility settings.
          </p>
        </div>
        <div className={styles.uploadList}>
          {/* Paystubs Category */}
          <div className={styles.uploadBox} onClick={() => paystubRef.current?.click()}>
            <Upload size={20} />
            <div className={styles.uploadText}>
              <p className={styles.uploadTitle}>Paystubs or W-2</p>
              <p className={styles.uploadSub}>Last 2-3 months recommended</p>
              {docs.paystubs.length > 0 && (
                <span className={styles.fileCount}>{docs.paystubs.length} files added</span>
              )}
            </div>
            <input
              type="file"
              ref={paystubRef}
              multiple
              hidden
              onChange={(e) => handleFileChange("paystubs", e.target.files)}
            />
          </div>
          {/* Leases Category */}
          <div className={styles.uploadBox} onClick={() => leaseRef.current?.click()}>
            <Upload size={20} />
            <div className={styles.uploadText}>
              <p className={styles.uploadTitle}>Lease agreements</p>
              <p className={styles.uploadSub}>From previous rentals</p>
              {docs.leases.length > 0 && (
                <span className={styles.fileCount}>{docs.leases.length} files added</span>
              )}
            </div>
            <input
              type="file"
              ref={leaseRef}
              multiple
              hidden
              onChange={(e) => handleFileChange("leases", e.target.files)}
            />
          </div>
          {/* Other Documents */}
          <div className={styles.uploadBox} onClick={() => otherRef.current?.click()}>
            <Upload size={20} />
            <div className={styles.uploadText}>
              <p className={styles.uploadTitle}>Other documents</p>
              <p className={styles.uploadSub}>References, tax returns, bank letters</p>
              {docs.others.length > 0 && (
                <span className={styles.fileCount}>{docs.others.length} files added</span>
              )}
            </div>
            <input
              type="file"
              ref={otherRef}
              multiple
              hidden
              onChange={(e) => handleFileChange("others", e.target.files)}
            />
          </div>
        </div>
      </section>
      {/* Action row */}
      <div className={styles.actionRow}>
        <SecondaryButton
          onClick={onBack}
          title="← Back"
        />
        <p className={styles.stepIndicator}>Step {currentStepIndex + 1} of {STEPS.length}</p>
        <PrimaryButton
          title="Finish & generate passport →"
          onClick={onComplete}
        />
      </div>
    </div>
  );
};

export default DocumentsStep;
