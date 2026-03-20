import { CircleDollarSign, Minus, TrendingDown, TrendingUp, Users, Wallet } from 'lucide-react';
import styles from './statsOverviewCard.module.css';
import StatOverview from './StatOverview';

interface StatsOverviewCardProps {
  numberOfTenants: number,
  totalExpectedIncome: number,
  totalExpenses: number,
  incomeChange: number | null,
  expensesChange: number | null,
  tenantChange: number | null,
}

function formatChange(change: number | null, suffix: string = '%') {
  if (change === null) return 'N/A';
  if (change === 0) return `No change`;
  return change > 0 ? `+${change}${suffix}` : `${change}${suffix}`;
}

function getTrend(change: number | null) {
  if (change === null || change === 0) return 'neutral';
  return change > 0 ? 'up' : 'down';
}

const StatsOverviewCard = ({
  numberOfTenants,
  totalExpectedIncome,
  totalExpenses,
  incomeChange,
  expensesChange,
  tenantChange
}: StatsOverviewCardProps) => {

  const incomeTrend = getTrend(incomeChange);
  const expensesTrend = getTrend(expensesChange);
  const tenantTrend = getTrend(tenantChange);

  return (
    <div className={styles.wrapper}>
      <StatOverview
        title='Expected Income'
        value={`$${totalExpectedIncome.toLocaleString('en-US')}`}
        changeThisMonth={formatChange(incomeChange)}
        arrowClassName={incomeTrend === 'up' ? styles.arrowUp : incomeTrend === 'down' ? styles.arrowDown : styles.neutral}
        className={styles.dollarSignIcon}
        icon={<CircleDollarSign size={50} color='#00AC4F' />}
        trend={incomeTrend === 'up' ? <TrendingUp size={24} /> : incomeTrend === 'down' ? <TrendingDown size={24} /> : <Minus size={24} />}
      />
      <StatOverview
        title='Tenants'
        value={`${numberOfTenants}`}
        changeThisMonth={formatChange(tenantChange, ' new')}
        arrowClassName={tenantTrend === 'up' ? styles.arrowUp : tenantTrend === 'down' ? styles.arrowDown : styles.neutral}
        className={styles.usersIcon}
        icon={<Users size={50} color='#0F5FC2' />}
        trend={tenantTrend === 'up' ? <TrendingUp size={24} /> : tenantTrend === 'down' ? <TrendingDown size={24} /> : <Minus size={24} />}
      />
      <StatOverview
        title='Expenses'
        value={`$${totalExpenses.toLocaleString('en-US')}`}
        changeThisMonth={formatChange(expensesChange)}
        arrowClassName={expensesTrend === 'up' ? styles.arrowUp : expensesTrend === 'down' ? styles.arrowDown : styles.neutral}
        className={styles.expensesIcon}
        icon={<Wallet size={50} color='#DA001A' />}
        trend={expensesTrend === 'up' ? <TrendingUp size={24} /> : expensesTrend === 'down' ? <TrendingDown size={24} /> : <Minus size={24} />}
      />
    </div>
  )
}

export default StatsOverviewCard