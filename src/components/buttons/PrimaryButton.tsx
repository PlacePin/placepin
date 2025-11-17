import styles from './primaryButton.module.css';

interface PrimaryButtonProps {
  title: string,
  onClick?: () => void,
}

const PrimaryButton = ({
  title,
  onClick,
}: PrimaryButtonProps) => {
  return (
      <button
        onClick={onClick}
        className={styles.button}
      >
        {title}
      </button>
  )
}

export default PrimaryButton