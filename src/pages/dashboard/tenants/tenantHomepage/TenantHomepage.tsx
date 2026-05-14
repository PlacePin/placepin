import StatsKPICard from '../../../../components/cards/landlord/StatsKPICard';
import styles from './tenantHompage.module.css';

const TenantHomepage = () => {
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
          ''
        </StatsKPICard>
      </div>
    </div>
  )
}

export default TenantHomepage