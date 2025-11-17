import styles from './secondaryButton.module.css';

interface SecondaryButtonProps {
  title: string,
  onClick: () => void,
}

const SecondaryButton = ({
  title,
  onClick
}: SecondaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={styles.button}
    >
      {title}
    </button>
  )
}

export default SecondaryButton