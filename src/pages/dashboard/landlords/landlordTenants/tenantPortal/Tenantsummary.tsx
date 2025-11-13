import styles from './tenantSummary.module.css';

const TenantSummary = () => {
  return (
    <div className={styles.summaryWrapper}>
      <div className={styles.photoSection}>
        Pic section
      </div>
      <div className={styles.tenantDetailsWrapper}>
        <div className={styles.tenantDetails}>
          <div className={styles.daysAsTenant}>Days as Tenant</div>
          <div className={styles.expenses}>Expenses</div>
        </div>
        <div>
          <div className={styles.rent}>Rent Payment</div>
        </div>
      </div>
      <div className={styles.misc}>Promos</div>
    </div>
  )
}
export default TenantSummary
