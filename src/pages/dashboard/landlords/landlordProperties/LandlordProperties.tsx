import styles from './landlordProperties.module.css';

const LandlordProperties = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.noData}>No Data</h2>
      <div className={styles.noDataButtonContainer}>
        <button className={styles.button}>Add Property</button>
      </div>
    </div>
  )
}

export default LandlordProperties