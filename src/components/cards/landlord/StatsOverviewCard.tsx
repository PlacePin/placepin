import { CircleDollarSign, Users, Wallet } from 'lucide-react';
import styles from './statsOverviewCard.module.css';

const StatsOverviewCard = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.sectionContainer}>
        <div className={`${styles.iconWrapper} ${styles.dollarSignIcon}`}>
          <CircleDollarSign
            size={50}
            color='#00AC4F'
          />
        </div>
        <div className={styles.sectionContent}>
          <span className={styles.title}>
            Expected Income
          </span>
          <h2>
            {`$${5000}`}
          </h2>
          <span>
            {`~0%`} this month
          </span>
        </div>
      </div>
      <div className={styles.sectionContainer}>
        <div className={`${styles.iconWrapper} ${styles.usersIcon}`}>
          <Users
            size={50}
            color='#0F5FC2'
          />
        </div>
        <div className={styles.sectionContent}>
          <span className={styles.title}>
            Total Tenants
          </span>
          <h2>
            {2}
          </h2>
          <span>
            {0} new this month
          </span>
        </div>
      </div>
      <div className={styles.sectionContainer}>
        <div className={`${styles.iconWrapper} ${styles.expensesIcon}`}>
          <Wallet
            size={50}
            color='#DA001A'
          />
        </div>
        <div className={styles.sectionContent}>
          <span className={styles.title}>
            Expenses
          </span>
          <h2>
            {`$${500}`}
          </h2>
          <span>
            {`~6%`} this month
          </span>
        </div>
      </div>
    </div>
  )
}

export default StatsOverviewCard