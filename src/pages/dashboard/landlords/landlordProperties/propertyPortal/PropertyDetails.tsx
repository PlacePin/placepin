import styles from './propertyDetails.module.css';

const PropertyDetails = () => {
  return (
    <div className={styles.detailsContainer}>
      <div className={styles.header}>
        <h4>
          Property Details
        </h4>
      </div>
      <div className={styles.detailsWrapper}>
        <div className={styles.sectionContainers}>
          <span className={styles.values}>
            {'4000'}
          </span>
          <p>Square Feet</p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.values}>
            {'Wednesday'}
          </span>
          <p>Trash Pickup</p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.values}>
            {'October 2022'}
          </span>
          <p>Electrician Last Updated</p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.values}>
            {'N/A'}
          </span>
          <p>Boiler Last Updated</p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.values}>
            {'Bus - 1 min walk'}
          </span>
          <p>Closest Public Commutes</p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.values}>
            {'500 SQF'}
          </span>
          <p>Average Unit Sizes</p>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails