import styles from './tenantActivity.module.css';

const TenantActivity = () => {
  return (
    <div className={styles.activityWrapper}>
      <div className={styles.paymentMaintenance}>
        <div className={styles.payment}>
          Payment History
        </div>
        <div className={styles.maintenance}>
          Maintenance Request 
        </div>
      </div>
      <div className={styles.engagement}>
        Engagement Patterns
      </div>
    </div>
  )
}

export default TenantActivity