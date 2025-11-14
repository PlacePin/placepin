import styles from './tenantActivity.module.css';

const TenantActivity = () => {
  return (
    <div className={styles.activityWrapper}>
      <div className={styles.paymentMaintenance}>
        <div className={`${styles.defaultCardStyles} ${styles.payment}`}>
          Payment History
        </div>
        <div className={`${styles.defaultCardStyles} ${styles.maintenance}`}>
          Maintenance Request 
        </div>
      </div>
      <div className={`${styles.defaultCardStyles} ${styles.engagement}`}>
        Engagement Patterns
      </div>
    </div>
  )
}

export default TenantActivity