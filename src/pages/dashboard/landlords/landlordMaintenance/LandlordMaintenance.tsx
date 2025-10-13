import styles from './landlordMaintenance.module.css';

const LandlordMaintenance = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.noData}>Hire a Tradesman</h2>
      <div className={styles.noDataButtonContainer}>
        <button className={styles.button}>Find Tradesman</button>
      </div>
    </div>
  )
}

export default LandlordMaintenance