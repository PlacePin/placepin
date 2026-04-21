import { useState, useRef } from "react"
import { ShieldCheck } from "lucide-react"
import styles from "./IdentityStep.module.css"
import MethodCard from "../cards/tenant/MethodCard"
import UploadZone from "../uploadFiles/UploadZone"
import InputField from "../wrapperComponents/InputField"

type VerificationMethod = "id" | "ssn"

interface IdentityFormState {
  firstName: string
  lastName: string
  dateOfBirth: string
  lastFourSSN: string
  verificationMethod: VerificationMethod
  idFrontFile: File | null
  idBackFile: File | null
}

const IdentityStep = () => {
  const [form, setForm] = useState<IdentityFormState>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    lastFourSSN: "",
    verificationMethod: "id",
    idFrontFile: null,
    idBackFile: null,
  })

  const [frontDragging, setFrontDragging] = useState(false)
  const [backDragging, setBackDragging] = useState(false)
  const frontInputRef = useRef<HTMLInputElement>(null)
  const backInputRef = useRef<HTMLInputElement>(null)

  const handleField = (field: keyof IdentityFormState, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const handleFile = (side: "front" | "back", file: File | null) => {
    if (!file) return
    const allowed = ["image/jpeg", "image/png", "application/pdf"]
    if (!allowed.includes(file.type)) return
    if (file.size > 10 * 1024 * 1024) return
    if (side === "front") setForm(prev => ({ ...prev, idFrontFile: file }))
    else setForm(prev => ({ ...prev, idBackFile: file }))
  }

  const handleDrop = (side: "front" | "back", e: React.DragEvent) => {
    e.preventDefault()
    if (side === "front") setFrontDragging(false)
    else setBackDragging(false)
    const file = e.dataTransfer.files[0] ?? null
    handleFile(side, file)
  }

  const isComplete =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.dateOfBirth &&
    (form.verificationMethod === "ssn"
      ? form.lastFourSSN.length === 4
      : form.idFrontFile !== null)

  return (
    <div className={styles.wrapper}>
      {/* Info banner */}
      <div className={styles.infoBanner}>
        <ShieldCheck />
        <p className={styles.infoText}>
          Your legal name and date of birth are used only for verification and are{" "}
          <strong>never shown to landlords</strong>.
        </p>
      </div>
      {/* Personal details */}
      <section className={styles.card}>
        <p className={styles.sectionLabel}>Personal details</p>
        <div className={styles.fieldRow}>
          <InputField label="Legal first name">
            <input
              className={styles.input}
              type="text"
              placeholder="Jordan"
              value={form.firstName}
              onChange={e => handleField("firstName", e.target.value)}
            />
          </InputField>
          <InputField label="Legal last name">
            <input
              className={styles.input}
              type="text"
              placeholder="Davis"
              value={form.lastName}
              onChange={e => handleField("lastName", e.target.value)}
            />
          </InputField>
        </div>
        <div className={styles.fieldRow}>
          <InputField label="Date of birth">
            <input
              className={styles.input}
              type="date"
              value={form.dateOfBirth}
              onChange={e => handleField("dateOfBirth", e.target.value)}
            />
          </InputField>
          <InputField label="Last 4 of SSN" hint="Used for identity matching only">
            <input
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
              onDragOver={e => { e.preventDefault(); setFrontDragging(true) }}
              onDragLeave={() => setFrontDragging(false)}
              onDrop={e => handleDrop("front", e)}
              onClick={() => frontInputRef.current?.click()}
            />
            <UploadZone
              label="Back of ID"
              file={form.idBackFile}
              dragging={backDragging}
              onDragOver={e => { e.preventDefault(); setBackDragging(true) }}
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
            <InputField label="Full Social Security Number">
              <input
                className={styles.input}
                type="text"
                placeholder="XXX-XX-XXXX"
                maxLength={11}
              />
            </InputField>
            <p className={styles.ssnNote}>
              Your SSN is encrypted in transit and never stored in plain text.
            </p>
          </div>
        )}
      </section>
      {/* Action row */}
      <div className={styles.actionRow}>
        <p className={styles.stepIndicator}>Step 1 of 5</p>
        <button className={styles.btnPrimary} disabled={!isComplete}>
          Save &amp; continue →
        </button>
      </div>
    </div>
  )
}

export default IdentityStep