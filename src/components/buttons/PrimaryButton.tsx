import type { ReactNode } from 'react';
import styles from './primaryButton.module.css';

interface PrimaryButtonProps {
  title: string,
  onClick?: () => void,
  icon?: ReactNode;
}

const PrimaryButton = ({
  title,
  onClick,
  icon,
}: PrimaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={styles.button}
    >
      {icon}{title}
    </button>
  )
}

export default PrimaryButton