import styles from './propertySummary.module.css';

const PropertySummary = () => {
  return (
    <section className={styles.summaryWrapper}>
      <div>
        <img 
        src='/townhouse.png'
        alt='housing picture'
        className={styles.image}
        />
        </div>
      <div>stats</div>
      <div>Work Orders</div>
      <div>retainers</div>
    </section>
  )
}

export default PropertySummary