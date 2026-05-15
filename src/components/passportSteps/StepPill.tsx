import styles from './stepPill.module.css';

type StepStatus = "complete" | "current" | "upcoming"

const StepPill = ({
  label,
  status,
}: {
  label: string
  status: StepStatus
}) => {
  return (
    <div
      className={`${styles.step} ${
        status === "current"
          ? styles.stepCurrent
          : status === "complete"
          ? styles.stepComplete
          : ""
      }`}
    >
      <span
        className={`${styles.stepDot} ${
          status === "complete"
            ? styles.stepDotComplete
            : status === "current"
            ? styles.stepDotCurrent
            : ""
        }`}
      />
      {label}
    </div>
  )
}

export default StepPill