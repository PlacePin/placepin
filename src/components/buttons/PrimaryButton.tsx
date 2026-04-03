import type { ReactNode } from 'react';
import styles from './primaryButton.module.css';

interface PrimaryButtonProps {
  onClick?: () => void,
  title: string,
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

const PrimaryButton = ({
  onClick,
  title,
  icon,
  className,
  disabled,
}: PrimaryButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`${styles.button} ${className} ${disabled ? styles.disabled : ''}`}
      disabled={disabled}
    >
      {icon}{title}
    </button>
  )
}

export default PrimaryButton