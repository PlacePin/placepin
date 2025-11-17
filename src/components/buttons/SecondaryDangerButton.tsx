import styles from './secondaryDangerButton.module.css';

interface SecondaryDangerButtonProps {
  title: string,
  onClick?: () => void,
}

const SecondaryDangerButton = ({
  title,
  onClick
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