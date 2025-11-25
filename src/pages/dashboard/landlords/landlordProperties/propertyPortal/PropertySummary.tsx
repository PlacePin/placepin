import WorkOrdersChart from '../../../../../components/charts/WorkOrdersChart';
import styles from './propertySummary.module.css';

interface PropertySummaryProps {
  residents: number;
  numberOfUnits: number;
  vacancy: number;
}

const PropertySummary = ({
  residents,
  numberOfUnits,
  vacancy,
}: PropertySummaryProps) => {
  let residentFallback: string;
  if(numberOfUnits && vacancy){
    residentFallback = `${(numberOfUnits - vacancy)}`
  } else {
    residentFallback = '-'
  }

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
            {residents || residentFallback}
          </span>
          <h3>
            Residents
          </h3>
        </div>
        <div className={styles.miniPropertyInfo}>
          <span>
            {vacancy || '-'}
          </span>
          <h3>
            Vacancy
          </h3>
        </div>
        <div className={styles.miniPropertyInfo}>
          <span>
            {numberOfUnits || '-'}
          </span>
          <h3>
            Units
          </h3>
        </div>
      </div>
      <WorkOrdersChart />
      <div>retainers</div>
    </section>
  )
}

export default PropertySummary