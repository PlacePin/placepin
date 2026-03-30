import type { ReactNode } from 'react';
import styles from './primaryButton.module.css';

interface PrimaryButtonProps {
  title: string,
  onClick?: () => void,
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
}

const PrimaryButton = ({
  title,
  onClick,
  icon,
  className,
  disabled,
}: PrimaryButtonProps) => {
  return (
    <div className={className}>
      <button
        onClick={onClick}
        className={`${styles.button} ${disabled ? styles.disabled : ''}`}
        disabled={disabled}
      >
        {icon}{title}
      </button>
    </div>
  )
}

export default PrimaryButton