import styles from './inputField.module.css';

const InputField = ({
  label,
  hint,
  children,
  htmlFor,
}: {
  label: string
  hint?: string
  children: React.ReactNode,
  htmlFor: string,
}) => (
  <div className={styles.fieldGroup}>
    <label
      className={styles.fieldLabel}
      htmlFor={htmlFor}
    >
      {label}
    </label>
    {children}
    {hint && <span className={styles.fieldHint}>{hint}</span>}
  </div>
)

export default InputField