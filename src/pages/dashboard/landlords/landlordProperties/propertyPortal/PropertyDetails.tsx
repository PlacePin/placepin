import styles from './propertyDetails.module.css';

const PropertyDetails = () => {
  return (
    <div className={styles.detailsWrapper}>
      <div>Square Feet</div>
      <div>Trash Pickup</div>
      <div>Electrician Last Updated</div>
      <div>Boiler Last Updated</div>
      <div>Closest Public Commutes</div>
      <div>Average Unit Sizes</div>
    </div>
  )
}

export default PropertyDetails