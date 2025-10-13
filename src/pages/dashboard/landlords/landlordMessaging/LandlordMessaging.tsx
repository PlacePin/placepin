import styles from './landlordMessaging.module.css'

const LandlordMessaging = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.noData}>No Data</h2>
      <div className={styles.noDataButtonContainer}>
        <button className={styles.button}>Start a message</button>
      </div>
    </div>
  )
}

export default LandlordMessaging