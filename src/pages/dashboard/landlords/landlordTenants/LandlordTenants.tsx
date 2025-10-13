import styles from './landlordTenants.module.css'

const LandlordTenants = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.noData}>No Data</h2>
      <div className={styles.noDataButtonContainer}>
        <button className={styles.button}>Invite Tenants</button>
      </div>
    </div>
  )
}

export default LandlordTenants