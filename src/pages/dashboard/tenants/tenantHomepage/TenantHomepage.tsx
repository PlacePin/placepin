import StatsKPICard from '../../../../components/cards/landlord/StatsKPICard';
import styles from './tenantHompage.module.css';
import { useGetAxios } from '../../../../hooks/useGetAxios';

const TenantHomepage = () => {

  const { data, error } = useGetAxios(`/api/users`)

  if (!data) {
    return <div>{'Loading Data'}</div>
  }

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  const rentAmountExpected = data.user.rentAmountExpected;

  const rentDueInfo = (
    <div>
      <p>Your rent is{' '}
        <span className={styles.infoText}>
          ${rentAmountExpected.amount}
        </span>
        , due on the{' '}
        <span className={styles.infoText}>
          {rentAmountExpected.dueDate}th.
        </span>
      </p>
    </div>
  )

  return (
    <div className={styles.landlordHomepageContainer}>
      <h2>
        Upcoming / Recent Activity
      </h2>
      <div className={styles.statsCards}>
        <StatsKPICard
          title={'Rent Due'}
          ctaText={'Pay Rent'}
          handleClick={() => { }}
        >
          {rentAmountExpected.dueDate ? rentDueInfo : 'Not sure'}
        </StatsKPICard>
      </div>
    </div>
  )
}

export default TenantHomepage