import styles from './tenantLogbook.module.css';

const TenantLogbook = () => {
  return (
    <div className={styles.logbookWrapper}>
      <p className={styles.title}>Logbook</p>
      <div className={styles.infoContainer}>
        <p>Landlord References: <span>{'They were great!'}</span></p>
        <p>Income: <span>{'$95,000'}</span></p>
        <p>Job: <span>{'Software Engineer'}</span></p>
        <p>Age: <span>{27}</span></p>
        <p>Section 8: <span>{'Yes'}</span></p>
        <p>Government Assistants: <span>{'Yes'}</span></p>
        <p>Disability: <span>{'True'}</span></p>
      </div>
    </div>
  )
}

export default TenantLogbook