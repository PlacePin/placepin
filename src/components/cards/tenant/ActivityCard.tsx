import type { ReactNode } from 'react';
import styles from './activityCard.module.css';
import { ArrowRight } from 'lucide-react';

interface ActivityCardProps {
  title: string;
  children: ReactNode;
  ctaText: string;
  infoLabel: string;
  infoValue?: string;
  handleClick?: () => void;
}

const ActivityCard = ({
  title,
  children,
  ctaText,
  infoLabel,
  infoValue,
  handleClick,
}: ActivityCardProps) => {
  return (
    <div className={styles.cardContainer}>
      <div className={styles.cardBody}>
        <p className={styles.cardTitle}>{title}</p>
        <div className={styles.cardContent}>
          {children}
        </div>
      </div>
      <div className={styles.cardFooter}>
        <div className={styles.cardInfo}>
          <p className={styles.cardInfoLabel}>{infoLabel}</p>
          <p className={styles.cardInfoValue}>{infoValue}</p>
        </div>
        <button
          className={styles.cardButton}
          onClick={handleClick}
        >
          {ctaText}
          <ArrowRight
            size={18}
            strokeWidth={3}
          />
        </button>
      </div>
    </div>
  );
};

export default ActivityCard;