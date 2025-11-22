import styles from './propertySummary.module.css';

const PropertySummary = () => {
  return (
    <section className={styles.summaryWrapper}>
      <div>img</div>
      <div>stats</div>
      <div>Work Orders</div>
      <div>retainers</div>
    </section>
  )
}

export default PropertySummary