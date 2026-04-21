import styles from './methodCard.module.css';

const MethodCard = ({
  selected,
  onClick,
  badge,
  title,
  description,
}: {
  selected: boolean
  onClick: () => void
  badge?: string
  title: string
  description: string
}) => (
  <button
    onClick={onClick}
    className={`${styles.methodCard} ${selected ? styles.methodCardSelected : ""}`}
  >
    {badge && <span className={`${styles.methodBadge} ${selected && styles.methodBadgeSelected}`}>{badge}</span>}
    <p className={`${styles.methodTitle} ${selected ? styles.methodTitleSelected : ""}`}>
      {title}
    </p>
    <p className={styles.methodDesc}>{description}</p>
    <div className={styles.methodRadio}>
      <div
        className={`${styles.methodRadioInner} ${selected ? styles.methodRadioInnerSelected : ""}`}
      />
    </div>
  </button>
)

export default MethodCard