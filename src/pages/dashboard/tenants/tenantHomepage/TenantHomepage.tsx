import styles from './tenantHompage.module.css';
import { useGetAxios } from '../../../../hooks/useGetAxios';
import ActivityCard from '../../../../components/cards/tenant/activityCard';
import { getOrdinalSuffix } from '../../../../utils/getOrdinalSuffix';

const TenantHomepage = () => {

  const { data, error } = useGetAxios(`/api/users`)

  if (!data) {
    return <div>{'Loading Data'}</div>
  }

  if (error) {
    return <div>{"Something went wrong, but don't panic, we'll fix it!"}</div>
  }

  const rentAmountExpected = data.user.rentAmountExpected;

  return (
    <div className={styles.landlordHomepageContainer}>
      <h2>
        Upcoming / Recent Activity
      </h2>
      <div className={styles.statsCards}>
        <ActivityCard
          title="Rent Due"
          ctaText="Pay rent"
          infoLabel="Due date"
          infoValue={rentAmountExpected.dueDate ? `${rentAmountExpected.dueDate}${getOrdinalSuffix(rentAmountExpected.dueDate)} of each month` : 'N/A'}
          handleClick={() => { }}
        >
          <div className={styles.rentAmount}>
            <span className={styles.rentCurrencySymbol}>$</span>
            <span className={styles.rentAmountValue}>
              {rentAmountExpected.amount ? rentAmountExpected.amount.toLocaleString(): 'N/A'}
            </span>
            <span className={styles.rentAmountSuffix}>/mo</span>
          </div>
        </ActivityCard>
      </div>
    </div>
  )
}

export default TenantHomepage