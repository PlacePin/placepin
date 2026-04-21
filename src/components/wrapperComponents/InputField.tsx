import styles from './inputField.module.css';

const InputField = ({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) => (
  <div className={styles.fieldGroup}>
    <label className={styles.fieldLabel}>{label}</label>
    {children}
    {hint && <span className={styles.fieldHint}>{hint}</span>}
  </div>
)

export default InputField