import styles from './tenantActivity.module.css';
import EngagementPatternsChart from '../../../../../components/charts/EngagementPatternsChart';
import MaintenanceRequestChart from '../../../../../components/charts/MaintenanceRequestChart';

const TenantActivity = () => {

  const rentPayments = [
    { rent: 3000, paid: '11/1/25' },
    { rent: 3000, paid: '10/1/25' },
    { rent: 3000, paid: '9/1/25' },
    { rent: 3000, paid: '8/1/25' },
    { rent: 3000, paid: '7/1/25' },
    { rent: 3000, paid: '6/1/25' },
    { rent: 3000, paid: '5/1/25' },
  ]

  const rentPaymentsMapped = rentPayments.map((rentPayment, i) => {
    return (
      <div key={i} className={styles.rentPayment}>
        <p>
          <span className={styles.rentAmount}>{rentPayment.rent}</span> a month Paid On: <span className={styles.date}>{rentPayment.paid}</span>
        </p>
      </div>
    )
  })

  return (
    <div className={styles.activityWrapper}>
      <div className={styles.paymentMaintenance}>
        <div className={`${styles.defaultCardStyles} ${styles.payment}`}>
          <p className={styles.title}>Payment History</p>
          {rentPaymentsMapped}
        </div>
        <div className={`${styles.defaultCardStyles} ${styles.maintenance}`}>
          <p className={styles.title}>Maintenance Request</p>
          <div className={styles.chartSection}>
            <MaintenanceRequestChart />
          </div>
        </div>
      </div>
      <div className={`${styles.defaultCardStyles} ${styles.engagement}`}>
        <p className={styles.title}>Engagement Patterns</p>
        <EngagementPatternsChart />
      </div>
    </div>
  )
}

export default TenantActivity