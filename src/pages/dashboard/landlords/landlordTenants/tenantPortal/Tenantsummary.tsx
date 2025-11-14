import styles from './tenantSummary.module.css';

const TenantSummary = () => {
  return (
    <div
      className={`${styles.wrapperDisplays} ${styles.summaryWrapper}`}
    >
      <div
        className={styles.photoSection}
      >
        <img
          src='/housing.jpg'
          alt='profile pic'
          className={styles.profilePic}
        />
      </div>
      <div
        className={styles.wrapperDisplays}
      >
        <div
          className={styles.tenantDetails}
        >
          <div
            className={`${styles.defaultCardStyles} ${styles.daysAsTenant}`}
          >
            Days as Tenant
          </div>
          <div
            className={`${styles.defaultCardStyles} ${styles.expenses}`}
          >
            Expenses
          </div>
        </div>
        <div>
          <div
            className={`${styles.defaultCardStyles} ${styles.rent}`}
          >
            Rent Payment
          </div>
        </div>
      </div>
      <div
        className={`${styles.defaultCardStyles} ${styles.misc}`}
      >
        Promos
      </div>
    </div>
  )
}
export default TenantSummary
