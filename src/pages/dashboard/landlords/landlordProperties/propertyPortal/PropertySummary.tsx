import WorkOrdersChart from '../../../../../components/charts/WorkOrdersChart';
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
      <div className={styles.miniPropertyInfoContainer}>
        <div className={styles.miniPropertyInfo}>
          <span>
            {2}
          </span>
          <h3>
            Residents
          </h3>
        </div>
        <div className={styles.miniPropertyInfo}>
          <span>
            {1}
          </span>
          <h3>
            Vacancy
          </h3>
        </div>
        <div className={styles.miniPropertyInfo}>
          <span>
            {3}
          </span>
          <h3>
            Units
          </h3>
        </div>
      </div>
      <div><WorkOrdersChart /></div>
      <div>retainers</div>
    </section>
  )
}

export default PropertySummary