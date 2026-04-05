import WorkOrdersChart from '../../../../../components/charts/WorkOrdersChart';
import styles from './propertySummary.module.css';
import townhouse from '../../../../../assets/townhouse.png';

interface PropertySummaryProps {
  residents: number;
  numberOfUnits: number;
  vacancy: number;
  address: string;
  landlordId: string;
  propertyId: string;
}

const PropertySummary = ({
  residents,
  numberOfUnits,
  vacancy,
  address,
  landlordId,
  propertyId,
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
          src={townhouse}
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
      <WorkOrdersChart
        landlordId={landlordId}
        propertyId={propertyId}
      />
      <div className={styles.siteStaffContainer}>
        <h3>Site Staff/Retainers</h3>
        <p>{`Address: ${address}`}</p>
        <div className={styles.siteStaffBody}>
          <p>None</p>
        </div>
      </div>
    </section>
  )
}

export default PropertySummary