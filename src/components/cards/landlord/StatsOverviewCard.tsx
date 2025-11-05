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
        icon={
          <CircleDollarSign
            size={50}
            color='#00AC4F'
          />
        }
        className={styles.dollarSignIcon}
        trend={
          <TrendingDown
            size={24}
          />
        }
        arrowClassName={styles.arrowDown}
      />
      <StatOverview
        title='Tenants'
        value={`2`}
        changeThisMonth={'0 new'}
        icon={
          <Users
            size={50}
            color='#0F5FC2'
          />
        }
        className={styles.usersIcon}
        trend={
          <Minus
            size={24}
          />
        }
        arrowClassName={styles.neutral}
      />
      <StatOverview
        title='Expenses'
        value={`$500`}
        changeThisMonth={'~6%'}
        icon={
          <Wallet
            size={50}
            color='#DA001A'
          />
        }
        className={styles.expensesIcon}
        trend={
          <TrendingUp
            size={24}
          />
        }
        arrowClassName={styles.arrowUp}
      />
    </div>
  )
}

export default StatsOverviewCard