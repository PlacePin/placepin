import { CircleDollarSign, Minus, TrendingDown, TrendingUp, Users, Wallet } from 'lucide-react';
import styles from './statsOverviewCard.module.css';
import StatOverview from './StatOverview';

const StatsOverviewCard = () => {
  return (
    <div className={styles.wrapper}>
      <StatOverview
        title='Expected Income'
        value={`$5000`}
        changeThisMonth={'~8%'}
        arrowClassName={styles.arrowDown}
        className={styles.dollarSignIcon}
        icon={
          <CircleDollarSign
            size={50}
            color='#00AC4F'
          />
        }
        trend={
          <TrendingDown
            size={24}
          />
        }
      />
      <StatOverview
        title='Tenants'
        value={`2`}
        changeThisMonth={'0 new'}
        arrowClassName={styles.neutral}
        className={styles.usersIcon}
        icon={
          <Users
            size={50}
            color='#0F5FC2'
          />
        }
        trend={
          <Minus
            size={24}
          />
        }
      />
      <StatOverview
        title='Expenses'
        value={`$500`}
        changeThisMonth={'~6%'}
        arrowClassName={styles.arrowUp}
        className={styles.expensesIcon}
        icon={
          <Wallet
            size={50}
            color='#DA001A'
          />
        }
        trend={
          <TrendingUp
            size={24}
          />
        }
      />
    </div>
  )
}

export default StatsOverviewCard