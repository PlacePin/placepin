import styles from './statOverview.module.css';
import type { ReactNode } from 'react';

interface StatOverviewProps {
  title: string,
  value: string,
  changeThisMonth: string,
  icon: ReactNode,
  className: string,
  trend?: ReactNode,
  arrowClassName?: string,
}

const StatOverview = ({
  title,
  value,
  changeThisMonth,
  icon,
  className,
  trend,
  arrowClassName
}: StatOverviewProps) => {
  return (
    <div className={styles.sectionContainer}>
      <div className={`${styles.iconWrapper} ${className}`}>
        {icon}
      </div>
      <div className={styles.sectionContent}>
        <span className={styles.title}>
          {title}
        </span>
        <h2>
          {value}
        </h2>
        <p className={styles.trend}>
          <span
            className={`${arrowClassName} ${styles.arrow}`}
          >
            {trend}{changeThisMonth}
          </span>
          this month
        </p>
      </div>
    </div>
  )
}

export default StatOverview