import type { ReactNode } from "react";
import styles from './tooltip.module.css';

interface TooltipProps {
  children: ReactNode;
  text: string;
  position: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip = ({
  children,
  text,
  position,
}: TooltipProps) => {

  return (
    <div
      className={`${styles.tooltip} ${styles[position]}`}
    >
      {children}
      <span className={styles.tooltipText}>{text}</span>
    </div>
  )
}

export default Tooltip