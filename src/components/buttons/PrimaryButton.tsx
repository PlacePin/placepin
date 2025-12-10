import type { ReactNode } from 'react';
import styles from './primaryButton.module.css';

interface PrimaryButtonProps {
  title: string,
  onClick?: () => void,
  icon?: ReactNode;
  className?: string
}

const PrimaryButton = ({
  title,
  onClick,
  icon,
  className,
}: PrimaryButtonProps) => {
  return (
    <div className={className}>
      <button
        onClick={onClick}
        className={styles.button}
      >
        {icon}{title}
      </button>
    </div>
  )
}

export default PrimaryButton