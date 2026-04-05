import styles from './secondaryDangerButton.module.css';

interface SecondaryDangerButtonProps {
  onClick?: () => void,
  title: string,
}

const SecondaryDangerButton = ({
  onClick,
  title,
}: SecondaryDangerButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={styles.button}
    >
      {title}
    </button>
  )
}

export default SecondaryDangerButton