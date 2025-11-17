import styles from './dangerButton.module.css';

interface DangerButtonProps {
  title: string,
  onClick?: () => void,
}

const DangerButton = ({
  title,
  onClick
}: DangerButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={styles.button}
    >
      {title}
    </button>
  )
}

export default DangerButton