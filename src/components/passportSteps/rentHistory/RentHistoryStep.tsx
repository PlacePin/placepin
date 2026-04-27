import { useState } from "react";
import { Info, Plus } from "lucide-react";
import { type PassportStep, STEP_PROGRESS } from "../../../pages/settings/passport/TenantPassport";
import { getPillStatus } from "../../../utils/getPillStatus";
import styles from "./rentHistoryStep.module.css";
import PrimaryButton from "../../buttons/PrimaryButton";
import StepPill from "../StepPill";
import InputField from "../identity/wrapperComponents/InputField";
import UploadZone from "../identity/uploadFiles/UploadZone";
import SecondaryButton from "../../buttons/SecondaryButton";

type VerificationType = "lease" | "placepin" | "reference" | "bank";

interface RentalEntry {
  id: string;
  address: string;
  startDate: string;
  endDate: string;
  monthlyRent: string;
  verificationType: VerificationType;
  landlordName: string;
  landlordEmail?: string;
  file?: File | null;
  notes: string;
}

interface RentHistoryStepProps {
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

const RentHistoryStep = ({
  currentStep,
  onComplete,
  onBack
}: RentHistoryStepProps) => {
  const [rentals, setRentals] = useState<RentalEntry[]>([
    {
      id: crypto.randomUUID(),
      address: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
      verificationType: "lease",
      landlordName: "",
      notes: "",
    },
  ]);

  const updateRental = (id: string, updates: Partial<RentalEntry>) => {
    setRentals(prev => prev.map(rental => rental.id === id ? { ...rental, ...updates } : rental));
  };

  const addRental = () => {
    setRentals(prev => [...prev, {
      id: crypto.randomUUID(),
      address: "",
      startDate: "",
      endDate: "",
      monthlyRent: "",
      verificationType: "lease",
      landlordName: "",
      notes: "",
    }]);
  };

  const isComplete = rentals.every(rental => {
    return rental.address &&
      rental.startDate &&
      rental.endDate &&
      rental.landlordName
  });
  const currentStepIndex = STEPS.indexOf(currentStep);

  return (
    <div className={styles.wrapper}>
      <div className={styles.infoBanner}>
        <Info
          size={18}
          style={{ flexShrink: 0, marginTop: 2 }}
        />
        <p className={styles.infoText}>
          Add your past rentals. If your landlord is on <strong>PlacePin</strong>,
          we can auto-verify payment history.
          Otherwise, upload a lease or reference letter.
        </p>
      </div>
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
      {rentals.map((rental, index) => (
        <section key={rental.id} className={styles.card}>
          <p className={styles.sectionLabel}>Rental {index + 1}</p>
          <InputField
            label="Street address"
            htmlFor="streetAddress"
          >
            <input
              id="streetAddress"
              className={styles.input}
              placeholder="123 Main St, Apt 4B..."
              value={rental.address}
              onChange={e => updateRental(rental.id, { address: e.target.value })}
            />
          </InputField>
          <div className={styles.fieldRow}>
            <InputField
              label="Lease start"
              htmlFor="leaseStart"
            >
              <input
                id="leaseStart"
                type="date"
                className={styles.input}
                value={rental.startDate}
                onChange={e => updateRental(rental.id, { startDate: e.target.value })}
              />
            </InputField>
            <InputField
              label="Lease end"
              htmlFor="leaseEnd"
            >
              <input
                id="leaseEnd"
                type="date"
                className={styles.input}
                value={rental.endDate}
                onChange={e => updateRental(rental.id, { endDate: e.target.value })}
              />
            </InputField>
          </div>
          <div className={styles.fieldRow}>
            <InputField
              label="Monthly rent ($)"
              htmlFor="monthlyRent"
            >
              <input
                id="monthlyRent"
                type="number"
                className={styles.input}
                placeholder="2000"
                value={rental.monthlyRent}
                onChange={e => updateRental(rental.id, { monthlyRent: e.target.value })}
              />
            </InputField>
            <InputField
              label="Verification"
              htmlFor="verification"
            >
              <select
                id="verification"
                className={styles.input}
                value={rental.verificationType}
                onChange={e => updateRental(rental.id, { verificationType: e.target.value as VerificationType })}
              >
                <option value="lease">Upload lease</option>
                <option value="placepin">Landlord on PlacePin</option>
                <option value="reference">Reference letter</option>
                <option value="bank">Bank statements</option>
              </select>
            </InputField>
          </div>
          <InputField
            label="Landlord / property manager name"
            htmlFor="buildingManager"
          >
            <input
              id="buildingManager"
              className={styles.input}
              value={rental.landlordName}
              placeholder="Dinah Augustin"
              onChange={e => updateRental(rental.id, { landlordName: e.target.value })}
            />
          </InputField>
          {/* Conditional Fields Based on Verification Selection */}
          {rental.verificationType === 'placepin' ? (
            <InputField
              label="Landlord Email"
              hint="We'll send a verification request"
              htmlFor="landlordInfo"
            >
              <input
                id="landlordInfo"
                className={styles.input}
                type="email"
                placeholder="landlord@email.com"
                onChange={e => updateRental(rental.id, { landlordEmail: e.target.value })}
              />
            </InputField>
          ) : (
            <UploadZone
              label={`Upload ${rental.verificationType.replace(/^\w/, (c) => c.toUpperCase())}`}
              file={rental.file || null}
              onClick={() => { }} dragging={false} onDragOver={function (e: React.DragEvent): void {
                throw new Error("Function not implemented.");
              }} onDragLeave={function (): void {
                throw new Error("Function not implemented.");
              }} onDrop={function (e: React.DragEvent): void {
                throw new Error("Function not implemented.");
              }} />
          )}
          <InputField
            label="Any issues during tenancy? (optional)"
            htmlFor="notes"
          >
            <textarea
              id="notes"
              className={styles.textarea}
              placeholder="e.g. late payment in month 3 due to job transition"
              value={rental.notes}
              onChange={e => updateRental(rental.id, { notes: e.target.value })}
            />
          </InputField>
        </section>
      ))}
      <button
        className={styles.addBtn}
        onClick={addRental}
      >
        <Plus size={16} />
        Add another rental
      </button>
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

export default RentHistoryStep;
