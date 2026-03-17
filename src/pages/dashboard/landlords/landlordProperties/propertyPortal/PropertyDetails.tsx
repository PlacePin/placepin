import styles from './propertyDetails.module.css';

interface PropertyDetailsProps {
  lotSize: number,
  trashPickup: string,
  electricianLastUpdate: Date | null,
  boilerLastUpdated: Date | null,
  closestPublicCommutes: string,
  averageUnitSize: number,
}

const PropertyDetails = ({
  lotSize,
  trashPickup,
  electricianLastUpdate,
  boilerLastUpdated,
  closestPublicCommutes,
  averageUnitSize,
}: PropertyDetailsProps) => {
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
            {lotSize ? `${lotSize}` : 'N/A'}
          </span>
          <p>Lot Size</p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.values}>
            {trashPickup ? trashPickup : 'N/A'}
          </span>
          <p>Trash Pickup</p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.values}>
            {electricianLastUpdate ?
              new Date(electricianLastUpdate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
              'N/A'}
          </span>
          <p>Electrician Last Updated</p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.values}>
            {boilerLastUpdated ?
              new Date(boilerLastUpdated).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) :
              'N/A'}
          </span>
          <p>Boiler Last Updated</p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.values}>
            {closestPublicCommutes ? closestPublicCommutes : 'N/A'}
          </span>
          <p>Closest Public Commutes</p>
        </div>
        <div className={styles.sectionContainers}>
          <span className={styles.values}>
            {averageUnitSize ? `${averageUnitSize} SQF` : 'N/A'}
          </span>
          <p>Average Unit Sizes</p>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails