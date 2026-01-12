import styles from './tenantActivity.module.css';
import EngagementPatternsChart from '../../../../../components/charts/EngagementPatternsChart';
import MaintenanceRequestChart from '../../../../../components/charts/MaintenanceRequestChart';

interface TenantActivityProps {
  rentPayments: Record<string, any>[];
  maintenanceRequest: Record<string, any>
}

const TenantActivity = ({
  rentPayments,
  maintenanceRequest,
}: TenantActivityProps) => {

  const rentPaymentsMapped = rentPayments.map((rentPayment, i) => {
    return (
      <div key={i} className={styles.rentPayment}>
        <p>
          <span className={styles.rentAmount}>
            {`$${rentPayment.rentAmount}`}
          </span>
          {' a month Paid On: '}
          <span className={styles.date}>
            {rentPayment.monthPaid}
          </span>
        </p>
      </div>
    )
  })

  const noPaymentHistory = (
    <div className={styles.noPaymentHistoryWrapper}>
      <h2 className={styles.noPaymentHistoryText}>
        No Payment History Yet
      </h2>
    </div>
  )

  return (
    <div className={styles.activityWrapper}>
      <div className={styles.paymentMaintenance}>
        <div className={`${styles.defaultCardStyles} ${styles.payment}`}>
          <p className={styles.title}>Payment History</p>
          {rentPayments.length ?
            rentPaymentsMapped :
            noPaymentHistory
          }
        </div>
        <div className={`${styles.defaultCardStyles} ${styles.maintenance}`}>
          <p className={styles.title}>Maintenance Request</p>
          <div className={styles.chartSection}>
            <MaintenanceRequestChart
              maintenanceRequest={maintenanceRequest}
            />
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