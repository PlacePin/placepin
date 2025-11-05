import { ArrowDown, ArrowUp, CircleDollarSign, Users, Wallet } from 'lucide-react';
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
          <ArrowDown
            size={24}
          />
        }
        arrowClassName={styles.arrowDown}
      />
      <StatOverview
        title='Expected Income'
        value={`2`}
        changeThisMonth={'0 new'}
        icon={
          <Users
            size={50}
            color='#0F5FC2'
          />
        }
        className={styles.usersIcon}
      />
      <StatOverview
        title='Expected Income'
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
          <ArrowUp
            size={24}
          />
        }
        arrowClassName={styles.arrowUp}
      />
    </div>
  )
}

export default StatsOverviewCard